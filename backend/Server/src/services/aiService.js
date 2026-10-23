// src/services/aiService.js
// ---------------------------------------------------------------------------
// One function — askAI() — that the rest of the app uses. It hides which AI
// provider each feature uses.
//
// This project uses TWO AI platforms side by side:
//
//   • Anthropic (Claude) — strong reasoning + vision → Repo Explainer and the
//                           PDF & Image Explainer.
//   • Hugging Face        — free Inference API        → Tutor, Bug Explainer,
//                           Error Translator, Code Improver, Problem Generator.
//
// The mapping lives in FEATURE_PROVIDER below. To move a feature to a different
// platform, just change its value there — no other code changes needed.
//
// A global AI_PROVIDER in .env can still act as an override, and any feature
// with no key configured degrades gracefully to "mock" so the whole project
// keeps running even without keys.
// ---------------------------------------------------------------------------

import { SYSTEM_PROMPTS, buildUserMessage } from './prompts.js';

// ---- Per-feature provider map ----------------------------------------------
// Values: "anthropic" | "huggingface" | "gemini" | "openai" | "groq"
const FEATURE_PROVIDER = {
  // Every feature runs on Claude (Anthropic) now.
  repoOverview: 'anthropic',
  fileExplain: 'anthropic',
  docExplain: 'anthropic',
  tutor: 'anthropic',
  bugExplainer: 'anthropic',
  errorTranslator: 'anthropic',
  codeImprover: 'anthropic',
  problemGenerator: 'anthropic',
};

// Optional global override. If AI_PROVIDER is set to a real provider it wins for
// every feature; if it's "mock" (or unset) we use the per-feature map above.
const GLOBAL_OVERRIDE = (process.env.AI_PROVIDER || '').toLowerCase();

// Which provider should a given feature use?
function providerFor(feature) {
  if (GLOBAL_OVERRIDE && GLOBAL_OVERRIDE !== 'mock') return GLOBAL_OVERRIDE;
  return FEATURE_PROVIDER[feature] || 'mock';
}

// How long (ms) we wait for an AI provider before giving up.
const AI_TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS || 30000);

// fetch() with a hard timeout so a slow/hanging provider can't freeze a request.
async function fetchWithTimeout(url, options = {}, timeoutMs = AI_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (err.name === 'AbortError') throw new Error(`AI request timed out after ${timeoutMs}ms`);
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

// Config for the OpenAI-compatible providers.
// OpenAI, Groq, and Hugging Face's router all speak the SAME /chat/completions API.
const OPENAI_COMPAT = {
  openai: {
    baseURL: 'https://api.openai.com/v1',
    key: () => process.env.OPENAI_API_KEY,
    model: () => process.env.OPENAI_MODEL || 'gpt-4o-mini',
    visionModel: () => process.env.OPENAI_MODEL || 'gpt-4o-mini',
  },
  groq: {
    baseURL: 'https://api.groq.com/openai/v1',
    key: () => process.env.GROQ_API_KEY,
    model: () => process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
    visionModel: () => process.env.GROQ_VISION_MODEL || 'meta-llama/llama-4-scout-17b-16e-instruct',
  },
  huggingface: {
    // Hugging Face Inference Providers — OpenAI-compatible router endpoint.
    baseURL: 'https://router.huggingface.co/v1',
    key: () => process.env.HF_API_KEY || process.env.HUGGINGFACE_API_KEY,
    model: () => process.env.HF_MODEL || 'meta-llama/Llama-3.1-8B-Instruct',
    visionModel: () => process.env.HF_VISION_MODEL || 'meta-llama/Llama-3.2-11B-Vision-Instruct',
  },
};

// ---- Provider: Google Gemini ----------------------------------------------
async function callGemini(systemPrompt, userMessage) {
  const key = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

  const res = await fetchWithTimeout(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: 'user', parts: [{ text: userMessage }] }],
    }),
  });

  if (!res.ok) throw new Error(`Gemini API error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

// ---- Provider: OpenAI-compatible (OpenAI / Groq / Hugging Face) — text -----
async function callOpenAICompat(provider, systemPrompt, userMessage) {
  const cfg = OPENAI_COMPAT[provider];
  const res = await fetchWithTimeout(`${cfg.baseURL}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cfg.key()}` },
    body: JSON.stringify({
      model: cfg.model(),
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.4,
    }),
  });

  if (res.status === 429) throw new Error(`${provider} rate limit hit (429)`);
  if (!res.ok) throw new Error(`${provider} API error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? '';
}

// ---- Provider: Anthropic (Claude) — text + vision --------------------------
// Uses Anthropic's Messages API. `image` (optional) = { base64, mimeType }.
// `history` is an optional array of prior turns: [{ role:'user'|'assistant', text }]
// It lets the learner ask follow-up questions and have Claude remember the thread.
async function callAnthropic(systemPrompt, userMessage, image = null, history = []) {
  const key = process.env.ANTHROPIC_API_KEY;
  const model = process.env.ANTHROPIC_MODEL || 'claude-3-5-haiku-latest';

  // Build the current user turn: text, plus an image block for vision calls.
  const content = [{ type: 'text', text: userMessage }];
  if (image) {
    content.unshift({
      type: 'image',
      source: { type: 'base64', media_type: image.mimeType, data: image.base64 },
    });
  }

  // Prepend prior conversation turns (kept short by the caller), then this turn.
  const priorTurns = (Array.isArray(history) ? history : [])
    .filter((t) => t && t.text && (t.role === 'user' || t.role === 'assistant'))
    .map((t) => ({ role: t.role, content: [{ type: 'text', text: String(t.text) }] }));

  const messages = [...priorTurns, { role: 'user', content }];

  const res = await fetchWithTimeout('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 2048,
      system: systemPrompt,
      messages,
    }),
  });

  if (res.status === 429) throw new Error('anthropic rate limit hit (429)');
  if (!res.ok) throw new Error(`Anthropic API error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data?.content?.[0]?.text ?? '';
}

// ---- Provider: Mock (no key needed) ----------------------------------------
// Returns sensible, beginner-friendly placeholder text so the UI works offline.
function callMock(feature, payload) {
  const samples = {
    tutor: `**Simple meaning:** "${payload.message}" — eta ekta common programming concept.\n\n**Analogy:** Eta onekta real life er ekta jinis er moto kaj kore.\n\n**Example:**\n\`\`\`js\n// chhoto example\nconsole.log("Hello, learner!");\n\`\`\`\n\nValo korchho — questions kora mane tumi shikhchho! 🌱\n\n_(Demo response — set an API key in .env for real answers.)_`,
    bugExplainer: `**What's wrong:** Loop er condition e ektu somossa ache.\n\n**Why it happens:** \`i <= 5\` use korle loop 6 baar cholbe (0,1,2,3,4,5). Onek somoy eta array er bairer index touch kore — "out of bound".\n\n**Fixed code:**\n\`\`\`c\nfor (int i = 0; i < 5; i++) { /* ... */ }\n\`\`\`\n\n**Avoid it next time:** Array er size ar loop condition mileche kina always check koro.\n\n_(Demo response — configure an API key for real analysis.)_`,
    errorTranslator: `**Simple meaning:** Program emon ekta jaygae access korte cheyeche jeta tar jonno na.\n\n**Why it usually happens:** Object/pointer initialize na kore use kora, ba index range er bairer.\n\n**How to fix it:** Use korar age variable ti properly create/initialize hoyeche kina check koro.\n\n_(Demo response — configure an API key for real translations.)_`,
    codeImprover: `**What's good:** Logic ta clear ache 👍\n\n**Suggestions:**\n- Variable name aro descriptive koro (\`x\` er bodole \`count\`).\n- Nested loop thakle dekho hashmap diye faster kora jay kina.\n- Magic number er bodole named constant use koro.\n\n_(Demo response — configure an API key for real suggestions.)_`,
    problemGenerator: JSON.stringify({
      title: 'Sum of Array',
      statement: 'Ekta array deya ache. Sob element er sum print koro.',
      sampleInput: '5\\n1 2 3 4 5',
      sampleOutput: '15',
      hints: ['Ekta variable e sum rakho', 'Loop diye protita element add koro'],
      solution: '// loop diye add\nlet sum = 0;\nfor (const n of arr) sum += n;\nconsole.log(sum);',
      explanation: 'Ekta accumulator variable e protita element jog kori, sheshe print kori.',
    }),
    repoOverview: `**এক লাইনে:** এটা একটা সাধারণ প্রজেক্ট (demo response)।\n\n**কী কাজ করে:** README আর ফাইল লিস্ট দেখে AI পুরো প্রজেক্ট বুঝিয়ে দেবে।\n\n**শুরু করো এই ফাইল থেকে:** সাধারণত \`README.md\` আর main entry file (যেমন \`index.js\`/\`main.py\`) দিয়ে শুরু করো।\n\n_(Demo response — .env-এ একটা AI key বসালে আসল ব্যাখ্যা আসবে।)_`,
    fileExplain: `**এই ফাইলের কাজ:** এই ফাইলটা প্রজেক্টের একটা অংশ সামলায় (demo response)।\n\n**ধাপে ধাপে:** AI key বসালে এখানে ফাইলের প্রতিটা গুরুত্বপূর্ণ অংশ সহজ ভাষায় বুঝিয়ে দেওয়া হবে।\n\n_(Demo response — configure an AI key for real explanations.)_`,
    docExplain: `**এতে কী আছে:** আপলোড করা ডকুমেন্ট/ছবিটা এখানে সহজ ভাষায় ব্যাখ্যা করা হবে (demo response)।\n\n**সহজ ব্যাখ্যা:** AI key বসালে PDF-এর লেখা বা ছবির ভেতরের কোড/কনসেপ্ট পড়ে beginner-friendly ব্যাখ্যা আসবে।\n\n_(Demo response — ছবির জন্য Anthropic key লাগবে।)_`,
  };
  return samples[feature] ?? 'Demo response.';
}

// ---- Vision: Gemini (image input) -----------------------------------------
async function callGeminiVision(systemPrompt, userText, image) {
  const key = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

  const res = await fetchWithTimeout(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [
        {
          role: 'user',
          parts: [
            { text: userText },
            { inline_data: { mime_type: image.mimeType, data: image.base64 } },
          ],
        },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Gemini vision error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

// ---- Vision: OpenAI-compatible (OpenAI / Groq / Hugging Face) — image ------
async function callOpenAICompatVision(provider, systemPrompt, userText, image) {
  const cfg = OPENAI_COMPAT[provider];
  const res = await fetchWithTimeout(`${cfg.baseURL}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cfg.key()}` },
    body: JSON.stringify({
      model: cfg.visionModel(),
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: [
            { type: 'text', text: userText },
            { type: 'image_url', image_url: { url: `data:${image.mimeType};base64,${image.base64}` } },
          ],
        },
      ],
      temperature: 0.4,
    }),
  });
  if (res.status === 429) throw new Error(`${provider} rate limit hit (429)`);
  if (!res.ok) throw new Error(`${provider} vision error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? '';
}

// Does the chosen provider have a usable API key?
function providerHasKey(provider) {
  if (provider === 'gemini') return !!process.env.GEMINI_API_KEY;
  if (provider === 'openai') return !!process.env.OPENAI_API_KEY;
  if (provider === 'groq') return !!process.env.GROQ_API_KEY;
  if (provider === 'anthropic') return !!process.env.ANTHROPIC_API_KEY;
  if (provider === 'huggingface') return !!(process.env.HF_API_KEY || process.env.HUGGINGFACE_API_KEY);
  return false;
}

// Basic AI-output validation: reject empty / whitespace-only responses so we
// never show a blank card to the user.
// Turn a raw provider error string into a short, beginner-friendly reason.
function friendlyError(msg = '') {
  const m = String(msg);
  if (/401|authentication_error|invalid x-api-key/i.test(m))
    return 'Key ta bhul ba purono. console.anthropic.com -> API Keys -> notun key banao, .env e boshao, server restart koro.';
  if (/credit|balance|billing|402/i.test(m))
    return 'Account e credit nei. console.anthropic.com -> Billing -> credit add koro.';
  if (/404|not_found|model/i.test(m))
    return 'Model er nam/access somossa. .env e ANTHROPIC_MODEL=claude-haiku-4-5 dao.';
  if (/429|rate limit/i.test(m))
    return 'Rate limit — ektu por abar chesta koro.';
  if (/timed out|timeout|ENOTFOUND|ECONNREFUSED|fetch failed/i.test(m))
    return 'Internet/firewall somossa — api.anthropic.com e pouchhano jacche na.';
  return m;
}

function isUsable(text) {
  return typeof text === 'string' && text.trim().length > 0;
}

// Route a text request to the correct provider. `history` = prior turns (Claude only).
async function runText(provider, systemPrompt, userMessage, history = []) {
  if (provider === 'gemini') return callGemini(systemPrompt, userMessage);
  if (provider === 'anthropic') return callAnthropic(systemPrompt, userMessage, null, history);
  return callOpenAICompat(provider, systemPrompt, userMessage); // openai | groq | huggingface
}

// Route a vision request to the correct provider.
async function runVision(provider, systemPrompt, userText, image, history = []) {
  if (provider === 'gemini') return callGeminiVision(systemPrompt, userText, image);
  if (provider === 'anthropic') return callAnthropic(systemPrompt, userText, image, history);
  return callOpenAICompatVision(provider, systemPrompt, userText, image);
}

// ---- Public API ------------------------------------------------------------
// payload.history (optional): [{ role:'user'|'assistant', text }] — enables follow-ups.
export async function askAI(feature, payload) {
  const systemPrompt = SYSTEM_PROMPTS[feature];
  if (!systemPrompt) throw new Error(`Unknown AI feature: ${feature}`);

  const userMessage = buildUserMessage(feature, payload);
  const provider = providerFor(feature);
  const history = payload.history || [];

  // No real provider/key configured -> genuine demo mode (mock is expected here).
  if (provider === 'mock' || !providerHasKey(provider)) return callMock(feature, payload);

  try {
    const out = await runText(provider, systemPrompt, userMessage, history);
    if (isUsable(out)) return out;
    throw new Error('Empty response from AI provider');
  } catch (err) {
    // A key IS configured, so DON'T hide the failure behind a fake demo answer.
    // Show the real reason so it can actually be fixed.
    console.error(`[aiService] ${feature} via ${provider} failed:`, err.message);
    return `**\u26a0\ufe0f AI provider error (${provider}).**\n\n${friendlyError(err.message)}\n\n_(Eta demo noy \u2014 asol error.)_`;
  }
}

// Same idea as askAI, but for an image (vision). `image` = { base64, mimeType }.
export async function askAIVision(feature, payload, image) {
  const systemPrompt = SYSTEM_PROMPTS[feature];
  if (!systemPrompt) throw new Error(`Unknown AI feature: ${feature}`);

  const userText = buildUserMessage(feature, payload);
  const provider = providerFor(feature);
  const history = payload.history || [];

  if (provider === 'mock' || !providerHasKey(provider)) return callMock(feature, payload);

  try {
    const out = await runVision(provider, systemPrompt, userText, image, history);
    if (isUsable(out)) return out;
    throw new Error('Empty response from AI provider');
  } catch (err) {
    console.error(`[aiService] ${feature} vision via ${provider} failed:`, err.message);
    return `**\u26a0\ufe0f AI provider error (${provider}).**\n\n${friendlyError(err.message)}\n\n_(Eta demo noy \u2014 asol error.)_`;
  }
}

// Exported so docs/README (and tests) can show the mapping.
export { FEATURE_PROVIDER };
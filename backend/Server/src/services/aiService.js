// src/services/aiService.js
// ---------------------------------------------------------------------------
// One function — askAI() — that the rest of the app uses. It hides which AI
// provider we use. Set AI_PROVIDER in .env to "groq", "gemini", "openai", or "mock".
//
// "groq" is recommended for a $0 budget — Groq offers a generous free tier and
// is OpenAI-compatible. If no API key is configured, it automatically falls back
// to "mock" so the whole project runs WITHOUT any paid API.
// ---------------------------------------------------------------------------

import { SYSTEM_PROMPTS, buildUserMessage } from './prompts.js';

const PROVIDER = (process.env.AI_PROVIDER || 'mock').toLowerCase();

// Config for the OpenAI-compatible providers (OpenAI + Groq share the same API).
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
    // Groq's free vision model names change over time — make it configurable.
    visionModel: () => process.env.GROQ_VISION_MODEL || 'meta-llama/llama-4-scout-17b-16e-instruct',
  },
};

// ---- Provider: Google Gemini ----------------------------------------------
async function callGemini(systemPrompt, userMessage) {
  const key = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

  const res = await fetch(url, {
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

// ---- Provider: OpenAI-compatible (OpenAI / Groq) — text --------------------
async function callOpenAICompat(provider, systemPrompt, userMessage) {
  const cfg = OPENAI_COMPAT[provider];
  const res = await fetch(`${cfg.baseURL}/chat/completions`, {
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

  if (!res.ok) throw new Error(`${provider} API error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? '';
}

// ---- Provider: Mock (no key needed) ----------------------------------------
// Returns sensible, beginner-friendly placeholder text so the UI works offline.
function callMock(feature, payload) {
  const samples = {
    tutor: `**Simple meaning:** "${payload.message}" — eta ekta common programming concept.\n\n**Analogy:** Eta onekta real life er ekta jinis er moto kaj kore.\n\n**Example:**\n\`\`\`js\n// chhoto example\nconsole.log("Hello, learner!");\n\`\`\`\n\nValo korchho — questions kora mane tumi shikhchho! 🌱\n\n_(Demo response — set AI_PROVIDER + an API key in .env for real answers.)_`,
    bugExplainer: `**What I see:** Loop er condition e ektu somossa ache.\n\n**Line by line:** \`i <= 5\` use korle loop 6 baar cholbe (0,1,2,3,4,5). Onek somoy eta array er bairer index touch kore — "out of bound".\n\n**Fixed code:**\n\`\`\`c\nfor (int i = 0; i < 5; i++) { /* ... */ }\n\`\`\`\n\n**How to avoid this next time:** Array er size ar loop condition mileche kina always check koro.\n\n_(Demo response — configure an API key for real analysis.)_`,
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
    docExplain: `**এতে কী আছে:** আপলোড করা ডকুমেন্ট/ছবিটা এখানে সহজ ভাষায় ব্যাখ্যা করা হবে (demo response)।\n\n**সহজ ব্যাখ্যা:** AI key বসালে PDF-এর লেখা বা ছবির ভেতরের কোড/কনসেপ্ট পড়ে beginner-friendly ব্যাখ্যা আসবে।\n\n_(Demo response — ছবির জন্য Gemini/OpenAI vision key লাগবে।)_`,
  };
  return samples[feature] ?? 'Demo response.';
}

// ---- Vision: Gemini (image input) -----------------------------------------
async function callGeminiVision(systemPrompt, userText, image) {
  const key = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

  const res = await fetch(url, {
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

// ---- Vision: OpenAI-compatible (OpenAI / Groq) — image input ---------------
async function callOpenAICompatVision(provider, systemPrompt, userText, image) {
  const cfg = OPENAI_COMPAT[provider];
  const res = await fetch(`${cfg.baseURL}/chat/completions`, {
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
  if (!res.ok) throw new Error(`${provider} vision error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? '';
}

// Is there a usable API key for the current provider?
function providerHasKey() {
  if (PROVIDER === 'gemini') return !!process.env.GEMINI_API_KEY;
  if (PROVIDER === 'openai') return !!process.env.OPENAI_API_KEY;
  if (PROVIDER === 'groq') return !!process.env.GROQ_API_KEY;
  return false;
}

// ---- Public API ------------------------------------------------------------
export async function askAI(feature, payload) {
  const systemPrompt = SYSTEM_PROMPTS[feature];
  if (!systemPrompt) throw new Error(`Unknown AI feature: ${feature}`);

  const userMessage = buildUserMessage(feature, payload);

  try {
    if (PROVIDER === 'mock' || !providerHasKey()) return callMock(feature, payload);
    if (PROVIDER === 'gemini') return await callGemini(systemPrompt, userMessage);
    if (PROVIDER === 'openai' || PROVIDER === 'groq') return await callOpenAICompat(PROVIDER, systemPrompt, userMessage);
    return callMock(feature, payload);
  } catch (err) {
    // Never crash the request because of an AI hiccup — degrade gracefully.
    console.error('[aiService] falling back to mock:', err.message);
    return callMock(feature, payload);
  }
}

// Same idea as askAI, but for an image (vision). `image` = { base64, mimeType }.
export async function askAIVision(feature, payload, image) {
  const systemPrompt = SYSTEM_PROMPTS[feature];
  if (!systemPrompt) throw new Error(`Unknown AI feature: ${feature}`);
  const userText = buildUserMessage(feature, payload);

  try {
    if (PROVIDER === 'mock' || !providerHasKey()) return callMock(feature, payload);
    if (PROVIDER === 'gemini') return await callGeminiVision(systemPrompt, userText, image);
    if (PROVIDER === 'openai' || PROVIDER === 'groq') return await callOpenAICompatVision(PROVIDER, systemPrompt, userText, image);
    return callMock(feature, payload);
  } catch (err) {
    console.error('[aiService] vision falling back to mock:', err.message);
    return callMock(feature, payload);
  }
}

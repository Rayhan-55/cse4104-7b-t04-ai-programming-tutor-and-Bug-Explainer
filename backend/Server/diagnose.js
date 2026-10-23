// diagnose.js
// -----------------------------------------------------------------------------
// Ei file ta backend/server/ folder e rakho (jekhane .env ache), tarpor chalao:
//     node diagnose.js
//
// Eta tomar .env er ANTHROPIC_API_KEY diye Anthropic e ekta choto call kore,
// ar porishkar kore bole dey somossa ki: key thik / key bhul / credit nei /
// model bhul / internet somossa. Kono step-by-step lage na.
// -----------------------------------------------------------------------------
import 'dotenv/config';

const key = process.env.ANTHROPIC_API_KEY;
const model = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5';

console.log('\n==================== Anthropic Diagnosis ====================\n');

// --- 1) .env theke key poreche ki na ---
if (!key) {
  console.log('❌ ANTHROPIC_API_KEY pawa jay nai.');
  console.log('   -> .env file ta backend/server/ e ache to? (.env.example noy)');
  console.log('   -> line ta erokom hobe: ANTHROPIC_API_KEY=sk-ant-api03-...\n');
  process.exit(1);
}
if (!key.startsWith('sk-ant-')) {
  console.log('⚠️  Key ta "sk-ant-" diye shuru hoy nai — bhul key bosano hoyeche mone hoy.');
}
console.log('✅ Key .env theke porা hoyeche   (length: ' + key.length + ', shuru: ' + key.slice(0, 12) + '...)');
console.log('✅ Model: ' + model);
console.log('\nAnthropic e test call pathacchi...\n');

// --- 2) Asol call ---
try {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 20,
      messages: [{ role: 'user', content: 'Reply with the single word: ok' }],
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (res.ok) {
    const text = data?.content?.[0]?.text ?? '(empty)';
    console.log('🎉 SOB THIK ACHE! Claude theke uttor elo: "' + text.trim() + '"');
    console.log('   -> Tomar key + credit + model — sob kaj korche.');
    console.log('   -> Ekhon `npm run dev` diye app ta chalao, asol AI uttor pabe.\n');
    process.exit(0);
  }

  // --- Error gulo porishkar kore bojhai ---
  const type = data?.error?.type || '';
  const msg = data?.error?.message || JSON.stringify(data);
  console.log('❌ Anthropic error (HTTP ' + res.status + '):');
  console.log('   type: ' + type);
  console.log('   message: ' + msg + '\n');

  if (res.status === 401 || type === 'authentication_error') {
    console.log('👉 MANE: Key ta BHUL ba purono/bati.');
    console.log('   Somadhan: console.anthropic.com → API Keys → notun ekta key banao,');
    console.log('   .env er ANTHROPIC_API_KEY= er por boshao (quote/space chhara), server restart koro.\n');
  } else if (res.status === 400 && /credit|balance|billing/i.test(msg)) {
    console.log('👉 MANE: Account e CREDIT nei.');
    console.log('   Somadhan: console.anthropic.com → Billing → kichu credit add koro (minimum $5).\n');
  } else if (res.status === 404 || /model/i.test(msg)) {
    console.log('👉 MANE: Model er nam ba access e somossa.');
    console.log('   Somadhan: .env e ANTHROPIC_MODEL=claude-haiku-4-5 dao.\n');
  } else if (res.status === 429) {
    console.log('👉 MANE: Rate limit — beshi druto call hoyeche, ektu por abar try koro.\n');
  } else {
    console.log('👉 Upore message ta pore dekho, othoba amake pathao.\n');
  }
  process.exit(1);
} catch (err) {
  console.log('❌ Call ta pouchhai nai: ' + err.message);
  console.log('👉 MANE: Internet/firewall somossa, othoba api.anthropic.com block kora.');
  console.log('   WiFi/VPN change kore abar chesta koro.\n');
  process.exit(1);
}

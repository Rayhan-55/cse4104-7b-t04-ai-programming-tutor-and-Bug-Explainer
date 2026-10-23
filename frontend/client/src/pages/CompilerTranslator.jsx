// src/pages/CompilerTranslator.jsx
import { useState } from 'react';
import { AiAPI } from '../api/client.js';
import AIResultCard from '../components/AIResultCard.jsx';
import { useAiThread } from '../hooks/useAiThread.js';

const LANGS = ['c', 'cpp', 'java', 'python', 'javascript'];
const COMMON = ['Segmentation fault', 'NullPointerException', 'Time Limit Exceeded', 'IndexError: list index out of range'];

export default function CompilerTranslator() {
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const thread = useAiThread();

  const run = async (text) => {
    const msg = text ?? error;
    if (!msg.trim()) return;
    setError(msg);
    setLoading(true);
    setResult('');
    thread.reset();
    try {
      const answer = await AiAPI.error(msg, language);
      setResult(answer);
      thread.seed(`Translate this ${language} error: ${msg}`, answer);
    } catch {
      setResult('**Something went wrong.** Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="font-display text-2xl font-extrabold">🌐 Compiler Error Translator</h1>
      <p className="mt-1 text-sm text-muted">
        Paste a confusing compiler/runtime error. Get it in plain Bangla + English.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {COMMON.map((e) => (
          <button key={e} onClick={() => run(e)} className="rounded-full border border-line px-3 py-1.5 text-xs text-muted transition hover:border-teal/50 hover:text-teal">
            {e}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="input !w-auto text-sm">
          {LANGS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <textarea
          className="input min-h-[88px] flex-1 font-display text-[13px]"
          placeholder="Paste the full error message here…"
          value={error}
          onChange={(e) => setError(e.target.value)}
        />
      </div>
      <button className="btn-primary mt-3" disabled={loading} onClick={() => run()}>Translate error</button>

      <div className="mt-6">
        <AIResultCard
          loading={loading}
          result={result}
          emptyHint="The plain-language meaning will appear here."
          followUps={thread.followUps}
          onFollowUp={thread.ask}
          followUpLoading={thread.followUpLoading}
        />
      </div>
    </main>
  );
}

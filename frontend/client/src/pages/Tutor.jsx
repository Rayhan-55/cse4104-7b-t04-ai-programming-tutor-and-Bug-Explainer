// src/pages/Tutor.jsx
import { useState } from 'react';
import { AiAPI } from '../api/client.js';
import AIResultCard from '../components/AIResultCard.jsx';

const examples = ['What is an array?', 'Explain recursion simply', 'What is OOP?', 'Binary search example'];

export default function Tutor() {
  const [q, setQ] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const ask = async (text) => {
    const message = text ?? q;
    if (!message.trim()) return;
    setQ(message);
    setLoading(true);
    setResult('');
    try {
      setResult(await AiAPI.tutor(message));
    } catch {
      setResult('**Something went wrong.** Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="font-display text-2xl font-extrabold">🎓 AI Tutor</h1>
      <p className="mt-1 text-sm text-muted">Ask any programming concept. Answers stay simple and beginner-friendly.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {examples.map((e) => (
          <button key={e} onClick={() => ask(e)} className="rounded-full border border-line px-3 py-1.5 text-xs text-muted transition hover:border-amber/50 hover:text-amber">
            {e}
          </button>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          className="input"
          placeholder="e.g. What is a linked list?"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && ask()}
        />
        <button className="btn-primary" disabled={loading} onClick={() => ask()}>Ask</button>
      </div>

      <div className="mt-6">
        <AIResultCard loading={loading} result={result} emptyHint="Your tutor's answer will appear here." />
      </div>
    </main>
  );
}

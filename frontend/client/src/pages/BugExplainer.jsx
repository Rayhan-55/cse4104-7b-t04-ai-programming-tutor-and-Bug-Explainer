// src/pages/BugExplainer.jsx
import { useState } from 'react';
import { AiAPI } from '../api/client.js';
import CodeEditor from '../components/CodeEditor.jsx';
import AIResultCard from '../components/AIResultCard.jsx';

const LANGS = ['c', 'cpp', 'java', 'python', 'javascript'];
const SAMPLE = `for (int i = 0; i <= 5; i++) {\n    arr[i] = i * 2;\n}`;

export default function BugExplainer() {
  const [code, setCode] = useState(SAMPLE);
  const [language, setLanguage] = useState('cpp');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setResult('');
    try {
      setResult(await AiAPI.bug(code, language));
    } catch {
      setResult('**Something went wrong.** Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="font-display text-2xl font-extrabold">🐞 Bug Explainer</h1>
      <p className="mt-1 text-sm text-muted">Paste your code. Get the bug explained line-by-line — and the fix.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="input !w-auto !py-1.5 text-sm">
              {LANGS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            <button className="btn-primary !py-2" disabled={loading} onClick={run}>Explain bug</button>
          </div>
          <CodeEditor value={code} onChange={setCode} language={language} />
        </div>
        <AIResultCard loading={loading} result={result} emptyHint="Paste code and hit “Explain bug”." />
      </div>
    </main>
  );
}

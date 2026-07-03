// src/pages/CodeImprover.jsx
import { useState } from 'react';
import { AiAPI } from '../api/client.js';
import CodeEditor from '../components/CodeEditor.jsx';
import AIResultCard from '../components/AIResultCard.jsx';

const LANGS = ['c', 'cpp', 'java', 'python', 'javascript'];
const SAMPLE = `function f(a){\n  let r=[];\n  for(let i=0;i<a.length;i++){\n    for(let j=0;j<a.length;j++){\n      if(a[i]===a[j]&&i!==j) r.push(a[i]);\n    }\n  }\n  return r;\n}`;

export default function CodeImprover() {
  const [code, setCode] = useState(SAMPLE);
  const [language, setLanguage] = useState('javascript');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setResult('');
    try {
      setResult(await AiAPI.improve(code, language));
    } catch {
      setResult('**Something went wrong.** Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="font-display text-2xl font-extrabold">💡 Code Improver</h1>
      <p className="mt-1 text-sm text-muted">Get suggestions for cleaner names, faster logic, and better habits.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="input !w-auto !py-1.5 text-sm">
              {LANGS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            <button className="btn-primary !py-2" disabled={loading} onClick={run}>Improve code</button>
          </div>
          <CodeEditor value={code} onChange={setCode} language={language} />
        </div>
        <AIResultCard loading={loading} result={result} emptyHint="Suggestions will appear here." />
      </div>
    </main>
  );
}

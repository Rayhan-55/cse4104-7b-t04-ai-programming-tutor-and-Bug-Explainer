// src/pages/RepoExplainer.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { RepoAPI } from '../api/client.js';
import AIResultCard from '../components/AIResultCard.jsx';
import VoiceButton from '../components/VoiceButton.jsx';

const LANGS = [
  { value: 'bangla', label: 'বাংলা' },
  { value: 'banglish', label: 'Banglish' },
  { value: 'english', label: 'English' },
];

// Picks a Monaco-ish language hint from a file extension (for nicer display).
function extLabel(path) {
  return path.includes('.') ? path.split('.').pop() : 'file';
}

export default function RepoExplainer() {
  const [url, setUrl] = useState('');
  const [lang, setLang] = useState('bangla');

  const [repo, setRepo] = useState(null); // { meta, tree, branch, owner, repo, explanation }
  const [loadingRepo, setLoadingRepo] = useState(false);
  const [error, setError] = useState('');

  const [activeFile, setActiveFile] = useState(null);
  const [fileResult, setFileResult] = useState('');
  const [loadingFile, setLoadingFile] = useState(false);

  const loadRepo = async () => {
    if (!url.trim()) return;
    setError('');
    setRepo(null);
    setActiveFile(null);
    setFileResult('');
    setLoadingRepo(true);
    try {
      setRepo(await RepoAPI.overview(url, lang));
    } catch (e) {
      setError(e?.response?.data?.message || 'Repo লোড করা গেল না।');
    } finally {
      setLoadingRepo(false);
    }
  };

  const explainFile = async (path) => {
    setActiveFile(path);
    setFileResult('');
    setLoadingFile(true);
    try {
      const d = await RepoAPI.file(url, path, repo.branch, lang);
      setFileResult(d.explanation);
    } catch (e) {
      setFileResult('**সমস্যা হয়েছে।** ' + (e?.response?.data?.message || 'ফাইলটা পড়া গেল না।'));
    } finally {
      setLoadingFile(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="font-display text-2xl font-extrabold">🐙 GitHub Repo Explainer</h1>
      <p className="mt-1 text-sm text-muted">
        যেকোনো পাবলিক GitHub লিংক দাও — পুরো প্রজেক্ট বুঝিয়ে দেবে, আর যেকোনো ফাইলে ক্লিক করলে detail।
      </p>

      {/* Input row */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          className="input flex-1 font-display text-[13px]"
          placeholder="https://github.com/facebook/react"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && loadRepo()}
        />
        <select value={lang} onChange={(e) => setLang(e.target.value)} className="input !w-auto text-sm">
          {LANGS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
        </select>
        <button className="btn-primary" disabled={loadingRepo} onClick={loadRepo}>
          {loadingRepo ? 'পড়ছি…' : 'Explain repo'}
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-[#ff5f57]/40 bg-[#ff5f57]/10 px-3 py-2 text-sm text-[#ff9a94]">{error}</p>
      )}

      {/* Overview */}
      {(loadingRepo || repo) && (
        <div className="mt-6">
          {repo && (
            <div className="glass mb-4 flex flex-wrap items-center gap-3 p-4 text-sm">
              <span className="font-display font-bold text-amber">{repo.meta.name}</span>
              {repo.meta.language && <span className="rounded-md border border-line px-2 py-0.5 text-xs text-teal">{repo.meta.language}</span>}
              <span className="text-muted">⭐ {repo.meta.stars}</span>
              {repo.meta.description && <span className="w-full text-muted">{repo.meta.description}</span>}
            </div>
          )}
          <AIResultCard
            loading={loadingRepo}
            result={repo?.explanation}
            emptyHint="প্রজেক্টের overview এখানে আসবে।"
          />
        </div>
      )}

      {/* File tree + file detail */}
      {repo && (
        <div className="mt-6 grid gap-6 lg:grid-cols-5">
          {/* tree */}
          <div className="glass max-h-[460px] overflow-y-auto p-3 lg:col-span-2">
            <h3 className="px-2 py-1 font-display text-xs font-semibold uppercase tracking-wider text-muted">
              ফাইল ({repo.tree.length})
            </h3>
            <ul className="mt-1">
              {repo.tree.map((f) => (
                <li key={f.path}>
                  <button
                    onClick={() => explainFile(f.path)}
                    className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[13px] transition hover:bg-white/5 ${
                      activeFile === f.path ? 'bg-amber/10 text-amber' : 'text-e7ebf3/80'
                    }`}
                  >
                    <span className="shrink-0 text-[10px] text-muted">[{extLabel(f.path)}]</span>
                    <span className="truncate font-display">{f.path}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* detail */}
          <div className="lg:col-span-3">
            {activeFile ? (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-display text-sm text-teal">{activeFile}</span>
                  {fileResult && <VoiceButton text={fileResult} />}
                </div>
                <AIResultCard loading={loadingFile} result={fileResult} emptyHint="" />
              </motion.div>
            ) : (
              <div className="glass flex h-full min-h-[200px] items-center justify-center p-6 text-center text-sm text-muted">
                বাঁ পাশ থেকে যেকোনো ফাইলে ক্লিক করো — সেটা বুঝিয়ে দেবে।
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

// src/pages/DocExplainer.jsx
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { DocAPI } from '../api/client.js';
import AIResultCard from '../components/AIResultCard.jsx';

const LANGS = [
  { value: 'bangla', label: 'বাংলা' },
  { value: 'banglish', label: 'Banglish' },
  { value: 'english', label: 'English' },
];

const MAX_MB = 8;

export default function DocExplainer() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(''); // object URL for images
  const [lang, setLang] = useState('bangla');
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const pickFile = (f) => {
    setError('');
    setResult('');
    if (!f) return;
    const isPdf = f.type === 'application/pdf';
    const isImg = f.type.startsWith('image/');
    if (!isPdf && !isImg) return setError('শুধু PDF অথবা ছবি আপলোড করো।');
    if (f.size > MAX_MB * 1024 * 1024) return setError(`ফাইল বড় হয়ে গেছে (সর্বোচ্চ ${MAX_MB} MB)।`);
    setFile(f);
    setPreview(isImg ? URL.createObjectURL(f) : '');
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    pickFile(e.dataTransfer.files?.[0]);
  };

  const explain = async () => {
    if (!file) return;
    setLoading(true);
    setResult('');
    setError('');
    try {
      const d = await DocAPI.explain(file, lang, question);
      setResult(d.explanation);
    } catch (e) {
      setError(e?.response?.data?.message || 'ফাইলটা ব্যাখ্যা করা গেল না।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="font-display text-2xl font-extrabold">📄 PDF & Image Explainer</h1>
      <p className="mt-1 text-sm text-muted">
        লেকচার স্লাইড, নোটস, বইয়ের পাতা, বা হাতে লেখা কোডের ছবি আপলোড করো — সহজ ভাষায় বুঝিয়ে দেবে।
      </p>

      {/* Dropzone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`mt-6 cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition ${
          dragging ? 'border-amber bg-amber/5' : 'border-line hover:border-amber/50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,image/*"
          className="hidden"
          onChange={(e) => pickFile(e.target.files?.[0])}
        />
        {file ? (
          <div className="flex flex-col items-center gap-3">
            {preview ? (
              <img src={preview} alt="preview" className="max-h-48 rounded-xl border border-line" />
            ) : (
              <div className="font-display text-4xl">📕</div>
            )}
            <p className="font-display text-sm text-teal">{file.name}</p>
            <p className="text-xs text-muted">ক্লিক করে অন্য ফাইল বেছে নাও</p>
          </div>
        ) : (
          <div className="text-muted">
            <div className="text-3xl">⬆️</div>
            <p className="mt-2 text-sm">এখানে PDF বা ছবি টেনে আনো, অথবা ক্লিক করো</p>
            <p className="mt-1 text-xs">সর্বোচ্চ {MAX_MB} MB · PDF, PNG, JPG</p>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-[#ff5f57]/40 bg-[#ff5f57]/10 px-3 py-2 text-sm text-[#ff9a94]">{error}</p>
      )}

      {/* Options */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <select value={lang} onChange={(e) => setLang(e.target.value)} className="input !w-auto text-sm">
          {LANGS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
        </select>
        <input
          className="input flex-1"
          placeholder="(ঐচ্ছিক) নির্দিষ্ট প্রশ্ন — যেমন: এই কোডে বাগ কোথায়?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>
      <button className="btn-primary mt-3" disabled={loading || !file} onClick={explain}>
        {loading ? 'পড়ছি…' : 'বুঝিয়ে দাও'}
      </button>

      <motion.div initial={false} className="mt-6">
        <AIResultCard loading={loading} result={result} emptyHint="ব্যাখ্যা এখানে আসবে।" />
      </motion.div>

      <p className="mt-4 text-center text-xs text-muted">
        💡 ছবির ভেতরের লেখা/কোড পড়তে AI vision লাগে (Gemini/OpenAI key)। PDF-এর টেক্সট key ছাড়াও পড়া যায়।
      </p>
    </main>
  );
}

// src/pages/Landing.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const features = [
  { icon: '🐞', title: 'Bug Explainer', desc: 'Line-by-line, why it broke, and the fix — in plain words.' },
  { icon: '🌐', title: 'Error Translator', desc: 'Turns scary errors like "Segmentation fault" into simple Bangla + English.' },
  { icon: '💡', title: 'Code Improver', desc: 'Cleaner names, faster logic, better habits.' },
  { icon: '🎓', title: 'AI Tutor', desc: 'Ask anything — arrays, recursion, OOP — with tiny examples.' },
  { icon: '🔊', title: 'Voice Tutor', desc: 'Listen to any explanation read aloud. Free for everyone.' },
  { icon: '⚡', title: 'XP & Streaks', desc: 'Earn XP and level up as you learn.' },
];

const stagger = { show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function Landing() {
  return (
    <main className="mx-auto max-w-6xl px-5">
      {/* Hero */}
      <section className="grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="inline-block rounded-full border border-line px-3 py-1 text-xs font-semibold tracking-wide text-teal">
            beginner-first · বাংলা + English
          </span>
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight md:text-5xl">
            Learn to code with a tutor that <span className="text-amber">explains like a human</span>.
          </h1>
          <p className="mt-5 max-w-md text-muted">
            CodeMentor AI reads your code, explains your bugs, translates confusing errors, and helps you
            get better — patiently, in simple language.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register" className="btn-primary">Start learning free</Link>
            <Link to="/error-translator" className="btn-ghost">Try without signing up</Link>
          </div>
        </motion.div>

        {/* Faux terminal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="glass overflow-hidden shadow-glow"
        >
          <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            <span className="ml-3 font-display text-xs text-muted">codementor — error</span>
          </div>
          <div className="space-y-3 p-5 font-display text-[13px]">
            <p className="text-[#ff7a72]">$ Segmentation fault (core dumped)</p>
            <p className="text-muted">// CodeMentor AI:</p>
            <p className="text-teal">Program emon ekta memory access koreche jeta tar na 😅</p>
            <p className="text-e7ebf3/80">Common karon: pointer/array index range er baire.</p>
            <p className="text-amber">Fix: index loop condition ar array size mile kina check koro.</p>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <motion.section
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid gap-4 pb-24 sm:grid-cols-2 lg:grid-cols-3"
      >
        {features.map((f) => (
          <motion.div variants={item} key={f.title} className="glass p-6 transition hover:border-amber/40">
            <div className="text-2xl">{f.icon}</div>
            <h3 className="mt-3 font-display font-bold">{f.title}</h3>
            <p className="mt-1.5 text-sm text-muted">{f.desc}</p>
          </motion.div>
        ))}
      </motion.section>
    </main>
  );
}

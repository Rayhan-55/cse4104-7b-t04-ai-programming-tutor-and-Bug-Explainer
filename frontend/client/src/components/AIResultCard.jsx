// src/components/AIResultCard.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import Markdown from './Markdown.jsx';
import VoiceButton from './VoiceButton.jsx';

// Quick one-tap follow-ups so a learner who doesn't understand the first answer
// can go deeper without having to think of a question.
const QUICK_FOLLOWUPS = [
  { label: '😕 Bujhlam na', text: 'Eta ami bujhlam na. Aro shohoj kore, step by step bujhao.' },
  { label: '➕ Ekta example dao', text: 'Ekta chhoto, real example diye bujhao.' },
  { label: '🔁 Aro shohoj', text: 'Aro shohoj bhasha e, ekebare beginner er moto kore bolo.' },
  { label: '❓ Keno?', text: 'Kintu eta keno emon hoy? Karon ta bujhao.' },
];

export default function AIResultCard({
  loading,
  result,
  emptyHint,
  // --- follow-up props (all optional; card stays backward compatible) ---
  followUps = [],        // extra turns after the first answer: [{ role, text }]
  onFollowUp,            // (text) => void | Promise  — enables the follow-up UI
  followUpLoading = false,
}) {
  const [draft, setDraft] = useState('');
  const canFollowUp = typeof onFollowUp === 'function' && !!result;

  const send = (text) => {
    const msg = (text ?? draft).trim();
    if (!msg || followUpLoading) return;
    setDraft('');
    onFollowUp(msg);
  };

  return (
    <div className="glass min-h-[200px] p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-muted">AI explanation</h3>
        {result && <VoiceButton text={result} />}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted">
          <span className="h-2 w-2 animate-bounce rounded-full bg-amber" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-amber [animation-delay:0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-amber [animation-delay:0.3s]" />
          <span className="ml-1">Thinking like a tutor…</span>
        </div>
      ) : result ? (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <Markdown text={result} />

          {/* Follow-up conversation turns */}
          {followUps.map((turn, i) =>
            turn.role === 'user' ? (
              <div key={i} className="mt-4 flex justify-end">
                <p className="max-w-[85%] rounded-2xl rounded-br-sm border border-amber/30 bg-amber/10 px-3 py-2 text-sm text-e7ebf3/90">
                  {turn.text}
                </p>
              </div>
            ) : (
              <div key={i} className="mt-4 border-t border-line pt-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Follow-up
                  </span>
                  <VoiceButton text={turn.text} />
                </div>
                <Markdown text={turn.text} />
              </div>
            )
          )}

          {/* Follow-up loading dots */}
          {followUpLoading && (
            <div className="mt-4 flex items-center gap-2 text-sm text-muted">
              <span className="h-2 w-2 animate-bounce rounded-full bg-teal" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-teal [animation-delay:0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-teal [animation-delay:0.3s]" />
              <span className="ml-1">Explaining again…</span>
            </div>
          )}

          {/* Follow-up input + quick chips */}
          {canFollowUp && (
            <div className="mt-5 border-t border-line pt-4">
              <p className="label">Didn't get it? Ask a follow-up 👇</p>
              <div className="mb-2 flex flex-wrap gap-2">
                {QUICK_FOLLOWUPS.map((q) => (
                  <button
                    key={q.label}
                    type="button"
                    disabled={followUpLoading}
                    onClick={() => send(q.text)}
                    className="rounded-full border border-line px-3 py-1.5 text-xs text-muted transition hover:border-teal/50 hover:text-teal disabled:opacity-50"
                  >
                    {q.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  className="input"
                  placeholder="e.g. line 3 ta keno bug? / explain in English"
                  value={draft}
                  disabled={followUpLoading}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                />
                <button
                  type="button"
                  className="btn-primary !py-2"
                  disabled={followUpLoading || !draft.trim()}
                  onClick={() => send()}
                >
                  Ask
                </button>
              </div>
            </div>
          )}
        </motion.div>
      ) : (
        <p className="text-sm text-muted">{emptyHint}</p>
      )}
    </div>
  );
}

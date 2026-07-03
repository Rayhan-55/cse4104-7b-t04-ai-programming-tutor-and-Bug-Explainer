// src/components/AIResultCard.jsx
import { motion } from 'framer-motion';
import Markdown from './Markdown.jsx';
import VoiceButton from './VoiceButton.jsx';

export default function AIResultCard({ loading, result, emptyHint }) {
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
        </motion.div>
      ) : (
        <p className="text-sm text-muted">{emptyHint}</p>
      )}
    </div>
  );
}

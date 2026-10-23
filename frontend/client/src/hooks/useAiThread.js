// src/hooks/useAiThread.js
// -----------------------------------------------------------------------------
// Manages the follow-up conversation that comes AFTER a tool's first answer.
//
// The first answer is still rendered by the page as `result`. This hook only
// owns what happens next: the learner's follow-up questions and the tutor's
// replies, plus the full history that gets sent back so Claude stays on topic.
//
// Usage in a page:
//   const thread = useAiThread();
//   ...
//   thread.reset();                         // before a brand-new run
//   const answer = await AiAPI.bug(code, language);
//   setResult(answer);
//   thread.seed(`\`\`\`${language}\n${code}\n\`\`\``, answer);  // record opening turn
//   ...
//   <AIResultCard
//     result={result}
//     followUps={thread.followUps}
//     onFollowUp={thread.ask}
//     followUpLoading={thread.followUpLoading}
//   />
// -----------------------------------------------------------------------------
import { useState } from 'react';
import { AiAPI } from '../api/client.js';

export function useAiThread() {
  const [opening, setOpening] = useState(null); // [userTurn, assistantTurn]
  const [turns, setTurns] = useState([]);       // follow-up turns shown in the card
  const [loading, setLoading] = useState(false);

  // Clear everything — call right before kicking off a new first answer.
  const reset = () => {
    setOpening(null);
    setTurns([]);
    setLoading(false);
  };

  // Record the opening turn pair so follow-ups have full context.
  // `originalInput` = short text of what the learner pasted/asked.
  // `firstAnswer`   = the tool's first response (already shown as `result`).
  const seed = (originalInput, firstAnswer) => {
    setOpening([
      { role: 'user', text: originalInput },
      { role: 'assistant', text: firstAnswer },
    ]);
    setTurns([]);
  };

  // Send a follow-up question with the whole prior thread as context.
  const ask = async (text) => {
    if (!opening || loading) return;
    const history = [...opening, ...turns];
    setTurns((t) => [...t, { role: 'user', text }]);
    setLoading(true);
    try {
      const reply = await AiAPI.followUp(text, history);
      setTurns((t) => [...t, { role: 'assistant', text: reply }]);
    } catch {
      setTurns((t) => [
        ...t,
        { role: 'assistant', text: '**Something went wrong.** Is the backend running?' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return { followUps: turns, followUpLoading: loading, seed, ask, reset };
}

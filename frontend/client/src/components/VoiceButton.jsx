// src/components/VoiceButton.jsx
// Voice Tutor: reads the AI's explanation out loud using the browser's built-in
// SpeechSynthesis API. No external service, no cost, available to ALL users.
import { useEffect, useState } from 'react';

// Strips markdown symbols so the voice doesn't read "asterisk asterisk".
function clean(text) {
  return text
    .replace(/```[\s\S]*?```/g, ' (code example shown on screen) ')
    .replace(/[*_`#>]/g, '')
    .replace(/\n+/g, '. ')
    .trim();
}

export default function VoiceButton({ text, className = '' }) {
  const [speaking, setSpeaking] = useState(false);
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Stop speaking if the component unmounts.
  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  if (!supported || !text) return null;

  const toggle = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(clean(text));
    u.rate = 0.98;
    u.pitch = 1;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    setSpeaking(true);
  };

  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold transition hover:border-teal/60 hover:text-teal ${className}`}
      title="Listen to this explanation"
    >
      <span className={speaking ? 'animate-pulse' : ''}>{speaking ? '◼ Stop' : '🔊 Listen'}</span>
    </button>
  );
}

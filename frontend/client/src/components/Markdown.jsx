// src/components/Markdown.jsx
// A small, dependency-free renderer good enough for the tutor's output:
// handles ```code fences```, **bold**, and line breaks. Keeps the bundle light.

function renderInline(text, key) {
  // split on **bold**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span key={key}>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**') ? (
          <strong key={i} className="text-amber">
            {p.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </span>
  );
}

export default function Markdown({ text = '' }) {
  // Split the text into alternating prose / code-fence blocks.
  const blocks = text.split(/```/g);

  return (
    <div className="space-y-3 text-sm leading-relaxed text-e7ebf3/90">
      {blocks.map((block, i) => {
        const isCode = i % 2 === 1; // odd chunks are inside ``` ```
        if (isCode) {
          const firstLine = block.indexOf('\n');
          const body = firstLine >= 0 ? block.slice(firstLine + 1) : block;
          return (
            <pre
              key={i}
              className="overflow-x-auto rounded-xl border border-line bg-ink/80 p-4 font-display text-[13px] text-teal"
            >
              <code>{body.trimEnd()}</code>
            </pre>
          );
        }
        return block
          .split('\n')
          .filter((l) => l.trim() !== '')
          .map((line, j) => <p key={`${i}-${j}`}>{renderInline(line, j)}</p>);
      })}
    </div>
  );
}

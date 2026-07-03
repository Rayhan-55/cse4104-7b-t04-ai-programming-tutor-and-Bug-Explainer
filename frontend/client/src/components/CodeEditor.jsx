// src/components/CodeEditor.jsx
import Editor from '@monaco-editor/react';

export default function CodeEditor({ value, onChange, language = 'cpp', height = 320 }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line">
      <Editor
        height={height}
        language={language}
        theme="vs-dark"
        value={value}
        onChange={(v) => onChange(v ?? '')}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: 'JetBrains Mono, monospace',
          scrollBeyondLastLine: false,
          padding: { top: 14 },
          smoothScrolling: true,
        }}
      />
    </div>
  );
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0b0d12',        // deep background
        panel: '#12151d',      // card background
        line: '#222838',       // borders
        amber: '#f5a524',      // primary accent (warm)
        teal: '#3dd7c0',       // secondary accent
        muted: '#8a93a6',      // secondary text
        e7ebf3: '#e7ebf3',     // primary foreground text
      },
      fontFamily: {
        display: ['"JetBrains Mono"', 'monospace'],
        body: ['Sora', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(245,165,36,0.25), 0 20px 60px -20px rgba(245,165,36,0.25)',
      },
    },
  },
  plugins: [],
};

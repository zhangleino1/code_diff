/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vscode-bg': '#1e1e1e',
        'vscode-sidebar': '#252526',
        'vscode-panel': '#2d2d30',
        'vscode-border': '#3e3e42',
        'vscode-text': '#cccccc',
        'vscode-text-dim': '#858585',
        'github-add': '#22863a',
        'github-add-bg': '#f0fff4',
        'github-delete': '#cb2431',
        'github-delete-bg': '#ffeef0',
      },
    },
  },
  plugins: [],
}

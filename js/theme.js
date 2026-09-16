const THEMES = {
  carbon: {
    bgVoid: '#0a0a0a',
    bgPanel: '#141414',
    bgPanel2: '#1e1e1e',
    line: '#333333',
    textHi: '#ffffff',
    textLo: '#888888',
    accent: '#00cc66',
    accent2: '#00994d'
  },
  terminal: {
    bgVoid: '#000000',
    bgPanel: '#001100',
    bgPanel2: '#002200',
    line: '#003300',
    textHi: '#00ff00',
    textLo: '#00aa00',
    accent: '#00ff00',
    accent2: '#00cc00'
  },
  daylight: {
    bgVoid: '#e0e0e0',
    bgPanel: '#ffffff',
    bgPanel2: '#f0f0f0',
    line: '#cccccc',
    textHi: '#111111',
    textLo: '#555555',
    accent: '#0066cc',
    accent2: '#004c99'
  },
  grid: {
    bgVoid: '#1a1a1a',
    bgPanel: '#242424',
    bgPanel2: '#2f2f2f',
    line: '#e60000',
    textHi: '#ffffff',
    textLo: '#cccccc',
    accent: '#e60000',
    accent2: '#ffffff'
  }
};

const DEFAULT_THEME = 'grid';
const THEME_DEFAULT_VERSION = '2';

function applyTheme(themeName) {
  const theme = THEMES[themeName] || THEMES.grid;
  const root = document.documentElement;
  root.style.setProperty('--bg-void', theme.bgVoid);
  root.style.setProperty('--bg-panel', theme.bgPanel);
  root.style.setProperty('--bg-panel-2', theme.bgPanel2);
  root.style.setProperty('--line', theme.line);
  root.style.setProperty('--text-hi', theme.textHi);
  root.style.setProperty('--text-lo', theme.textLo);
  root.style.setProperty('--accent', theme.accent);
  root.style.setProperty('--accent-2', theme.accent2);
}

document.addEventListener('DOMContentLoaded', () => {
  const hasCurrentDefault = localStorage.getItem('panelos-theme-default-version') === THEME_DEFAULT_VERSION;
  if (!hasCurrentDefault) {
    localStorage.setItem('panelos-theme', DEFAULT_THEME);
    localStorage.setItem('panelos-theme-default-version', THEME_DEFAULT_VERSION);
  }
  const saved = localStorage.getItem('panelos-theme') || DEFAULT_THEME;
  applyTheme(saved);
});
const THEMES = {
  carbon:   { name:'Carbon',   bgVoid:'#121214', bgPanel:'#1b1c1f', bgPanel2:'#232428', line:'#303237', textHi:'#eceef1', textLo:'#85888f', accent:'#d8a24a', accent2:'#4fb3a6' },
  terminal: { name:'Terminal', bgVoid:'#0c1210', bgPanel:'#121a17', bgPanel2:'#182420', line:'#25342e', textHi:'#d8f5df', textLo:'#5f8f74', accent:'#3ddc84', accent2:'#e0c341' },
  daylight: { name:'Daylight', bgVoid:'#e9e6df', bgPanel:'#f6f4ef', bgPanel2:'#ece9e1', line:'#d6d2c7', textHi:'#20201c', textLo:'#75726a', accent:'#a8562e', accent2:'#3c6e71' },
};

function applyTheme(key){
  const t = THEMES[key];
  if(!t) return;
  const r = document.documentElement.style;
  r.setProperty('--bg-void', t.bgVoid);
  r.setProperty('--bg-panel', t.bgPanel);
  r.setProperty('--bg-panel-2', t.bgPanel2);
  r.setProperty('--line', t.line);
  r.setProperty('--text-hi', t.textHi);
  r.setProperty('--text-lo', t.textLo);
  r.setProperty('--accent', t.accent);
  r.setProperty('--accent-2', t.accent2);
  localStorage.setItem('panelos-theme', key);
  document.querySelectorAll('.swatch').forEach(s => s.classList.toggle('active', s.dataset.theme === key));
}
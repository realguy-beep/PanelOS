const appDefs = {
  notes: {
    id: 'notes',
    name: 'Notes',
    title: 'Notes', width: 360, height: 280,
    render: () => `
      <div class="app-notes">
        <textarea placeholder="Type something…"></textarea>
        <div class="notes-bar"><span>plain text</span><span id="notes-count">0 chars</span></div>
      </div>`,
    afterMount: (body) => {
      const ta = body.querySelector('textarea');
      const count = body.querySelector('#notes-count');
      const saved = localStorage.getItem('panelos-note');
      if(saved) ta.value = saved;
      count.textContent = ta.value.length + ' chars';
      ta.addEventListener('input', ()=>{
        count.textContent = ta.value.length + ' chars';
        localStorage.setItem('panelos-note', ta.value);
      });
    }
  },

  calc: {
    id: 'calc',
    name: 'Calculator',
    title: 'Calculator', width: 250, height: 320,
    render: () => `
      <div class="app-calc">
        <div class="calc-sub" id="calc-sub">&nbsp;</div>
        <div class="calc-display" id="calc-display">0</div>
        <div class="calc-grid">
          <button class="calc-btn op" data-k="C">C</button>
          <button class="calc-btn op" data-k="±">±</button>
          <button class="calc-btn op" data-k="%">%</button>
          <button class="calc-btn op" data-k="/">÷</button>
          <button class="calc-btn" data-k="7">7</button>
          <button class="calc-btn" data-k="8">8</button>
          <button class="calc-btn" data-k="9">9</button>
          <button class="calc-btn op" data-k="*">×</button>
          <button class="calc-btn" data-k="4">4</button>
          <button class="calc-btn" data-k="5">5</button>
          <button class="calc-btn" data-k="6">6</button>
          <button class="calc-btn op" data-k="-">−</button>
          <button class="calc-btn" data-k="1">1</button>
          <button class="calc-btn" data-k="2">2</button>
          <button class="calc-btn" data-k="3">3</button>
          <button class="calc-btn op" data-k="+">+</button>
          <button class="calc-btn zero" data-k="0">0</button>
          <button class="calc-btn" data-k=".">.</button>
          <button class="calc-btn eq" data-k="=">=</button>
        </div>
      </div>`,
    afterMount: (body) => {
      const display = body.querySelector('#calc-display');
      const sub = body.querySelector('#calc-sub');
      let current = '0', prev = null, op = null, resetNext = false;

      function render(){ display.textContent = current; }
      function apply(a,b,operator){
        a = parseFloat(a); b = parseFloat(b);
        switch(operator){
          case '+': return a+b;
          case '-': return a-b;
          case '*': return a*b;
          case '/': return b === 0 ? 0 : a/b;
          default: return b;
        }
      }
/*what you looking at not ai*/
      body.querySelectorAll('.calc-btn').forEach(btn=>{
        btn.addEventListener('click', ()=>{
          const k = btn.dataset.k;
          if(k === 'C'){ current='0'; prev=null; op=null; sub.textContent='\u00A0'; }
          else if(k === '±'){ current = String(parseFloat(current) * -1); }
          else if(k === '%'){ current = String(parseFloat(current) / 100); }
          else if(['+','-','*','/'].includes(k)){
            if(prev !== null && !resetNext){ current = String(apply(prev, current, op)); }
            prev = current; op = k; resetNext = true;
            sub.textContent = `${prev} ${k === '*' ? '×' : k === '/' ? '÷' : k}`;
          } else if(k === '='){
            if(prev !== null){
              sub.textContent = `${prev} ${op === '*' ? '×' : op === '/' ? '÷' : op} ${current} =`;
              current = String(apply(prev, current, op));
              prev = null; op = null; resetNext = true;
            }
          } else if(k === '.'){
            if(resetNext){ current = '0'; resetNext = false; }
            if(!current.includes('.')) current += '.';
          } else {
            if(current === '0' || resetNext){ current = k; resetNext = false; }
            else current += k;
          }
          render();
        });
      });
    }
  },

  prefs: {
    id: 'prefs',
    name: 'Preferences',
    title: 'Preferences', width: 320, height: 200,
    render: () => `
      <div class="app-prefs">
        <div>
          <div class="prefs-label">THEME</div>
          <div class="prefs-swatches" id="prefs-swatches"></div>
        </div>
      </div>`,
    afterMount: (body) => {
      const wrap = body.querySelector('#prefs-swatches');
      const current = localStorage.getItem('panelos-theme') || 'carbon';
      Object.keys(THEMES).forEach(key=>{
        const t = THEMES[key];
        const el = document.createElement('div');
        el.className = 'swatch' + (key === current ? ' active' : '');
        el.dataset.theme = key;
        el.innerHTML = `
          <div class="swatch-dots">
            <div class="dot" style="background:${t.accent}"></div>
            <div class="dot" style="background:${t.accent2}"></div>
          </div>
          <div>${key}</div>`;
        el.addEventListener('click', ()=> {
          applyTheme(key);
          localStorage.setItem('panelos-theme', key);
          wrap.querySelectorAll('.swatch').forEach(swatch => swatch.classList.toggle('active', swatch === el));
        });
        wrap.appendChild(el);
      });
    }
  }
};
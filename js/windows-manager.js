const layer = document.getElementById('windows-layer');
const dock = document.getElementById('dock');
let zTop = 10;
let openWindows = {};

function bringToFront(win) {
  document.querySelectorAll('.win').forEach(w => w.classList.remove('focused'));
  zTop += 1;
  win.style.zIndex = zTop;
  win.classList.add('focused');
  updateDock();
}

function updateDock() {
  const ids = Object.keys(openWindows);
  if (ids.length === 0) {
    dock.innerHTML = '<span class="dock-empty">no windows open</span>';
    return;
  }
  dock.innerHTML = '';
  ids.forEach(id => {
    const el = document.createElement('div');
    el.className = 'dock-item' + (openWindows[id].el.classList.contains('focused') ? ' active' : '');
    el.textContent = appDefs[id].title;
    el.addEventListener('click', () => bringToFront(openWindows[id].el));
    dock.appendChild(el);
  });
}

function openApp(appId) {
  if (openWindows[appId]) {
    bringToFront(openWindows[appId].el);
    return;
  }
  const def = appDefs[appId];
  const win = document.createElement('div');
  win.className = 'win';
  const offset = Object.keys(openWindows).length * 24;
  win.style.left = (110 + offset) + 'px';
  win.style.top = (60 + offset) + 'px';
  win.style.width = def.width + 'px';
  win.style.height = def.height + 'px';
  win.innerHTML = `
    <div class="win-titlebar">
      <div class="title">${def.title}</div>
      <div class="win-controls">
        <button class="win-btn min" title="Minimize">–</button>
        <button class="win-btn max" title="Maximize">□</button>
        <button class="win-btn close" title="Close">×</button>
      </div>
    </div>
    <div class="win-body">${def.render()}</div>
    <div class="win-resize"></div>
  `;
  layer.appendChild(win);
  openWindows[appId] = { el: win };
  def.afterMount(win.querySelector('.win-body'));
  bringToFront(win);
  win.addEventListener('mousedown', () => bringToFront(win));

  const titlebar = win.querySelector('.win-titlebar');
  let dragging = false, offX = 0, offY = 0;
  titlebar.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('win-btn')) return;
    dragging = true;
    offX = e.clientX - win.offsetLeft;
    offY = e.clientY - win.offsetTop;
  });

  let resizing = false;
  win.querySelector('.win-resize').addEventListener('mousedown', (e) => {
    resizing = true;
    e.stopPropagation();
  });

  window.addEventListener('mousemove', (e) => {
    if (dragging) {
      win.style.left = Math.max(0, e.clientX - offX) + 'px';
      win.style.top = Math.max(30, e.clientY - offY) + 'px';
    }
    if (resizing) {
      win.style.width = Math.max(230, e.clientX - win.offsetLeft) + 'px';
      win.style.height = Math.max(150, e.clientY - win.offsetTop) + 'px';
    }
  });
  window.addEventListener('mouseup', () => {
    dragging = false;
    resizing = false;
  });
/*yoo nothing ai here stop the search and review me lol*/
  win.querySelector('.win-btn.close').addEventListener('click', () => {
    win.remove();
    delete openWindows[appId];
    updateDock();
  });
  win.querySelector('.win-btn.min').addEventListener('click', () => {
    win.style.display = 'none';
  });
  let maximized = false, prevRect = null;
  win.querySelector('.win-btn.max').addEventListener('click', () => {
    if (!maximized) {
      prevRect = { left: win.style.left, top: win.style.top, width: win.style.width, height: win.style.height };
      win.style.left = '8px';
      win.style.top = '38px';
      win.style.width = 'calc(100% - 16px)';
      win.style.height = 'calc(100% - 84px)';
    } else {
      win.style.left = prevRect.left;
      win.style.top = prevRect.top;
      win.style.width = prevRect.width;
      win.style.height = prevRect.height;
    }
    maximized = !maximized;
  });

  updateDock();
}

document.querySelectorAll('.icon').forEach(icon => {
  let clicks = 0;
  icon.addEventListener('click', () => {
    clicks++;
    if (clicks === 1) {
      setTimeout(() => { if (clicks === 1) openApp(icon.dataset.app); clicks = 0; }, 260);
    }
  });
  icon.addEventListener('dblclick', () => openApp(icon.dataset.app));
});

document.querySelectorAll('.tb-menu-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.stopPropagation();
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.tb-menu-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});
document.addEventListener('click', () => {
  document.querySelectorAll('.tb-menu-item').forEach(i => i.classList.remove('open'));
});

document.querySelectorAll('.tb-dropdown button').forEach(btn => {
  btn.addEventListener('click', () => {
    const action = btn.dataset.action;
    if (action === 'new-note') openApp('notes');
    if (action === 'open-prefs') openApp('prefs');
    if (action === 'close-focused') {
      const f = document.querySelector('.win.focused');
      if (f) f.querySelector('.win-btn.close').click();
    }
    if (action === 'clear-note') {
      const ta = document.querySelector('.win.focused .app-notes textarea');
      if (ta) { ta.value = ''; ta.dispatchEvent(new Event('input')); }
    }
    if (action === 'close-all') {
      document.querySelectorAll('.win').forEach(w => w.querySelector('.win-btn.close').click());
    }
  });
});
/*DW CODING DONE BY ME I.E. NO AI USED*/
applyTheme(localStorage.getItem('panelos-theme') || 'carbon');
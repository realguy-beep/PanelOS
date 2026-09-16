class WindowsManager {
  constructor() {
    this.layer = document.getElementById("windows-layer");
    this.zIndex = 100;
  }

  createWindow(appDef) {
    const win = document.createElement("div");
    win.className = `win app-${appDef.id}`;
    win.style.left = "100px";
    win.style.top = "100px";
    win.style.width = typeof appDef.width === "number" ? `${appDef.width}px` : (appDef.width || "400px");
    win.style.height = typeof appDef.height === "number" ? `${appDef.height}px` : (appDef.height || "300px");
    win.style.zIndex = this.zIndex++;

    const titlebar = document.createElement("div");
    titlebar.className = "win-titlebar";
    
    const titleText = document.createElement("span");
    titleText.className = "title";
    titleText.textContent = appDef.title;
    titlebar.appendChild(titleText);

    const controls = document.createElement("div");
    controls.className = "win-controls";

    const maxBtn = document.createElement("button");
    maxBtn.className = "win-btn max";
    maxBtn.type = "button";
    maxBtn.title = "Maximize window; double-click for fullscreen";
    maxBtn.setAttribute("aria-label", "Maximize window");
    
    const closeBtn = document.createElement("button");
    closeBtn.className = "win-btn close";
    closeBtn.type = "button";
    closeBtn.title = "Close window";
    closeBtn.setAttribute("aria-label", "Close window");

    controls.appendChild(maxBtn);
    controls.appendChild(closeBtn);
    titlebar.appendChild(controls);

    const body = document.createElement("div");
    body.className = "win-body";
    body.innerHTML = appDef.render ? appDef.render() : (appDef.content || "");

    const resize = document.createElement("div");
    resize.className = "win-resize";

    win.appendChild(titlebar);
    win.appendChild(body);
    win.appendChild(resize);
    this.layer.appendChild(win);

    this.bindEvents(win, titlebar, resize, closeBtn, maxBtn);
    appDef.afterMount?.(body);
    return { win, body };
  }

  bindEvents(win, titlebar, resize, closeBtn, maxBtn) {
    win.addEventListener("mousedown", () => {
      win.style.zIndex = this.zIndex++;
    });

    closeBtn.addEventListener("click", () => {
      win.remove();
    });

    let isMaximized = false;
    let savedRect = {};

    maxBtn.addEventListener("click", () => {
      if (!isMaximized) {
        savedRect = {
          left: win.style.left,
          top: win.style.top,
          width: win.style.width,
          height: win.style.height
        };
        win.style.left = "0";
        win.style.top = "0";
        win.style.width = "100%";
        win.style.height = "100%";
        isMaximized = true;
      } else {
        win.style.left = savedRect.left;
        win.style.top = savedRect.top;
        win.style.width = savedRect.width;
        win.style.height = savedRect.height;
        isMaximized = false;
      }
    });

    maxBtn.addEventListener("dblclick", () => {
      if (document.fullscreenEnabled) {
        if (!document.fullscreenElement) {
          win.requestFullscreen().catch(err => {
            console.log("Fullscreen request failed", err);
          });
        } else {
          document.exitFullscreen();
        }
      } else {
        console.log("Fullscreen API is not supported in this browser.");
      }
    });

    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    titlebar.addEventListener("mousedown", (e) => {
      if (e.target.tagName === "BUTTON") return;
      isDragging = true;
      const rect = win.getBoundingClientRect();
      const layerRect = this.layer.getBoundingClientRect();
      dragOffsetX = e.clientX - (rect.left - layerRect.left);
      dragOffsetY = e.clientY - (rect.top - layerRect.top);
    });

    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        const layerRect = this.layer.getBoundingClientRect();
        win.style.left = `${e.clientX - layerRect.left - dragOffsetX}px`;
        win.style.top = `${e.clientY - layerRect.top - dragOffsetY}px`;
      }
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });

    let isResizing = false;
    let startWidth = 0;
    let startHeight = 0;
    let startX = 0;
    let startY = 0;

    resize.addEventListener("mousedown", (e) => {
      isResizing = true;
      const rect = win.getBoundingClientRect();
      startWidth = rect.width;
      startHeight = rect.height;
      startX = e.clientX;
      startY = e.clientY;
      e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
      if (isResizing) {
        win.style.width = `${startWidth + (e.clientX - startX)}px`;
        win.style.height = `${startHeight + (e.clientY - startY)}px`;
      }
    });

    document.addEventListener("mouseup", () => {
      isResizing = false;
    });
  }
}

window.winManager = new WindowsManager();

document.addEventListener('DOMContentLoaded', () => {
  const dock = document.getElementById('dock');

  function openApp(appId) {
    const appDef = appDefs[appId];
    if (!appDef) return;
    const instance = window.winManager.createWindow(appDef);
    const item = document.createElement('button');
    item.className = 'dock-item active';
    item.textContent = appDef.name || appDef.title;
    item.addEventListener('click', () => {
      instance.win.style.zIndex = window.winManager.zIndex++;
    });
    dock.querySelector('.dock-empty')?.remove();
    dock.appendChild(item);
    instance.win.querySelector('.win-btn.close').addEventListener('click', () => {
      item.remove();
      if (!dock.querySelector('.dock-item')) {
        dock.innerHTML = '<span class="dock-empty">no windows open</span>';
      }
    });
  }

  document.querySelectorAll('.icon[data-app]').forEach(icon => {
    icon.addEventListener('click', () => openApp(icon.dataset.app));
  });

  function focusedWindow() {
    return [...document.querySelectorAll('#windows-layer .win')]
      .sort((a, b) => Number(b.style.zIndex) - Number(a.style.zIndex))[0];
  }

  function closeFocusedWindow() {
    focusedWindow()?.querySelector('.win-btn.close')?.click();
  }

  function runMenuAction(action) {
    if (action === 'new-note') openApp('notes');
    if (action === 'open-prefs') openApp('prefs');
    if (action === 'close-focused') closeFocusedWindow();
    if (action === 'close-all') {
      [...document.querySelectorAll('#windows-layer .win')].forEach(win => {
        win.querySelector('.win-btn.close')?.click();
      });
    }
    if (action === 'clear-note') {
      const note = focusedWindow()?.querySelector('.app-notes textarea');
      if (note) {
        note.value = '';
        note.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  }

  const menu = document.getElementById('tb-menu');
  menu.addEventListener('click', event => {
    const actionButton = event.target.closest('[data-action]');
    if (actionButton) {
      event.stopPropagation();
      runMenuAction(actionButton.dataset.action);
      menu.querySelectorAll('.tb-menu-item').forEach(item => item.classList.remove('open'));
      return;
    }

    const menuItem = event.target.closest('.tb-menu-item');
    if (menuItem) {
      const shouldOpen = !menuItem.classList.contains('open');
      menu.querySelectorAll('.tb-menu-item').forEach(item => item.classList.remove('open'));
      menuItem.classList.toggle('open', shouldOpen);
    }
  });

  document.addEventListener('click', event => {
    if (!event.target.closest('#tb-menu')) {
      menu.querySelectorAll('.tb-menu-item').forEach(item => item.classList.remove('open'));
    }
  });
});
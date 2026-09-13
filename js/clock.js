const bootTime = Date.now();

function tick() {
  const now = new Date();
  document.getElementById('tb-clock').textContent =
    [now.getHours(), now.getMinutes(), now.getSeconds()]
      .map(n => String(n).padStart(2, '0'))
      .join(':');

  const secs = Math.floor((Date.now() - bootTime) / 1000);
  const m = Math.floor(secs / 60), s = secs % 60;
  document.getElementById('tb-uptime').textContent = `up ${m}:${String(s).padStart(2, '0')}`;
}

tick();
setInterval(tick, 1000);
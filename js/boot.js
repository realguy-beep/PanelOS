document.addEventListener("DOMContentLoaded", () => {
  const bootScreen = document.getElementById("boot");
  const bootLog = document.querySelector(".boot-log");

  if (!bootScreen || !bootLog) return;

  const overlay = document.createElement("div");
  overlay.id = "boot-overlay";
  overlay.style.position = "absolute";
  overlay.style.inset = "0";
  overlay.style.background = "rgba(0, 0, 0, 0.8)";
  overlay.style.color = "var(--text-hi)";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.cursor = "pointer";
  overlay.style.zIndex = "10000";
  overlay.style.fontSize = "1.5rem";
  overlay.style.textTransform = "uppercase";
  overlay.textContent = "Click to start engines";
  bootScreen.appendChild(overlay);

  const car = document.createElement("div");
  car.id = "boot-f1-car";
  car.innerHTML = `
    <svg viewBox="0 0 100 30" width="80" height="30" fill="var(--accent)">
      <path d="M10,20 L15,10 L30,10 L40,15 L70,15 L80,10 L95,10 L100,20 L95,25 L10,25 Z"/>
      <circle cx="25" cy="22" r="6" fill="#111"/>
      <circle cx="75" cy="22" r="6" fill="#111"/>
    </svg>
  `;
  car.style.position = "absolute";
  car.style.top = "50%";
  car.style.left = "-100px";
  car.style.transform = "translateY(-50%)";
  car.style.transition = "transform 1.5s cubic-bezier(0.5, 0, 0.5, 1)";
  bootScreen.appendChild(car);

  const audio = new Audio("assets/f1-zoom.mp3");

  const messages = [
    "INITIALIZING SYSTEM...",
    "LOADING KERNEL MODULES...",
    "MOUNTING VIRTUAL FILESYSTEM...",
    "STARTING WINDOW MANAGER...",
    "READY."
  ];

  overlay.addEventListener("click", () => {
    overlay.style.display = "none";
    audio.play().catch(err => console.log("Audio play failed:", err));
    
    car.style.transform = `translate(${window.innerWidth + 200}px, -50%)`;

    setTimeout(() => {
      car.style.display = "none";
      startBootSequence();
    }, 1500);
  });

  function startBootSequence() {
    let index = 0;
    const interval = setInterval(() => {
      if (index < messages.length) {
        const p = document.createElement("div");
        p.textContent = messages[index];
        bootLog.appendChild(p);
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          bootScreen.style.display = "none";
        }, 500);
      }
    }, 300);
  }
});
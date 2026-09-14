panelOS 🖥️⚡

A full desktop OS... that lives inside a browser tab. No frameworks, no backend, no install — just open index.html and boot up and enjoy(i still have to make it better ik for you all to enjoy but hehehe)

why tho🤔

Wanted to know what's actually going on under a desktop UI instead of just using one. So I built the window manager myself — dragging, resizing, focus, the works and everything else you see lol\

what it does:
 Boot screen — loads like a real os screen before the windows 
 Top bar — the top bar shows clock(so you dont doomscroll),working file which you can edit and window manager ofc
 Real window manager — the real window manager or say window manager the first helps to maximize, minimise drag and reduce a tab
 Dock — jump between open windows
 Notes app — saves your text, no losing it on refresh tho it takes abit of your tini-tiny storage for it lol but windows does it too
 Calculator — actually does math, chained operations and all yeah it can calculate how many hours you wasted debugging
 Preferences — swap the whole OS color scheme on the fly, saved too (its for the freaks who like white mode lol
 
how it's built 🛠️(imma spill the tea so you can make it too)

Plain HTML/CSS/JS. Each app is just an object with a render() and an afterMount() — window manager handles the rest automatically. Colors are all CSS variables so themes are basically one JS object each.

panelos/
├── index.html
├── css/style.css
└── js/
    ├── theme.js
    ├── apps.js
    ├── boot.js
    ├── clock.js
    └── window-manager.js)

run it

Download → open index.html. That's the whole install process.

what's next 🚧(AS I SAID I WILL BE CONTINUING THIS PROJECT WAS JUST WAITING FOR SHIP LOL)

Auto wallpaper (NASA API), mini browser, music player, chess with a real engine, an endless runner, weather + news, a Doom clone, and an AI companion app(yandere mommy incoming brace for impact lol)
if you wanna try this project here is the link:https://realguy-beep.github.io/PanelOS/
made by

Realguy — hack club project, still cooking 👨‍🍳
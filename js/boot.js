const bootLog = document.getElementById('boot-log');
const bootMessages = ['mounting filesystem', 'loading window manager', 'starting shell', 'ready'];
let bi = 0;

const bootInterval = setInterval(() => {
    bi++;
    if (bi < bootMessages.length) bootLog.textContent = bootMessages[bi];
}, 380);

 setTimeout(() => {
    clearInterval(bootInterval);
    document.getElementById('boot').classList.add('hidden');
 } , 1700);

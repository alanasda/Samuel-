import confetti from 'canvas-confetti';

const messageElement = document.getElementById('message');
const buttonElement = document.getElementById('action-button');
const prankContainer = document.getElementById('prank-container');
const revealContainer = document.getElementById('reveal-container');
const revealText1 = document.getElementById('reveal-text-1');
const revealText2 = document.getElementById('reveal-text-2');
const dramaticEffect = document.getElementById('dramatic-effect');

let audioContext;
let masterGain;

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = audioContext.createGain();
        masterGain.gain.value = 0.5; // Set volume to 50%
        masterGain.connect(audioContext.destination);
    }
}

async function playSound(url) {
    if (!audioContext) return;
    try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(masterGain);
        source.start();
    } catch (error) {
        console.error(`Error playing sound ${url}:`, error);
    }
}


const messages = [
    { msg: 'Bem-vindos, meus amigos...', btn: 'Entrar' },
    { msg: 'Você tem certeza que quer continuar?', btn: 'Sim, estou pronto.' },
    { msg: 'Está preparado para o que vem a seguir?', btn: 'Com certeza!' },
    { msg: 'ALERTA! Vírus detectado! Clique para remover imediatamente!', btn: 'REMOVER VÍRUS AGORA' }
];

let currentStep = 0;

function updateContent() {
    messageElement.textContent = messages[currentStep].msg;
    buttonElement.textContent = messages[currentStep].btn;
    messageElement.style.animation = 'none';
    void messageElement.offsetWidth; // Trigger reflow
    messageElement.style.animation = 'fadeIn 1.5s ease-in-out';
}

function showFinalReveal() {
    prankContainer.classList.add('hidden');
    revealContainer.classList.remove('hidden');

    playSound('surprise-sound.mp3');

    revealText1.textContent = 'O último boato é...';
    revealText2.textContent = '...que você é incrível!';

    dramaticEffect.classList.remove('hidden');

    // Confetti effect
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
            return clearInterval(interval);
        }
        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}


buttonElement.addEventListener('click', () => {
    if (!audioContext) {
        initAudio();
    }
    playSound('click-sound.mp3');

    currentStep++;

    if (currentStep < messages.length) {
        updateContent();
    } else {
        showFinalReveal();
    }
});

// Initialize
updateContent();


const display = document.getElementById('timer-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const stopBtn = document.getElementById('stop-btn');

const durationInput = document.getElementById('duration-input');
const playSoundBtn = document.getElementById('play-sound');
const stopSoundBtn = document.getElementById('stop-sound');

let totalSeconds = 0;
let remaining = 0;
let intervalId = null;

let audio = null;

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function updateDisplay() {
  display.textContent = formatTime(remaining);
}

function startTimer() {
  if (remaining === 0) {
    const mins = Math.max(1, Math.min(120, parseInt(durationInput.value || '10', 10)));
    totalSeconds = mins * 60;
    remaining = totalSeconds;
    updateDisplay();
  }
  if (intervalId) clearInterval(intervalId);

  intervalId = setInterval(() => {
    remaining -= 1;
    updateDisplay();
    if (remaining <= 0) {
      clearInterval(intervalId);
      intervalId = null;
      playEndBell();
      setRunningState(false);
    }
  }, 1000);

  setRunningState(true);
}

function pauseTimer() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    setRunningState(false, true);
  }
}

function stopTimer() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  remaining = 0;
  updateDisplay();
  setRunningState(false);
}

function setRunningState(isRunning, isPaused = false) {
  startBtn.disabled = isRunning;
  pauseBtn.disabled = !isRunning && !isPaused;
  stopBtn.disabled = !isRunning && remaining === 0;
}

function loadSelectedSound() {
  const selected = document.querySelector('input[name="sound"]:checked').value;
  if (audio) {
    audio.pause();
    audio = null;
  }
  audio = new Audio(selected);
  audio.loop = true;
}

function playSelectedSound() {
  if (!audio) loadSelectedSound();
  audio.play();
  playSoundBtn.disabled = true;
  stopSoundBtn.disabled = false;
}

function stopSelectedSound() {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
  playSoundBtn.disabled = false;
  stopSoundBtn.disabled = true;
}

function playEndBell() {
  const bell = new Audio("assets/sounds/bell-ringing-05.mp3");
  bell.play();
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
stopBtn.addEventListener('click', stopTimer);

playSoundBtn.addEventListener('click', playSelectedSound);
stopSoundBtn.addEventListener('click', stopSelectedSound);

document.querySelectorAll('input[name="sound"]').forEach(r => {
  r.addEventListener('change', () => {
    stopSelectedSound();
    loadSelectedSound();
  });
});

remaining = 0;
updateDisplay();
loadSelectedSound();
setRunningState(false);

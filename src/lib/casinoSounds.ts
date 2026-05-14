/* eslint-disable @typescript-eslint/no-explicit-any */
const ctx = () => new (window.AudioContext || (window as any).webkitAudioContext)();

function playTone(freq: number, type: OscillatorType, duration: number, volume = 0.3, delay = 0) {
  try {
    const ac = ctx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ac.currentTime + delay);
    gain.gain.setValueAtTime(0, ac.currentTime + delay);
    gain.gain.linearRampToValueAtTime(volume, ac.currentTime + delay + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + delay + duration);
    osc.start(ac.currentTime + delay);
    osc.stop(ac.currentTime + delay + duration);
  } catch (_e) { /* silent */ }
}

export function soundSpin() {
  for (let i = 0; i < 6; i++) {
    playTone(200 + i * 40, "sawtooth", 0.08, 0.1, i * 0.07);
  }
}

export function soundTick() {
  playTone(440, "square", 0.05, 0.08);
}

export function soundWin() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((f, i) => playTone(f, "sine", 0.2, 0.25, i * 0.12));
}

export function soundJackpot() {
  const melody = [523, 659, 784, 1047, 1319, 1047, 784, 1319];
  melody.forEach((f, i) => playTone(f, "sine", 0.25, 0.3, i * 0.1));
  // Барабан
  for (let i = 0; i < 4; i++) {
    playTone(80, "sawtooth", 0.15, 0.4, i * 0.2);
  }
}

export function soundLose() {
  playTone(300, "sawtooth", 0.1, 0.15, 0);
  playTone(220, "sawtooth", 0.15, 0.2, 0.1);
}

export function soundBet() {
  playTone(880, "sine", 0.06, 0.12);
}

export function soundBonus() {
  const notes = [784, 988, 1175, 1568];
  notes.forEach((f, i) => playTone(f, "sine", 0.3, 0.2, i * 0.08));
}

export function soundReveal() {
  playTone(660, "sine", 0.08, 0.15);
}

export function soundMatch() {
  playTone(880, "sine", 0.1, 0.12, 0);
  playTone(1100, "sine", 0.1, 0.12, 0.08);
}
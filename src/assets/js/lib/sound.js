// Sonidos cortos con Web Audio, sin archivos. Compartido por las mecánicas de encajar piezas (404 y /guias/).
// Con movimiento reducido no suena. El primer gesto del usuario debe llamar a unlock() para desbloquear el audio.
export function createSound(enabled = true) {
  let ctx = null;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  const ok = enabled && Ctx;
  const audio = () => {
    if (!ok) return null;
    ctx = ctx || new Ctx();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  };
  const tone = (freq, start, dur, gain, type = "sine", rise = 1.5) => {
    const a = audio();
    if (!a) return;
    const osc = a.createOscillator();
    const g = a.createGain();
    const t = a.currentTime + start;
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * rise, t + dur * 0.6);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g).connect(a.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  };
  return {
    unlock: audio,
    // Encaje: un «clic» brillante
    snap: () => { tone(520, 0, 0.16, 0.05); tone(1040, 0.02, 0.12, 0.02, "triangle"); },
    // Éxito: arpegio corto
    win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.28, 0.045)),
    // Rechazo: un golpe sordo que baja
    thud: () => { tone(180, 0, 0.18, 0.06, "triangle", 0.6); },
  };
}

// Lightweight Web Audio synth — SFX only. Background music was removed at
// user's request (the looping melody felt too repetitive). The exports for
// startMusic / stopMusic are kept as no-ops so existing call sites still
// compile and run without behavioural change.

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AC();
      masterGain = ctx.createGain();
      // Boosted from 0.32 → 0.85 so SFX is clearly audible on laptop speakers.
      masterGain.gain.value = 0.85;
      masterGain.connect(ctx.destination);
    } catch (err) {
      console.warn("Audio unavailable:", err);
      return null;
    }
  }
  return ctx;
}

export function unlockAudio() {
  const c = getCtx();
  if (c && c.state === "suspended") c.resume().catch(() => {});
}

function tone(freq: number, dur: number, type: OscillatorType = "sine", delay = 0, vol = 0.4) {
  const c = getCtx();
  if (!c || !masterGain) return;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(masterGain);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

function noiseBurst(dur: number, vol = 0.3, freq = 1200, q = 1, delay = 0) {
  const c = getCtx();
  if (!c || !masterGain) return;
  const t0 = c.currentTime + delay;
  const bufferSize = Math.floor(c.sampleRate * dur);
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  const src = c.createBufferSource();
  src.buffer = buffer;
  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = freq;
  filter.Q.value = q;
  const gain = c.createGain();
  gain.gain.value = vol;
  src.connect(filter).connect(gain).connect(masterGain);
  src.start(t0);
}

// Music removed — kept as no-ops for API compatibility.
export function startMusic(_volume = 0.5) {}
export function stopMusic() {}

export const sfx = {
  mirrorTap() {
    tone(1320, 0.18, "triangle", 0, 0.4);
    tone(1760, 0.22, "sine", 0.02, 0.32);
    [2640, 3520].forEach((f, i) => tone(f, 0.15, "sine", 0.1 + i * 0.04, 0.16));
  },
  shimmer() {
    [2093, 2637, 3136, 3951].forEach((f, i) => tone(f, 0.35, "sine", i * 0.04, 0.18));
  },
  beamConnect() {
    [880, 1175, 1568].forEach((f, i) => tone(f, 0.5, "sine", i * 0.05, 0.38));
  },
  diyaLight() {
    tone(1568, 0.4, "sine", 0, 0.4);
    tone(2349, 0.3, "triangle", 0.05, 0.25);
  },
  levelComplete() {
    const notes = [523, 659, 784, 1047, 1319];
    notes.forEach((f, i) => tone(f, 0.45, "sine", i * 0.09, 0.4));
    notes.forEach((f, i) => tone(f * 2, 0.4, "triangle", i * 0.09 + 0.02, 0.2));
  },
  cheer() {
    for (let i = 0; i < 8; i++) {
      noiseBurst(0.6, 0.12, 800 + Math.random() * 1400, 0.8, i * 0.05);
    }
    [523, 659, 784, 1047].forEach((f, i) => tone(f, 1.2, "sine", 0.1 + i * 0.04, 0.22));
  },
  // Big sustained crowd applause — many overlapping handclap-like bursts.
  applause() {
    const c = getCtx();
    if (!c) return;
    const total = 2.6;
    const claps = 100;
    for (let i = 0; i < claps; i++) {
      const t = Math.random() * total;
      noiseBurst(0.05 + Math.random() * 0.04, 0.08 + Math.random() * 0.06, 2200 + Math.random() * 2200, 1.5, t);
    }
    for (let i = 0; i < 6; i++) {
      noiseBurst(1.8, 0.09, 700 + Math.random() * 600, 0.6, i * 0.2);
    }
    [523, 659, 784, 1047, 1319].forEach((f, i) =>
      tone(f, 1.6, "sine", 0.15 + i * 0.05, 0.22),
    );
  },
  firework() {
    // whistle up
    tone(220, 0.35, "sine", 0, 0.18);
    tone(440, 0.3, "sine", 0.05, 0.14);
    // bang
    setTimeout(() => {
      noiseBurst(0.08, 0.35, 180, 0.5);
      noiseBurst(0.5, 0.22, 2400, 1.2);
      tone(180, 0.4, "sawtooth", 0, 0.18);
      // sparkles raining down
      for (let i = 0; i < 8; i++) {
        tone(1800 + Math.random() * 2400, 0.15, "sine", 0.1 + i * 0.06, 0.08);
      }
    }, 320);
  },
  sadIntro() {
    // soft melancholic low drone — sparingly used
    tone(146.83, 3, "sine", 0, 0.15);
    tone(220, 3, "sine", 0.4, 0.1);
  },
  finale() {
    const melody = [523, 659, 784, 880, 1047, 880, 784, 1047, 1319];
    melody.forEach((f, i) => {
      tone(f, 0.5, "sine", i * 0.18, 0.4);
      tone(f / 2, 0.6, "triangle", i * 0.18, 0.22);
    });
    setTimeout(() => sfx.applause(), 600);
  },
};

// Lightweight Web Audio synth — background music + a few key SFX.
// Music uses a non-repeating pentatonic scheduler over a soft drone so it
// never feels loopy. SFX are intentionally minimal: tap, applause, cheer,
// firework, finale — overlapping sounds have been trimmed back.

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
      masterGain.gain.value = 0.9;
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

/* ====================== Background music ====================== */

type MusicMode = "festive" | "sad";
let musicTimer: number | null = null;
let droneOsc: OscillatorNode | null = null;
let droneOsc2: OscillatorNode | null = null;
let musicGain: GainNode | null = null;
let currentMode: MusicMode | null = null;

function musicTone(
  freq: number,
  dur: number,
  type: OscillatorType,
  delay: number,
  vol: number,
) {
  const c = getCtx();
  if (!c || !musicGain) return;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.08);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(musicGain);
  osc.start(t0);
  osc.stop(t0 + dur + 0.1);
}

export function startMusic(mode: MusicMode = "festive", volume = 0.55) {
  const c = getCtx();
  if (!c || !masterGain) return;
  if (currentMode === mode && musicGain) {
    musicGain.gain.value = volume;
    return;
  }
  stopMusic();
  currentMode = mode;

  musicGain = c.createGain();
  musicGain.gain.value = volume;
  musicGain.connect(masterGain);

  // Soft drone (two slightly detuned oscillators for warmth)
  const droneFreq = mode === "sad" ? 130.81 : 196.0; // C3 vs G3
  droneOsc = c.createOscillator();
  droneOsc.type = "sine";
  droneOsc.frequency.value = droneFreq;
  droneOsc2 = c.createOscillator();
  droneOsc2.type = "sine";
  droneOsc2.frequency.value = droneFreq * 1.5;
  const droneGain = c.createGain();
  droneGain.gain.value = mode === "sad" ? 0.18 : 0.1;
  droneOsc.connect(droneGain);
  droneOsc2.connect(droneGain);
  droneGain.connect(musicGain);
  droneOsc.start();
  droneOsc2.start();

  // Festive: bright pentatonic upper octave (Raag Bilawal-ish).
  // Sad: low natural-minor descent.
  const scale =
    mode === "sad"
      ? [261.63, 293.66, 311.13, 349.23, 392.0, 415.3] // C minor-ish
      : [523.25, 587.33, 659.25, 783.99, 880.0, 987.77, 1046.5]; // C major upper

  let lastIdx = mode === "sad" ? scale.length - 1 : 2;
  let direction = mode === "sad" ? -1 : 1;

  const schedule = () => {
    // Prefer stepwise motion with occasional leaps; flip direction at edges.
    const leap = Math.random() < 0.18;
    const step = leap ? (Math.random() < 0.5 ? -2 : 2) : direction;
    lastIdx += step;
    if (lastIdx >= scale.length - 1) {
      lastIdx = scale.length - 1;
      direction = -1;
    } else if (lastIdx <= 0) {
      lastIdx = 0;
      direction = 1;
    }
    const f = scale[lastIdx];
    const dur = mode === "sad" ? 1.6 + Math.random() * 0.9 : 0.7 + Math.random() * 0.5;
    musicTone(f, dur, "sine", 0, mode === "sad" ? 0.18 : 0.22);
    // Occasional harmony (a fifth/octave above)
    if (Math.random() < 0.35) {
      musicTone(f * (mode === "sad" ? 1.2 : 1.5), dur * 0.85, "triangle", 0.05, 0.09);
    }
    // Subtle pulse for festive feel
    if (mode === "festive" && Math.random() < 0.25) {
      noiseBurst(0.1, 0.05, 180, 0.6, 0);
    }
    const gap = mode === "sad" ? 1500 + Math.random() * 900 : 520 + Math.random() * 380;
    musicTimer = window.setTimeout(schedule, gap);
  };
  schedule();
}

export function stopMusic() {
  currentMode = null;
  if (musicTimer) {
    clearTimeout(musicTimer);
    musicTimer = null;
  }
  const stopOsc = (o: OscillatorNode | null) => {
    if (!o) return;
    try {
      o.stop();
    } catch {
      // ignore
    }
    try {
      o.disconnect();
    } catch {
      // ignore
    }
  };
  stopOsc(droneOsc);
  stopOsc(droneOsc2);
  droneOsc = null;
  droneOsc2 = null;
  if (musicGain) {
    try {
      musicGain.disconnect();
    } catch {
      // ignore
    }
    musicGain = null;
  }
}

/* ====================== SFX (trimmed) ====================== */

export const sfx = {
  // The one SFX users explicitly wanted to keep — clear, crisp mirror tap.
  mirrorTap() {
    tone(1320, 0.16, "triangle", 0, 0.45);
    tone(1760, 0.18, "sine", 0.02, 0.32);
  },
  // Soft success chime when the whole beam connects — single short chord,
  // no long melody, no overlapping diya beeps.
  levelComplete() {
    [523, 784, 1047].forEach((f, i) => tone(f, 0.4, "sine", i * 0.05, 0.3));
  },
  // Sustained crowd applause — many tiny handclaps.
  applause() {
    const c = getCtx();
    if (!c) return;
    const total = 2.2;
    for (let i = 0; i < 80; i++) {
      const t = Math.random() * total;
      noiseBurst(0.04 + Math.random() * 0.04, 0.09 + Math.random() * 0.06, 2400 + Math.random() * 2000, 1.5, t);
    }
    for (let i = 0; i < 4; i++) {
      noiseBurst(1.6, 0.07, 700 + Math.random() * 500, 0.6, i * 0.25);
    }
  },
  cheer() {
    for (let i = 0; i < 5; i++) {
      noiseBurst(0.5, 0.1, 900 + Math.random() * 1400, 0.8, i * 0.08);
    }
    [523, 659, 784].forEach((f, i) => tone(f, 0.9, "sine", 0.1 + i * 0.05, 0.18));
  },
  firework() {
    // soft whistle up + airy pop (no harsh sawtooth)
    tone(320, 0.3, "sine", 0, 0.14);
    setTimeout(() => {
      noiseBurst(0.06, 0.22, 220, 0.5);
      noiseBurst(0.4, 0.16, 2200, 1.2);
      for (let i = 0; i < 5; i++) {
        tone(1800 + Math.random() * 2000, 0.12, "sine", 0.1 + i * 0.05, 0.06);
      }
    }, 280);
  },
  // No-ops kept for backwards compatibility with existing call sites
  // (users found these overlapping bleeps annoying).
  shimmer() {},
  beamConnect() {},
  diyaLight() {},
  sadIntro() {}, // now handled by startMusic('sad')
  finale() {
    // single, satisfying triad — applause carries the rest
    [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.8, "sine", i * 0.08, 0.3));
  },
};

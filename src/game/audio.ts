// Lightweight Web Audio synth — festive layered music + cute SFX,
// no audio files shipped. The music uses three different melodic phrases
// that rotate so it never feels like a 1-bar loop.

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let musicGain: GainNode | null = null;
let musicTimer: number | null = null;
let musicPlaying = false;
let musicPhrase = 0;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AC();
      masterGain = ctx.createGain();
      masterGain.gain.value = 0.32;
      masterGain.connect(ctx.destination);
      musicGain = ctx.createGain();
      musicGain.gain.value = 0.0;
      musicGain.connect(masterGain);
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

function tone(freq: number, dur: number, type: OscillatorType = "sine", delay = 0, vol = 0.4, dest?: AudioNode) {
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
  osc.connect(gain).connect(dest ?? masterGain);
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

// === Festive ambient music ===
// Three distinct phrases rotated each cycle so the loop never feels short.
// Pentatonic raga-ish flavor with octave shimmer and a low drone.
const PHRASES: Array<Array<[number, number]>> = [
  // [freq, duration in beats]
  [
    [523.25, 0.5], [587.33, 0.25], [659.25, 0.25],
    [783.99, 0.5], [659.25, 0.5],
    [587.33, 0.5], [523.25, 0.5], [440, 1],
  ],
  [
    [659.25, 0.5], [783.99, 0.25], [880, 0.25],
    [987.77, 0.5], [880, 0.5],
    [783.99, 0.5], [659.25, 0.5], [587.33, 1],
  ],
  [
    [440, 0.5], [523.25, 0.5], [659.25, 0.5], [587.33, 0.5],
    [523.25, 0.5], [659.25, 0.5], [783.99, 1],
  ],
];

const BEAT = 0.42; // seconds per beat — gentle tempo

function playMusicCycle() {
  const c = getCtx();
  if (!c || !musicGain || !musicPlaying) return;

  const phrase = PHRASES[musicPhrase % PHRASES.length];
  musicPhrase++;

  let t = 0;
  for (const [f, beats] of phrase) {
    const t0 = c.currentTime + t;
    const dur = beats * BEAT;

    // Bell note
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sine";
    osc.frequency.value = f;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(0.18, t0 + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur + 0.4);
    osc.connect(gain).connect(musicGain);
    osc.start(t0);
    osc.stop(t0 + dur + 0.5);

    // Octave shimmer
    const osc2 = c.createOscillator();
    const g2 = c.createGain();
    osc2.type = "triangle";
    osc2.frequency.value = f * 2;
    g2.gain.setValueAtTime(0.0001, t0);
    g2.gain.exponentialRampToValueAtTime(0.05, t0 + 0.04);
    g2.gain.exponentialRampToValueAtTime(0.0001, t0 + dur + 0.2);
    osc2.connect(g2).connect(musicGain);
    osc2.start(t0);
    osc2.stop(t0 + dur + 0.3);

    t += beats * BEAT;
  }

  // Soft drone underneath the whole phrase
  const t0 = c.currentTime;
  const totalDur = t;
  const droneFreq = musicPhrase % 2 === 0 ? 130.81 : 146.83;
  const drone = c.createOscillator();
  const dg = c.createGain();
  drone.type = "sine";
  drone.frequency.value = droneFreq;
  dg.gain.setValueAtTime(0.0001, t0);
  dg.gain.exponentialRampToValueAtTime(0.07, t0 + 0.8);
  dg.gain.exponentialRampToValueAtTime(0.0001, t0 + totalDur);
  drone.connect(dg).connect(musicGain);
  drone.start(t0);
  drone.stop(t0 + totalDur + 0.1);

  // Light tabla-ish pulse on each beat
  const beats = Math.floor(totalDur / BEAT);
  for (let i = 0; i < beats; i++) {
    const accent = i % 4 === 0;
    noiseBurst(0.12, accent ? 0.05 : 0.03, accent ? 180 : 320, 2, i * BEAT);
  }

  musicTimer = window.setTimeout(playMusicCycle, totalDur * 1000);
}

export function startMusic(volume = 0.5) {
  const c = getCtx();
  if (!c || !musicGain || musicPlaying) return;
  musicPlaying = true;
  musicGain.gain.cancelScheduledValues(c.currentTime);
  musicGain.gain.setValueAtTime(musicGain.gain.value, c.currentTime);
  musicGain.gain.linearRampToValueAtTime(volume, c.currentTime + 1.5);
  playMusicCycle();
}

export function stopMusic() {
  const c = getCtx();
  if (!c || !musicGain) return;
  musicPlaying = false;
  if (musicTimer) {
    clearTimeout(musicTimer);
    musicTimer = null;
  }
  musicGain.gain.cancelScheduledValues(c.currentTime);
  musicGain.gain.linearRampToValueAtTime(0, c.currentTime + 0.6);
}

export const sfx = {
  mirrorTap() {
    tone(1320, 0.18, "triangle", 0, 0.3);
    tone(1760, 0.22, "sine", 0.02, 0.25);
    [2640, 3520].forEach((f, i) => tone(f, 0.15, "sine", 0.1 + i * 0.04, 0.12));
  },
  shimmer() {
    [2093, 2637, 3136, 3951].forEach((f, i) => tone(f, 0.35, "sine", i * 0.04, 0.14));
  },
  beamConnect() {
    [880, 1175, 1568].forEach((f, i) => tone(f, 0.5, "sine", i * 0.05, 0.3));
  },
  diyaLight() {
    tone(1568, 0.4, "sine", 0, 0.32);
    tone(2349, 0.3, "triangle", 0.05, 0.2);
  },
  levelComplete() {
    const notes = [523, 659, 784, 1047, 1319];
    notes.forEach((f, i) => tone(f, 0.45, "sine", i * 0.09, 0.32));
    notes.forEach((f, i) => tone(f * 2, 0.4, "triangle", i * 0.09 + 0.02, 0.16));
  },
  cheer() {
    for (let i = 0; i < 6; i++) {
      noiseBurst(0.6, 0.08, 800 + Math.random() * 1400, 0.8, i * 0.05);
    }
    [523, 659, 784, 1047].forEach((f, i) => tone(f, 1.2, "sine", 0.1 + i * 0.04, 0.18));
  },
  // Big sustained crowd applause — many overlapping handclap-like bursts.
  applause() {
    const c = getCtx();
    if (!c) return;
    const total = 2.4;
    const claps = 80;
    for (let i = 0; i < claps; i++) {
      const t = Math.random() * total;
      // each "clap" is a very short bright noise burst
      noiseBurst(0.05 + Math.random() * 0.04, 0.05 + Math.random() * 0.05, 2200 + Math.random() * 2200, 1.5, t);
    }
    // warm crowd-cheer pad under the claps
    for (let i = 0; i < 5; i++) {
      noiseBurst(1.6, 0.06, 700 + Math.random() * 600, 0.6, i * 0.2);
    }
    // celebratory chord on top
    [523, 659, 784, 1047, 1319].forEach((f, i) =>
      tone(f, 1.6, "sine", 0.15 + i * 0.05, 0.16),
    );
  },
  firework() {
    noiseBurst(0.05, 0.15, 200, 0.5);
    setTimeout(() => {
      noiseBurst(0.6, 0.25, 2400, 1.2);
      tone(180, 0.4, "sawtooth", 0, 0.12);
    }, 60);
  },
  finale() {
    const melody = [523, 659, 784, 880, 1047, 880, 784, 1047, 1319];
    melody.forEach((f, i) => {
      tone(f, 0.5, "sine", i * 0.18, 0.32);
      tone(f / 2, 0.6, "triangle", i * 0.18, 0.18);
    });
    setTimeout(() => sfx.applause(), 600);
  },
};

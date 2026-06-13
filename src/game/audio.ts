// Lightweight Web Audio score. The music follows authored melodic phrases
// with accompaniment rather than choosing random notes. Only mirror taps
// remain as sound effects, keeping the mix gentle and uncluttered.

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
let musicStep = 0;
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

  // A quiet tanpura-like fifth gives both arrangements a warm foundation.
  const droneFreq = mode === "sad" ? 110 : 146.83;
  droneOsc = c.createOscillator();
  droneOsc.type = "sine";
  droneOsc.frequency.value = droneFreq;
  droneOsc2 = c.createOscillator();
  droneOsc2.type = "sine";
  droneOsc2.frequency.value = droneFreq * 1.5;
  const droneGain = c.createGain();
  droneGain.gain.value = mode === "sad" ? 0.14 : 0.08;
  droneOsc.connect(droneGain);
  droneOsc2.connect(droneGain);
  droneGain.connect(musicGain);
  droneOsc.start();
  droneOsc2.start();

  musicStep = 0;
  const sadPhrase = [293.66, 261.63, 233.08, 220, 261.63, 246.94, 220, 196];
  const festiveMelody = [
    440, 523.25, 587.33, 659.25, 587.33, 523.25, 440, 392,
    440, 523.25, 659.25, 783.99, 659.25, 587.33, 523.25, 440,
    392, 440, 523.25, 587.33, 659.25, 587.33, 523.25, 392,
  ];
  const festiveBass = [146.83, 146.83, 196, 196, 164.81, 164.81, 220, 196];

  const schedule = () => {
    if (mode === "sad") {
      const note = sadPhrase[musicStep % sadPhrase.length];
      musicTone(note, 1.75, "sine", 0, 0.16);
      if (musicStep % 2 === 0) musicTone(note / 2, 2.8, "triangle", 0, 0.055);
      musicStep += 1;
      musicTimer = window.setTimeout(schedule, musicStep % sadPhrase.length === 0 ? 2200 : 1550);
      return;
    }

    const note = festiveMelody[musicStep % festiveMelody.length];
    const beat = musicStep % 8;
    musicTone(note, beat === 3 || beat === 7 ? 0.68 : 0.42, "triangle", 0, 0.16);
    if (beat % 2 === 0) {
      const bass = festiveBass[Math.floor(musicStep / 2) % festiveBass.length];
      musicTone(bass, 0.82, "sine", 0, 0.075);
      musicTone(bass * 1.5, 0.58, "sine", 0.03, 0.035);
    }
    if (beat === 0 || beat === 4) noiseBurst(0.055, 0.025, 170, 0.7, 0);
    musicStep += 1;
    musicTimer = window.setTimeout(schedule, musicStep % festiveMelody.length === 0 ? 1050 : 470);
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
  levelComplete() {},
  applause() {},
  cheer() {},
  firework() {},
  shimmer() {},
  beamConnect() {},
  diyaLight() {},
  sadIntro() {}, // now handled by startMusic('sad')
  finale() {},
};

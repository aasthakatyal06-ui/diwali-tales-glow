import sadMusicUrl from "@/assets/audio/sad-intro.mp3";
import festiveMusicUrl from "@/assets/audio/festive-sitar.mp3";

// Real recorded instrumental tracks replace the old synthesized note loops.
// Web Audio remains only for the two concise interaction effects.

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
let musicAudio: HTMLAudioElement | null = null;
let currentMode: MusicMode | null = null;

export function startMusic(mode: MusicMode = "festive", volume = 0.55) {
  if (typeof window === "undefined") return;
  if (currentMode === mode && musicAudio) {
    musicAudio.volume = Math.min(1, volume);
    void musicAudio.play().catch(() => {});
    return;
  }
  stopMusic();
  currentMode = mode;
  musicAudio = new Audio(mode === "sad" ? sadMusicUrl : festiveMusicUrl);
  musicAudio.loop = true;
  musicAudio.preload = "auto";
  musicAudio.volume = Math.min(1, volume);
  void musicAudio.play().catch(() => {});
}

export function stopMusic() {
  currentMode = null;
  if (musicAudio) {
    musicAudio.pause();
    musicAudio.src = "";
    musicAudio = null;
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
  firework() {
    noiseBurst(0.42, 0.18, 115, 0.65);
    noiseBurst(0.2, 0.08, 1350, 0.8, 0.12);
  },
  shimmer() {},
  beamConnect() {},
  diyaLight() {},
  sadIntro() {}, // now handled by startMusic('sad')
  finale() {},
};

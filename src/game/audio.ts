import sadMusicUrl from "@/assets/audio/sad-intro.mp3";
import festiveMusicUrl from "@/assets/audio/festive-sitar.mp3";

/**
 * Music + SFX. Music uses recorded tracks (HTMLAudioElement); SFX uses
 * tiny synthesized blips via WebAudio so we don't ship extra files.
 *
 * Continuity guarantees:
 *  - same-mode calls to startMusic() never restart playback
 *  - we watchdog the element and re-issue play() if the browser pauses it
 *    (tab visibility changes, autoplay throttles, lost focus)
 */

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (ctx) return ctx;
  try {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.9;
    masterGain.connect(ctx.destination);
    return ctx;
  } catch (err) {
    console.warn("Audio unavailable:", err);
    return null;
  }
}

export function unlockAudio() {
  const c = getCtx();
  if (c && c.state === "suspended") c.resume().catch(() => {});
  // Also nudge any existing music element (user gesture unlocks autoplay).
  if (musicAudio && musicAudio.paused) void musicAudio.play().catch(() => {});
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

export type MusicMode = "festive" | "sad";

let musicAudio: HTMLAudioElement | null = null;
let currentMode: MusicMode | null = null;
let watchdog: number | null = null;

function attachResumeListeners() {
  if (typeof window === "undefined") return;
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && musicAudio && musicAudio.paused) {
      void musicAudio.play().catch(() => {});
    }
  });
}

let listenersAttached = false;

export function startMusic(mode: MusicMode = "festive", volume = 0.85) {
  if (typeof window === "undefined") return;

  if (!listenersAttached) {
    attachResumeListeners();
    listenersAttached = true;
  }

  // Same track already playing — just update volume, don't restart.
  if (currentMode === mode && musicAudio) {
    musicAudio.volume = Math.min(1, volume);
    if (musicAudio.paused) void musicAudio.play().catch(() => {});
    return;
  }

  stopMusic();
  currentMode = mode;
  const audio = new Audio(mode === "sad" ? sadMusicUrl : festiveMusicUrl);
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = Math.min(1, volume);
  // Belt-and-suspenders loop: some browsers occasionally drop loop=true on
  // long files. If 'ended' ever fires, jump back and play again.
  audio.addEventListener("ended", () => {
    audio.currentTime = 0;
    void audio.play().catch(() => {});
  });
  musicAudio = audio;
  void audio.play().catch(() => {});

  // Watchdog: every 2s, if the element should be playing but isn't, resume.
  if (watchdog !== null) window.clearInterval(watchdog);
  watchdog = window.setInterval(() => {
    if (musicAudio && currentMode && musicAudio.paused) {
      void musicAudio.play().catch(() => {});
    }
  }, 2000);
}

export function stopMusic() {
  currentMode = null;
  if (watchdog !== null) {
    window.clearInterval(watchdog);
    watchdog = null;
  }
  if (musicAudio) {
    musicAudio.pause();
    musicAudio.src = "";
    musicAudio = null;
  }
}

/* ====================== SFX (intentionally minimal) ====================== */

export const sfx = {
  mirrorTap() {
    tone(1320, 0.16, "triangle", 0, 0.45);
    tone(1760, 0.18, "sine", 0.02, 0.32);
  },
  shatter() {
    // Quick brittle "crack" + dust fall.
    noiseBurst(0.18, 0.32, 3200, 2.2);
    noiseBurst(0.32, 0.22, 900, 1.2, 0.05);
  },
  firework() {
    noiseBurst(0.42, 0.22, 115, 0.65);
    noiseBurst(0.2, 0.1, 1350, 0.8, 0.12);
  },
  // Kept as no-ops so existing call sites keep working without overlap noise.
  levelComplete() {},
  applause() {},
  cheer() {},
  shimmer() {},
  beamConnect() {},
  diyaLight() {},
  sadIntro() {},
  finale() {},
};

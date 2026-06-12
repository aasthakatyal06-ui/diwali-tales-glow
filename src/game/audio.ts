// Lightweight Web Audio synth — generates magical chimes without shipping any sound files.
// All tones are short and pleasant, designed for kids.

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AC();
      masterGain = ctx.createGain();
      masterGain.gain.value = 0.35;
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
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(masterGain);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

export const sfx = {
  mirrorTap() {
    tone(1320, 0.18, "triangle", 0, 0.3);
    tone(1760, 0.22, "sine", 0.02, 0.25);
  },
  beamConnect() {
    [880, 1175, 1568].forEach((f, i) => tone(f, 0.5, "sine", i * 0.05, 0.3));
  },
  diyaLight() {
    tone(1568, 0.4, "sine", 0, 0.35);
    tone(2349, 0.3, "triangle", 0.05, 0.2);
  },
  levelComplete() {
    const notes = [523, 659, 784, 1047, 1319];
    notes.forEach((f, i) => tone(f, 0.45, "sine", i * 0.09, 0.35));
    notes.forEach((f, i) => tone(f * 2, 0.4, "triangle", i * 0.09 + 0.02, 0.18));
  },
  finale() {
    const melody = [523, 659, 784, 880, 1047, 880, 784, 1047, 1319];
    melody.forEach((f, i) => {
      tone(f, 0.5, "sine", i * 0.18, 0.32);
      tone(f / 2, 0.6, "triangle", i * 0.18, 0.18);
    });
  },
};

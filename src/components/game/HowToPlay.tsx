import { useState } from "react";
import { Elephant } from "./Elephant";

interface HowToPlayProps {
  onReady: () => void;
}

const STEPS = [
  {
    icon: "diya",
    title: "Light the Diyas",
    body: "Your goal: guide the beam of light to every diya to relight the village.",
  },
  {
    icon: "mirror",
    title: "Spin the Mirrors",
    body: "Tap a mirror to rotate it. Keep tapping until it faces the right direction and turns golden.",
  },
  {
    icon: "path",
    title: "Follow the Light",
    body: "The light beam bounces from mirror to mirror. Align them all and the diyas will glow!",
  },
] as const;

function StepIcon({ kind }: { kind: string }) {
  if (kind === "diya") {
    return (
      <svg viewBox="0 0 80 70" className="h-20 w-24">
        <defs>
          <radialGradient id="htDiyaOil" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffe39a" />
            <stop offset="100%" stopColor="#a35a1e" />
          </radialGradient>
          <radialGradient id="htDiyaFlame" cx="50%" cy="80%" r="60%">
            <stop offset="0%" stopColor="#fffbe0" />
            <stop offset="35%" stopColor="oklch(0.94 0.18 90)" />
            <stop offset="75%" stopColor="oklch(0.78 0.22 50)" />
            <stop offset="100%" stopColor="oklch(0.6 0.22 30 / 0)" />
          </radialGradient>
        </defs>
        <path
          d="M 8 44 Q 12 64 40 64 Q 68 64 72 44 Q 64 56 40 56 Q 16 56 8 44 Z"
          fill="#a64f1f"
        />
        <ellipse cx="40" cy="46" rx="28" ry="4" fill="url(#htDiyaOil)" />
        <path d="M 40 46 Q 42 38 40 32" stroke="#f3e3b8" strokeWidth="2" fill="none" strokeLinecap="round" />
        <g style={{ transformOrigin: "40px 30px", animation: "flame-flicker 0.55s ease-in-out infinite" }}>
          <ellipse cx="40" cy="22" rx="8" ry="14" fill="url(#htDiyaFlame)" />
          <ellipse cx="40" cy="24" rx="4" ry="9" fill="oklch(0.95 0.18 88)" />
        </g>
      </svg>
    );
  }
  if (kind === "mirror") {
    return (
      <svg viewBox="0 0 100 130" className="h-24 w-20">
        <circle cx="50" cy="50" r="38" fill="#e6b13a" />
        <circle cx="50" cy="50" r="30" fill="#7a3a14" />
        <circle cx="50" cy="50" r="27" fill="#fff7e0" />
        <polygon points="50,10 55,22 45,22" fill="#fff7c2" stroke="#5a2a0a" strokeWidth="1" />
        <rect x="44" y="82" width="12" height="38" rx="6" fill="#d49a3a" />
        <circle cx="50" cy="50" r="26" fill="none" stroke="oklch(0.98 0.18 85)" strokeWidth="2.5" opacity="0.95" />
      </svg>
    );
  }
  // path — light beam
  return (
    <svg viewBox="0 0 120 60" className="h-16 w-28">
      <line x1="10" y1="30" x2="110" y2="30" stroke="oklch(0.98 0.12 90)" strokeWidth="4" strokeLinecap="round" />
      <line x1="10" y1="30" x2="110" y2="30" stroke="oklch(0.86 0.18 70 / 0.35)" strokeWidth="10" strokeLinecap="round" filter="blur(3px)" />
      <circle cx="10" cy="30" r="6" fill="oklch(0.99 0.18 90)" />
      <circle cx="110" cy="30" r="6" fill="oklch(0.94 0.16 80)" />
    </svg>
  );
}

export function HowToPlay({ onReady }: HowToPlayProps) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0f30] via-[#0d0a1a] to-[#0a0812]" />

      <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 pointer-events-none" style={{ animation: "float-soft 4s ease-in-out infinite" }}>
        <Elephant size={Math.min(260, typeof window !== "undefined" ? window.innerHeight * 0.4 : 240)} />
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 z-10">
        <div
          className="max-w-md w-full rounded-3xl px-8 py-8 text-center shadow-2xl ring-2 ring-[oklch(0.86_0.18_75)/0.5]"
          style={{
            background: "linear-gradient(180deg,#fff5d6,#ffd994)",
            animation: "slide-up-fade 0.5s ease-out both",
          }}
        >
          <p className="font-display text-2xl text-[#5a2a0a] md:text-3xl mb-6">How to Play</p>

          <div className="flex justify-center mb-4" style={{ animation: "slide-up-fade 0.6s ease-out both" }}>
            <StepIcon kind={current.icon} />
          </div>

          <p className="font-display text-xl text-[#c24a1a] md:text-2xl mb-2">{current.title}</p>
          <p className="font-hand text-lg text-[#5a2a0a] md:text-xl leading-relaxed">{current.body}</p>

          <div className="flex justify-center gap-2 mt-5">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className="block h-2 w-2 rounded-full transition-all"
                style={{ background: i === step ? "#c24a1a" : "#c4a868" }}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              if (isLast) onReady();
              else setStep((s) => s + 1);
            }}
            className="font-display mt-6 rounded-full bg-[#c24a1a] px-8 py-2.5 text-xl text-white shadow-lg hover:bg-[#a83a14] transition-colors"
          >
            {isLast ? "Let's go!" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

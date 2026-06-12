import { useEffect, useState } from "react";
import { Elephant } from "./Elephant";
import { VillageBackdrop } from "./VillageBackdrop";
import { Fireflies, StarField } from "./Particles";
import { sfx, startMusic } from "@/game/audio";

interface IntroSceneProps {
  onFinish: () => void;
}

/**
 * Cinematic intro (~10s). Camera drifts toward the sleeping village,
 * elephant walks in, looks at the player, points toward the puzzle.
 * Player can skip at any time.
 */
export function IntroScene({ onFinish }: IntroSceneProps) {
  // Brightness starts very dark and slowly lifts a touch as the scene plays
  const [b, setB] = useState(0.02);
  const [stage, setStage] = useState<0 | 1 | 2 | 3>(0);

  useEffect(() => {
    startMusic(0.45);
    const t1 = setTimeout(() => setB(0.05), 200);
    const t2 = setTimeout(() => setStage(1), 1800); // elephant walks in
    const t3 = setTimeout(() => {
      setStage(2);
      sfx.shimmer();
    }, 4200); // first line
    const t4 = setTimeout(() => setStage(3), 7000); // second line + point
    const t5 = setTimeout(() => onFinish(), 10500);
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, [onFinish]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Slow camera push */}
      <div className="absolute inset-0" style={{ animation: "camera-push 11s ease-out forwards" }}>
        <VillageBackdrop brightness={b} />
        <StarField count={120} />
        <Fireflies count={18} />
      </div>

      {/* A few faint flickering diyas in the distance */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { x: 22, y: 70 },
          { x: 48, y: 72 },
          { x: 72, y: 68 },
        ].map((d, i) => (
          <span
            key={i}
            className="absolute h-2 w-2 rounded-full"
            style={{
              left: `${d.x}%`,
              top: `${d.y}%`,
              background: "radial-gradient(circle, #fff2a0, transparent 70%)",
              boxShadow: "0 0 18px oklch(0.86 0.18 70 / 0.8)",
              animation: `flame-flicker ${0.8 + i * 0.2}s ease-in-out infinite`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      {/* Elephant — walks in from right, settles, then points */}
      <div
        className="absolute bottom-[10%] pointer-events-none"
        style={{
          left: "50%",
          transform: "translateX(-50%)",
          animation: "elephant-walk-in 2.2s ease-out both",
        }}
      >
        <Elephant size={360} pointing={stage >= 3} />
      </div>

      {/* Dialogue bubble */}
      {stage >= 2 && (
        <div
          className="absolute left-1/2 top-[18%] -translate-x-1/2 max-w-[80%] text-center"
          style={{ animation: "slide-up-fade 0.6s ease-out both" }}
          key={stage}
        >
          <div className="inline-block rounded-3xl bg-white/12 px-6 py-3 backdrop-blur-md ring-1 ring-white/25">
            <p className="font-display text-xl md:text-3xl text-white drop-shadow-[0_2px_10px_oklch(0.05_0_0_/_0.8)]">
              {stage === 2 ? "The Diwali light is fading…" : "Will you help me bring it back?"}
            </p>
          </div>
        </div>
      )}

      {/* Skip button — always visible */}
      <button
        type="button"
        onClick={onFinish}
        className="absolute top-5 right-5 z-50 rounded-full bg-white/15 px-5 py-2 font-display text-sm text-white backdrop-blur-md ring-1 ring-white/25 hover:bg-white/25 transition"
      >
        Skip Intro →
      </button>

      {/* Vignette darken-in */}
      <div className="absolute inset-0 pointer-events-none bg-black" style={{ animation: "fade-from-black 1.4s ease-out both" }} />
    </div>
  );
}

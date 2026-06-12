import { useEffect, useMemo, useState } from "react";
import { Heart, RotateCcw } from "lucide-react";
import { Elephant } from "./Elephant";
import { VillageBackdrop } from "./VillageBackdrop";
import { Fireflies, FloatingPetals, StarField } from "./Particles";
import { sfx } from "@/game/audio";

interface FinaleSceneProps {
  onReplay: () => void;
}

/** Final 10-15s cinematic. Pure visual reward — no interaction needed. */
export function FinaleScene({ onReplay }: FinaleSceneProps) {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    sfx.finale();
    const t = setTimeout(() => setShowButton(true), 4500);
    return () => clearTimeout(t);
  }, []);

  const fireworks = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 35,
        delay: 0.4 + Math.random() * 5,
        hue: [45, 15, 80, 320, 200][i % 5],
        size: 180 + Math.random() * 120,
      })),
    [],
  );

  const lanterns = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => ({
        id: i,
        x: 5 + Math.random() * 90,
        delay: Math.random() * 6,
        dur: 8 + Math.random() * 6,
        dx: (Math.random() - 0.5) * 100 + "px",
        hue: i % 2 === 0 ? 45 : 15,
        size: 30 + Math.random() * 20,
      })),
    [],
  );

  return (
    <div className="relative h-full w-full overflow-hidden">
      <VillageBackdrop brightness={1} />
      <StarField count={100} />
      <Fireflies count={40} />
      <FloatingPetals count={35} />

      {/* Rising lanterns */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {lanterns.map((l) => (
          <div
            key={l.id}
            className="absolute bottom-0"
            style={
              {
                left: `${l.x}%`,
                animation: `rise-lantern ${l.dur}s ease-in infinite`,
                animationDelay: `${l.delay}s`,
                "--dx": l.dx,
              } as React.CSSProperties
            }
          >
            <div
              className="rounded-[40%]"
              style={{
                width: l.size,
                height: l.size * 1.3,
                background: `radial-gradient(circle, oklch(0.9 0.18 ${l.hue}), oklch(0.6 0.2 ${l.hue}))`,
                boxShadow: `0 0 ${l.size}px oklch(0.78 0.2 ${l.hue} / 0.7)`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Fireworks */}
      <div className="absolute inset-0 pointer-events-none">
        {fireworks.map((f) => (
          <div
            key={f.id}
            className="absolute rounded-full"
            style={{
              left: `${f.x}%`,
              top: `${f.y}%`,
              width: f.size,
              height: f.size,
              background: `radial-gradient(circle, oklch(0.95 0.2 ${f.hue}) 0%, oklch(0.78 0.22 ${f.hue} / 0.6) 30%, transparent 70%)`,
              animation: "firework-burst 1.8s ease-out infinite",
              animationDelay: `${f.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Hero elephant doing the joy dance */}
      <div
        className="absolute left-1/2 bottom-[18%] -translate-x-1/2 pointer-events-none"
        style={{ animation: "slide-up-fade 1.4s ease-out 0.3s both" }}
      >
        <Elephant size={360} celebrating />
      </div>

      {/* Title card */}
      <div
        className="absolute inset-x-0 top-12 text-center px-6"
        style={{ animation: "slide-up-fade 1s ease-out 0.6s both" }}
      >
        <div className="flex items-center justify-center gap-2 text-[oklch(0.86_0.16_75)]">
          <Heart className="h-4 w-4 fill-current" />
          <span className="font-display text-xs uppercase tracking-[0.4em]">Happy Diwali</span>
          <Heart className="h-4 w-4 fill-current" />
        </div>
        <h1
          className="mt-2 font-display text-5xl text-white sm:text-6xl md:text-7xl"
          style={{ animation: "title-glow 3s ease-in-out infinite" }}
        >
          You brought the festival back
        </h1>
        <p className="mt-3 text-white/85 md:text-lg">The village will remember your light forever.</p>
      </div>

      {showButton && (
        <button
          type="button"
          onClick={onReplay}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 rounded-full bg-white/15 px-7 py-3 font-display text-base text-white backdrop-blur-md ring-1 ring-white/30 transition hover:bg-white/25"
          style={{ animation: "slide-up-fade 0.6s ease-out both" }}
        >
          <RotateCcw className="h-4 w-4" />
          Play Again
        </button>
      )}
    </div>
  );
}

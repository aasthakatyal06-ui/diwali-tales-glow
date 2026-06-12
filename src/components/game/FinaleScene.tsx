import { useEffect, useMemo, useState } from "react";
import { Heart, RotateCcw } from "lucide-react";
import { Elephant } from "./Elephant";
import { VillageBackdrop } from "./VillageBackdrop";
import { Fireflies, FloatingPetals, StarField } from "./Particles";
import { Diya } from "./Diya";
import { sfx } from "@/game/audio";

interface FinaleSceneProps {
  onReplay: () => void;
}

/** Long, lavish finale (~14s before button). Fireworks, dancing villagers,
 *  lanterns rising, diyas everywhere, crowd cheering. */
export function FinaleScene({ onReplay }: FinaleSceneProps) {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    sfx.finale();
    const intervals: number[] = [];
    // Continuous firework barrage for ~20s
    for (let i = 0; i < 32; i++) {
      intervals.push(window.setTimeout(() => sfx.firework(), 300 + i * 650));
    }
    [1200, 5500, 10000, 15000, 19000].forEach((t) =>
      intervals.push(window.setTimeout(() => sfx.cheer(), t)),
    );
    const t = setTimeout(() => setShowButton(true), 14000);
    return () => {
      intervals.forEach(clearTimeout);
      clearTimeout(t);
    };
  }, []);

  const fireworks = useMemo(
    () =>
      Array.from({ length: 34 }).map((_, i) => ({
        id: i,
        x: 3 + Math.random() * 94,
        y: 4 + Math.random() * 48,
        delay: 0.2 + Math.random() * 18,
        hue: [45, 15, 80, 320, 200, 0, 140][i % 7],
        size: 180 + Math.random() * 200,
      })),
    [],
  );

  const lanterns = useMemo(
    () =>
      Array.from({ length: 42 }).map((_, i) => ({
        id: i,
        x: 3 + Math.random() * 94,
        delay: Math.random() * 14,
        dur: 10 + Math.random() * 8,
        dx: (Math.random() - 0.5) * 120 + "px",
        hue: i % 2 === 0 ? 45 : 15,
        size: 26 + Math.random() * 26,
      })),
    [],
  );

  // Diyas scattered everywhere
  const diyas = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        x: 4 + (i / 17) * 92 + (Math.random() - 0.5) * 5,
        y: 78 + Math.sin(i * 0.9) * 6,
        size: (i % 3 === 0 ? "lg" : i % 2 === 0 ? "md" : "sm") as "sm" | "md" | "lg",
      })),
    [],
  );

  // Dancing villagers — rounded silhouettes with raised arms; placed in
  // two side clusters so the hero elephant in the center isn't covered.
  const villagers = useMemo(() => {
    const left = [6, 12, 18, 24, 30, 36];
    const right = [64, 70, 76, 82, 88, 94];
    const xs = [...left, ...right];
    return xs.map((x, i) => ({
      id: i,
      x,
      bottom: i % 2 === 0 ? 8 : 16,
      delay: Math.random() * 1.2,
      color: ["#ff5a7a", "#ffd24d", "#7fb6ff", "#c084ff", "#ff9c4d", "#5cd6a6"][i % 6],
      flip: i >= left.length,
    }));
  }, []);


  return (
    <div className="relative h-full w-full overflow-hidden">
      <VillageBackdrop brightness={1} />
      <StarField count={120} />
      <Fireflies count={50} />
      <FloatingPetals count={45} />

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
                boxShadow: `0 0 ${l.size}px oklch(0.78 0.2 ${l.hue} / 0.75)`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Fireworks bursts */}
      <div className="absolute inset-0 pointer-events-none">
        {fireworks.map((f) => (
          <div key={f.id} className="absolute" style={{ left: `${f.x}%`, top: `${f.y}%` }}>
            <div
              className="rounded-full"
              style={{
                width: f.size,
                height: f.size,
                marginLeft: -f.size / 2,
                marginTop: -f.size / 2,
                background: `radial-gradient(circle, oklch(0.96 0.2 ${f.hue}) 0%, oklch(0.78 0.22 ${f.hue} / 0.6) 25%, transparent 70%)`,
                animation: "firework-burst 2s ease-out infinite",
                animationDelay: `${f.delay}s`,
              }}
            />
            {/* radial spark rays */}
            {Array.from({ length: 10 }).map((_, k) => {
              const angle = (k / 10) * Math.PI * 2;
              return (
                <span
                  key={k}
                  className="absolute left-0 top-0 h-[2px] origin-left rounded-full"
                  style={{
                    width: f.size * 0.5,
                    background: `linear-gradient(90deg, oklch(0.96 0.2 ${f.hue}), transparent)`,
                    transform: `rotate(${(angle * 180) / Math.PI}deg)`,
                    animation: "firework-rays 2s ease-out infinite",
                    animationDelay: `${f.delay}s`,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Foreground diyas all lit */}
      {diyas.map((d) => (
        <Diya key={d.id} pos={{ x: d.x, y: d.y }} lit size={d.size} />
      ))}

      {/* Dancing villagers — simple silhouettes */}
      <div className="absolute inset-0 pointer-events-none">
        {villagers.map((v) => (
          <div
            key={v.id}
            className="absolute"
            style={{
              left: `${v.x}%`,
              bottom: `${v.bottom}%`,
              animation: "villager-dance 1s ease-in-out infinite",
              animationDelay: `${v.delay}s`,
              transformOrigin: "50% 100%",
            }}
          >
            <svg width="38" height="80" viewBox="0 0 38 80">
              <circle cx="19" cy="10" r="7" fill="#2a1a35" />
              <path d="M 6 70 L 12 30 Q 19 22 26 30 L 32 70 Z" fill={v.color} />
              <path d="M 12 32 L 4 12" stroke="#2a1a35" strokeWidth="3" strokeLinecap="round" />
              <path d="M 26 32 L 34 12" stroke="#2a1a35" strokeWidth="3" strokeLinecap="round" />
              <path d="M 14 70 L 13 80" stroke="#2a1a35" strokeWidth="3" strokeLinecap="round" />
              <path d="M 24 70 L 25 80" stroke="#2a1a35" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        ))}

      </div>

      {/* Hero elephant */}
      <div
        className="absolute left-1/2 bottom-[16%] -translate-x-1/2 pointer-events-none"
        style={{ animation: "slide-up-fade 1.4s ease-out 0.3s both" }}
      >
        <Elephant size={380} celebrating />
      </div>

      {/* Title card */}
      <div
        className="absolute inset-x-0 top-10 text-center px-6 z-20"
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
        <p className="mt-3 text-white/85 md:text-lg">The whole village is dancing because of you.</p>
      </div>

      {showButton && (
        <button
          type="button"
          onClick={onReplay}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 rounded-full bg-white/15 px-7 py-3 font-display text-base text-white backdrop-blur-md ring-1 ring-white/30 transition hover:bg-white/25 z-20"
          style={{ animation: "slide-up-fade 0.6s ease-out both" }}
        >
          <RotateCcw className="h-4 w-4" />
          Play Again
        </button>
      )}
    </div>
  );
}

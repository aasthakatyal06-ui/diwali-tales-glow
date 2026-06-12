import { useEffect, useState } from "react";
import { Elephant } from "./Elephant";
import { VillageBackdrop } from "./VillageBackdrop";
import { StarField } from "./Particles";
import { sfx, startMusic } from "@/game/audio";

interface IntroSceneProps {
  onFinish: () => void;
}

const LINES = [
  "The night Diwali died…",
  "every light went out.",
  "“Please… help me bring it back.”",
];

/**
 * Emotional storybook intro (~8s). Pitch-black village, very sad elephant,
 * big handwritten dialogue lines. The player can skip.
 */
export function IntroScene({ onFinish }: IntroSceneProps) {
  const [line, setLine] = useState(0);

  useEffect(() => {
    startMusic(0.4);
    sfx.shimmer();
    const timers: number[] = [];
    LINES.forEach((_, i) => {
      timers.push(window.setTimeout(() => setLine(i + 1), 900 + i * 2200));
    });
    timers.push(window.setTimeout(() => onFinish(), 900 + LINES.length * 2200 + 400));
    return () => timers.forEach(clearTimeout);
  }, [onFinish]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      {/* Pitch-dark village */}
      <div className="absolute inset-0" style={{ animation: "camera-push 16s ease-out forwards" }}>
        <VillageBackdrop brightness={0} />
        <StarField count={140} />
      </div>

      {/* Elephant — sad, sitting at center bottom */}
      <div
        className="absolute bottom-[8%] left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ animation: "slide-up-fade 1.6s ease-out both" }}
      >
        <Elephant size={340} sad />
      </div>

      {/* Big storybook dialogue */}
      {line > 0 && (
        <div
          key={line}
          className="absolute left-1/2 top-[14%] -translate-x-1/2 max-w-[88%] text-center px-4"
          style={{ animation: "slide-up-fade 0.8s ease-out both" }}
        >
          <p
            className="font-hand text-3xl md:text-5xl lg:text-6xl text-white leading-snug"
            style={{
              textShadow:
                "0 2px 16px oklch(0.05 0 0 / 0.95), 0 0 30px oklch(0.78 0.18 60 / 0.4)",
            }}
          >
            {LINES[line - 1]}
          </p>
        </div>
      )}

      {/* Skip button */}
      <button
        type="button"
        onClick={onFinish}
        className="absolute top-5 right-5 z-50 rounded-full bg-white/15 px-5 py-2 font-display text-base text-white backdrop-blur-md ring-1 ring-white/25 hover:bg-white/25 transition"
      >
        Skip →
      </button>

      {/* Fade in from black */}
      <div
        className="absolute inset-0 pointer-events-none bg-black"
        style={{ animation: "fade-from-black 1.6s ease-out both" }}
      />
    </div>
  );
}

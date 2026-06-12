import { memo } from "react";
import type { Point } from "@/game/types";

interface DiyaProps {
  pos: Point;
  lit: boolean;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: { base: 56, glow: 140 },
  md: { base: 76, glow: 200 },
  lg: { base: 100, glow: 280 },
};

/**
 * A traditional clay diya: wide oil pool, decorative rim, ghee-soaked
 * cotton wick, and a flickering teardrop flame when lit.
 */
function DiyaBase({ pos, lit, size = "md" }: DiyaProps) {
  const s = SIZES[size];
  const uid = `${pos.x}-${pos.y}`;
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
    >
      {/* Warm halo */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-opacity duration-700"
        style={{
          width: s.glow,
          height: s.glow,
          background:
            "radial-gradient(circle, oklch(0.94 0.16 80 / 0.7) 0%, oklch(0.82 0.2 50 / 0.35) 35%, transparent 70%)",
          opacity: lit ? 1 : 0,
          filter: "blur(10px)",
          animation: lit ? "breathe 2.6s ease-in-out infinite" : undefined,
        }}
      />

      <svg
        width={s.base}
        height={s.base}
        viewBox="0 0 100 100"
        className="relative"
        style={{
          filter: lit
            ? "drop-shadow(0 0 24px oklch(0.9 0.18 70 / 0.95))"
            : "drop-shadow(0 6px 10px oklch(0.05 0 0 / 0.7))",
        }}
      >
        <defs>
          <linearGradient id={`clay-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e08b4a" />
            <stop offset="55%" stopColor="#9a4a1e" />
            <stop offset="100%" stopColor="#46190a" />
          </linearGradient>
          <radialGradient id={`oil-${uid}`} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#ffd98a" />
            <stop offset="100%" stopColor="#a35a1e" />
          </radialGradient>
          <radialGradient id={`flame-${uid}`} cx="50%" cy="70%" r="60%">
            <stop offset="0%" stopColor="#fffce5" />
            <stop offset="35%" stopColor="oklch(0.94 0.18 90)" />
            <stop offset="75%" stopColor="oklch(0.78 0.22 50)" />
            <stop offset="100%" stopColor="oklch(0.6 0.22 30 / 0)" />
          </radialGradient>
        </defs>

        {/* shadow on ground */}
        <ellipse cx="50" cy="86" rx="34" ry="4" fill="#000" opacity="0.45" />

        {/* Outer clay bowl */}
        <path
          d="M 8 62 Q 12 84 50 84 Q 88 84 92 62 Q 86 78 50 78 Q 14 78 8 62 Z"
          fill={`url(#clay-${uid})`}
        />
        {/* Rim highlight */}
        <path
          d="M 10 62 Q 18 70 50 70 Q 82 70 90 62"
          stroke="#ffd6a3"
          strokeWidth="1.6"
          fill="none"
          opacity="0.75"
        />
        {/* Oil pool */}
        <ellipse cx="50" cy="60" rx="36" ry="8" fill={`url(#oil-${uid})`} />
        <ellipse cx="50" cy="58" rx="30" ry="4" fill="#fff3c2" opacity="0.5" />

        {/* Decorative dots around rim */}
        {[14, 30, 50, 70, 86].map((x) => (
          <circle key={x} cx={x} cy={72} r="1.6" fill="#ffd6a3" opacity="0.8" />
        ))}

        {/* Wick (cotton, ghee-soaked) */}
        <path d="M 50 60 Q 52 54 51 48" stroke="#f3e3b8" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Flame */}
        {lit && (
          <g style={{ transformOrigin: "50px 46px", animation: "flame-flicker 0.55s ease-in-out infinite" }}>
            <ellipse cx="50" cy="38" rx="11" ry="20" fill={`url(#flame-${uid})`} />
            <ellipse cx="50" cy="40" rx="7" ry="14" fill="oklch(0.95 0.18 88)" />
            <ellipse cx="50" cy="44" rx="3" ry="7" fill="#fffce8" />
            {/* tiny sparks */}
            <circle cx="58" cy="26" r="1.2" fill="#fff2a0" opacity="0.9" />
            <circle cx="42" cy="22" r="1" fill="#fff2a0" opacity="0.8" />
          </g>
        )}
      </svg>
    </div>
  );
}

export const Diya = memo(DiyaBase);

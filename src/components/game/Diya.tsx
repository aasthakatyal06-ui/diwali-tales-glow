import { memo } from "react";
import type { Point } from "@/game/types";

interface DiyaProps {
  pos: Point;
  lit: boolean;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: { base: 48, glow: 120 },
  md: { base: 64, glow: 170 },
  lg: { base: 84, glow: 240 },
};

function DiyaBase({ pos, lit, size = "md" }: DiyaProps) {
  const s = SIZES[size];
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
    >
      {/* Warm halo glow */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-opacity duration-700"
        style={{
          width: s.glow,
          height: s.glow,
          background:
            "radial-gradient(circle, oklch(0.92 0.16 75 / 0.6) 0%, oklch(0.86 0.18 50 / 0.3) 35%, transparent 70%)",
          opacity: lit ? 1 : 0,
          filter: "blur(8px)",
        }}
      />

      <svg
        width={s.base}
        height={s.base}
        viewBox="0 0 80 80"
        className="relative"
        style={{
          filter: lit
            ? "drop-shadow(0 0 20px oklch(0.86 0.18 70 / 0.9))"
            : "drop-shadow(0 4px 8px oklch(0.05 0 0 / 0.6))",
        }}
      >
        <defs>
          <radialGradient id={`bowl-${pos.x}-${pos.y}`} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#d97a3a" />
            <stop offset="100%" stopColor="#5a2410" />
          </radialGradient>
        </defs>
        {/* Clay bowl */}
        <path
          d="M 12 48 Q 40 72 68 48 L 64 56 Q 40 70 16 56 Z"
          fill={`url(#bowl-${pos.x}-${pos.y})`}
        />
        <ellipse cx="40" cy="48" rx="28" ry="6" fill="#3a1808" />

        {/* Wick */}
        <rect x="38" y="38" width="4" height="10" rx="1.5" fill="#2a1505" />

        {/* Flame */}
        {lit && (
          <g style={{ transformOrigin: "40px 38px", animation: "flame-flicker 0.6s ease-in-out infinite" }}>
            <ellipse cx="40" cy="28" rx="9" ry="16" fill="oklch(0.78 0.2 45)" />
            <ellipse cx="40" cy="30" rx="6" ry="12" fill="oklch(0.9 0.18 80)" />
            <ellipse cx="40" cy="32" rx="3" ry="7" fill="#fffce8" />
          </g>
        )}
      </svg>
    </div>
  );
}

export const Diya = memo(DiyaBase);

import { memo } from "react";
import type { Point } from "@/game/types";

interface MirrorProps {
  pos: Point;
  rotation: number;
  aligned: boolean;
  hint?: boolean;
  onTap: () => void;
}

function MirrorBase({ pos, rotation, aligned, hint, onTap }: MirrorProps) {
  return (
    <button
      type="button"
      onClick={onTap}
      className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none"
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      aria-label="Tap to rotate mirror"
    >
      {/* Pulsing hint ring on the very first mirror children should tap */}
      {hint && !aligned && (
        <span
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 140,
            height: 140,
            background: "radial-gradient(circle, oklch(0.92 0.16 85 / 0.5), transparent 65%)",
            animation: "breathe 1.4s ease-in-out infinite",
          }}
        />
      )}

      <div
        className="relative transition-transform duration-500 ease-out group-hover:scale-110"
        style={{
          width: 88,
          height: 88,
          transform: `rotate(${rotation}deg)`,
          filter: aligned
            ? "drop-shadow(0 0 24px oklch(0.92 0.16 85 / 0.9))"
            : "drop-shadow(0 6px 14px oklch(0.05 0 0 / 0.6))",
        }}
      >
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <defs>
            <radialGradient id="mirrorFace" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#fff8e8" />
              <stop offset="50%" stopColor="#ffe4a3" />
              <stop offset="100%" stopColor="#c98a3a" />
            </radialGradient>
            <linearGradient id="mirrorFrame" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffd86b" />
              <stop offset="50%" stopColor="#c98a1a" />
              <stop offset="100%" stopColor="#8b5a0e" />
            </linearGradient>
          </defs>
          {/* Decorative gold frame */}
          <ellipse cx="50" cy="50" rx="44" ry="44" fill="url(#mirrorFrame)" />
          {/* Inner bevel */}
          <ellipse cx="50" cy="50" rx="36" ry="36" fill="#5a3a08" />
          {/* Reflective face */}
          <ellipse cx="50" cy="50" rx="32" ry="32" fill="url(#mirrorFace)" />
          {/* Decorative jewels around frame */}
          {[0, 60, 120, 180, 240, 300].map((deg) => {
            const r = 40;
            const x = 50 + Math.cos((deg * Math.PI) / 180) * r;
            const y = 50 + Math.sin((deg * Math.PI) / 180) * r;
            return <circle key={deg} cx={x} cy={y} r="3" fill="#ff5a7a" stroke="#fff2cc" strokeWidth="0.8" />;
          })}
        </svg>

        {/* Shine sweep */}
        <span
          className="absolute inset-0 overflow-hidden rounded-full pointer-events-none"
          aria-hidden
        >
          <span
            className="absolute inset-y-2 -left-1/2 w-1/3 bg-white/40 blur-sm"
            style={{ animation: "mirror-shine 2.8s ease-in-out infinite" }}
          />
        </span>
      </div>
    </button>
  );
}

export const Mirror = memo(MirrorBase);

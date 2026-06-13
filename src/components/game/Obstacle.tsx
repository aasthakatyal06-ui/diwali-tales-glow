import { memo, useState } from "react";
import type { ObstacleConfig } from "@/game/types";

interface ObstacleProps {
  obstacle: ObstacleConfig;
  cleared?: boolean;
  onTap?: () => void;
}

/** Stones and pots sitting on the path. When `blocking` is set, the player
 *  must tap them to push them aside before the beam can pass through. */
function ObstacleBase({ obstacle, cleared, onTap }: ObstacleProps) {
  const { pos, kind, blocking } = obstacle;
  const interactive = !!blocking && !cleared;
  const [tapped, setTapped] = useState(false);

  const handleTap = () => {
    if (!interactive) return;
    setTapped(true);
    onTap?.();
  };

  return (
    <button
      type="button"
      disabled={!interactive}
      onClick={handleTap}
      className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        zIndex: 6,
        pointerEvents: interactive ? "auto" : "none",
        transform: `translate(-50%, -50%) ${cleared || tapped ? "translateY(60px) rotate(40deg) scale(0.6)" : ""}`,
        opacity: cleared || tapped ? 0 : 1,
        transition: "transform 0.7s cubic-bezier(.34,1.56,.64,1), opacity 0.7s",
        filter: interactive
          ? "drop-shadow(0 0 14px oklch(0.92 0.16 75 / 0.6))"
          : undefined,
        cursor: interactive ? "pointer" : "default",
      }}
      aria-label={interactive ? "Push aside" : undefined}
    >
      {interactive && (
        <span
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{
            width: 90,
            height: 90,
            background:
              "radial-gradient(circle, oklch(0.94 0.16 70 / 0.55), transparent 65%)",
            animation: "breathe 1.2s ease-in-out infinite",
          }}
        />
      )}

      {kind === "stone" ? (
        <svg width="62" height="46" viewBox="0 0 56 40">
          <ellipse cx="28" cy="36" rx="24" ry="3" fill="#000" opacity="0.45" />
          <path
            d="M 6 30 Q 4 14 18 8 Q 32 2 44 10 Q 54 18 50 30 Q 46 36 28 36 Q 10 36 6 30 Z"
            fill="#5a4a6b"
          />
          <path d="M 12 24 Q 22 14 36 16" stroke="#7a6a8c" strokeWidth="2" fill="none" opacity="0.7" />
          <circle cx="22" cy="20" r="2" fill="#8a7aa0" opacity="0.6" />
        </svg>
      ) : (
        <svg width="52" height="64" viewBox="0 0 48 58">
          <ellipse cx="24" cy="54" rx="20" ry="3" fill="#000" opacity="0.45" />
          <path
            d="M 8 22 Q 4 40 12 52 Q 24 58 36 52 Q 44 40 40 22 Q 36 18 24 18 Q 12 18 8 22 Z"
            fill="#a05a2c"
          />
          <ellipse cx="24" cy="20" rx="16" ry="5" fill="#7a3f1c" />
          <ellipse cx="24" cy="19" rx="14" ry="3.5" fill="#3a1a08" />
          <path d="M 14 28 Q 12 40 18 50" stroke="#c47a48" strokeWidth="2" fill="none" opacity="0.7" />
          <circle cx="14" cy="36" r="2.5" fill="#ffb84d" />
          <circle cx="22" cy="38" r="2.5" fill="#ff7a4d" />
          <circle cx="30" cy="36" r="2.5" fill="#ffb84d" />
          <circle cx="36" cy="34" r="2.2" fill="#c24a1a" />
        </svg>
      )}
    </button>
  );
}

export const Obstacle = memo(ObstacleBase);

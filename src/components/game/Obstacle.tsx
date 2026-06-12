import { memo } from "react";
import type { ObstacleConfig } from "@/game/types";

interface ObstacleProps {
  obstacle: ObstacleConfig;
}

/** Decorative-only obstacles (stones/pots). They sit on the path to make
 *  later levels feel busier, but don't gate the puzzle logic. */
function ObstacleBase({ obstacle }: ObstacleProps) {
  const { pos, kind } = obstacle;
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{ left: `${pos.x}%`, top: `${pos.y}%`, zIndex: 5 }}
    >
      {kind === "stone" ? (
        <svg width="56" height="40" viewBox="0 0 56 40">
          <ellipse cx="28" cy="36" rx="24" ry="3" fill="#000" opacity="0.45" />
          <path
            d="M 6 30 Q 4 14 18 8 Q 32 2 44 10 Q 54 18 50 30 Q 46 36 28 36 Q 10 36 6 30 Z"
            fill="#5a4a6b"
          />
          <path
            d="M 12 24 Q 22 14 36 16"
            stroke="#7a6a8c"
            strokeWidth="2"
            fill="none"
            opacity="0.7"
          />
          <circle cx="22" cy="20" r="2" fill="#8a7aa0" opacity="0.6" />
        </svg>
      ) : (
        <svg width="48" height="58" viewBox="0 0 48 58">
          <ellipse cx="24" cy="54" rx="20" ry="3" fill="#000" opacity="0.45" />
          {/* clay pot */}
          <path
            d="M 8 22 Q 4 40 12 52 Q 24 58 36 52 Q 44 40 40 22 Q 36 18 24 18 Q 12 18 8 22 Z"
            fill="#a05a2c"
          />
          {/* rim */}
          <ellipse cx="24" cy="20" rx="16" ry="5" fill="#7a3f1c" />
          <ellipse cx="24" cy="19" rx="14" ry="3.5" fill="#3a1a08" />
          {/* highlight */}
          <path d="M 14 28 Q 12 40 18 50" stroke="#c47a48" strokeWidth="2" fill="none" opacity="0.7" />
          {/* marigold band */}
          <circle cx="14" cy="36" r="2.5" fill="#ffb84d" />
          <circle cx="22" cy="38" r="2.5" fill="#ff7a4d" />
          <circle cx="30" cy="36" r="2.5" fill="#ffb84d" />
          <circle cx="36" cy="34" r="2.2" fill="#ff5a7a" />
        </svg>
      )}
    </div>
  );
}

export const Obstacle = memo(ObstacleBase);

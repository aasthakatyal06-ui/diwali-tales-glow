import { memo, useState } from "react";
import type { Point } from "@/game/types";

interface MirrorProps {
  pos: Point;
  rotation: number; // target rotation in degrees
  aligned: boolean;
  hint?: boolean;
  onTap: () => void;
}

/**
 * Hand mirror — clearly recognizable: round reflective glass face,
 * gold filigree frame, wooden handle, sky-and-cloud reflection.
 * EVERY tap visually spins the mirror a full turn.
 */
function MirrorBase({ pos, rotation, aligned, hint, onTap }: MirrorProps) {
  // Accumulates rotation so every click adds 360° on top of target rotation.
  const [extraSpins, setExtraSpins] = useState(0);

  const visualRotation = rotation + extraSpins * 360;

  const handleTap = () => {
    setExtraSpins((n) => n + 1);
    onTap();
  };

  return (
    <button
      type="button"
      onClick={handleTap}
      className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none"
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      aria-label="Tap mirror"
    >
      {/* Pulsing hint ring */}
      {hint && !aligned && (
        <span
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 180,
            height: 180,
            background:
              "radial-gradient(circle, oklch(0.94 0.16 85 / 0.65), transparent 65%)",
            animation: "breathe 1.3s ease-in-out infinite",
          }}
        />
      )}

      {/* Tap-me bubble */}
      {hint && !aligned && (
        <span
          className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#5e468f] shadow-lg"
          style={{ animation: "float-soft 1.6s ease-in-out infinite" }}
        >
          👆 Tap me!
        </span>
      )}

      <div
        className="relative"
        style={{
          width: 120,
          height: 160,
          transform: `rotate(${visualRotation}deg)`,
          transition: "transform 0.9s cubic-bezier(.34,1.56,.64,1), filter 0.5s",
          filter: aligned
            ? "drop-shadow(0 0 30px oklch(0.94 0.16 85 / 0.95))"
            : "drop-shadow(0 8px 14px oklch(0.05 0 0 / 0.6))",
        }}
      >
        <svg viewBox="0 0 120 160" className="h-full w-full">
          <defs>
            {/* sky reflection in the glass */}
            <linearGradient id="mGlass" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#cfe9ff" />
              <stop offset="55%" stopColor="#9bc6ee" />
              <stop offset="100%" stopColor="#5d7aa6" />
            </linearGradient>
            <linearGradient id="mFrame" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff0b0" />
              <stop offset="45%" stopColor="#e6b13a" />
              <stop offset="100%" stopColor="#7a4a0e" />
            </linearGradient>
            <linearGradient id="mHandle" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d49a3a" />
              <stop offset="100%" stopColor="#5a2a0a" />
            </linearGradient>
          </defs>

          {/* Handle */}
          <rect x="52" y="95" width="16" height="52" rx="8" fill="url(#mHandle)" />
          {/* handle wrap */}
          <rect x="50" y="105" width="20" height="4" fill="#7a4a0e" opacity="0.7" />
          <rect x="50" y="120" width="20" height="4" fill="#7a4a0e" opacity="0.7" />
          <rect x="50" y="135" width="20" height="4" fill="#7a4a0e" opacity="0.7" />
          {/* handle base + tassel */}
          <rect x="46" y="144" width="28" height="8" rx="3" fill="#e6b13a" />
          <circle cx="60" cy="156" r="4" fill="#ff5a7a" stroke="#fff2cc" strokeWidth="0.8" />

          {/* Outer gold frame (thick, ornate) */}
          <circle cx="60" cy="58" r="56" fill="url(#mFrame)" />
          {/* Inner dark bezel */}
          <circle cx="60" cy="58" r="46" fill="#3a2410" />
          {/* GLASS — clearly mirror-like */}
          <circle cx="60" cy="58" r="42" fill="url(#mGlass)" />
          {/* Cloud puff reflection */}
          <ellipse cx="48" cy="46" rx="18" ry="6" fill="#ffffff" opacity="0.75" />
          <ellipse cx="68" cy="52" rx="10" ry="4" fill="#ffffff" opacity="0.55" />
          {/* Big highlight crescent */}
          <path
            d="M 30 50 A 32 32 0 0 1 80 30"
            stroke="#ffffff"
            strokeWidth="6"
            fill="none"
            opacity="0.55"
            strokeLinecap="round"
          />
          {/* Small bottom shine */}
          <ellipse cx="78" cy="82" rx="6" ry="3" fill="#ffffff" opacity="0.45" />

          {/* Decorative jewels around frame */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const r = 51;
            const x = 60 + Math.cos((deg * Math.PI) / 180) * r;
            const y = 58 + Math.sin((deg * Math.PI) / 180) * r;
            const color = deg % 90 === 0 ? "#ff5a7a" : "#5cc6ff";
            return (
              <circle
                key={deg}
                cx={x}
                cy={y}
                r="3.2"
                fill={color}
                stroke="#fff2cc"
                strokeWidth="0.8"
              />
            );
          })}

          {/* Aligned: bright glow ring around glass */}
          {aligned && (
            <circle
              cx="60"
              cy="58"
              r="42"
              fill="none"
              stroke="oklch(0.95 0.18 85)"
              strokeWidth="3"
              opacity="0.9"
            />
          )}
        </svg>
      </div>
    </button>
  );
}

export const Mirror = memo(MirrorBase);

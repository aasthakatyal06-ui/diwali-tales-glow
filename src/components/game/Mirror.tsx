import { memo, useEffect, useState } from "react";
import type { Point } from "@/game/types";

interface MirrorProps {
  pos: Point;
  rotation: number; // target rotation in degrees
  aligned: boolean;
  hint?: boolean;
  onTap: () => void;
}

/**
 * Ornate hand mirror — gold filigree frame, jeweled rim, glassy face,
 * with a wooden handle. Spins smoothly into place when tapped.
 */
function MirrorBase({ pos, rotation, aligned, hint, onTap }: MirrorProps) {
  // Track spin so each interaction does a full visible rotation
  const [spin, setSpin] = useState(rotation);
  useEffect(() => {
    // When aligned changes, add an extra 360° so it visibly spins into place
    setSpin((prev) => {
      const target = aligned ? rotation + 360 : rotation;
      // ensure new value differs from prev so CSS transition fires
      return target === prev ? target + 0.01 : target;
    });
  }, [rotation, aligned]);

  return (
    <button
      type="button"
      onClick={onTap}
      className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none"
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      aria-label="Tap to align mirror"
    >
      {/* Pulsing hint ring on the first mirror */}
      {hint && !aligned && (
        <span
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 160,
            height: 160,
            background: "radial-gradient(circle, oklch(0.94 0.16 85 / 0.55), transparent 65%)",
            animation: "breathe 1.3s ease-in-out infinite",
          }}
        />
      )}

      <div
        className="relative"
        style={{
          width: 110,
          height: 150,
          transform: `rotate(${spin}deg)`,
          transition: "transform 1.1s cubic-bezier(.34,1.56,.64,1), filter 0.5s",
          filter: aligned
            ? "drop-shadow(0 0 28px oklch(0.94 0.16 85 / 0.95))"
            : "drop-shadow(0 8px 14px oklch(0.05 0 0 / 0.6))",
        }}
      >
        <svg viewBox="0 0 110 150" className="h-full w-full">
          <defs>
            <radialGradient id="mFace" cx="40%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#cfe7ff" />
              <stop offset="100%" stopColor="#5b6a8a" />
            </radialGradient>
            <linearGradient id="mFrame" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffe9a0" />
              <stop offset="50%" stopColor="#d49a2a" />
              <stop offset="100%" stopColor="#7a4a0e" />
            </linearGradient>
            <linearGradient id="mHandle" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c98a3a" />
              <stop offset="100%" stopColor="#5a2a0a" />
            </linearGradient>
          </defs>

          {/* Handle */}
          <rect x="48" y="92" width="14" height="50" rx="6" fill="url(#mHandle)" />
          <rect x="44" y="138" width="22" height="8" rx="3" fill="#d49a2a" />
          <circle cx="55" cy="146" r="3" fill="#ff5a7a" stroke="#fff2cc" strokeWidth="0.8" />

          {/* Ornate gold frame */}
          <ellipse cx="55" cy="55" rx="50" ry="50" fill="url(#mFrame)" />
          {/* inner bevel */}
          <ellipse cx="55" cy="55" rx="42" ry="42" fill="#3a2410" />
          {/* glassy reflective face */}
          <ellipse cx="55" cy="55" rx="38" ry="38" fill="url(#mFace)" />
          {/* highlight */}
          <ellipse cx="40" cy="38" rx="14" ry="8" fill="#ffffff" opacity="0.6" />
          <ellipse cx="70" cy="78" rx="6" ry="3" fill="#ffffff" opacity="0.4" />

          {/* Decorative jewels around frame */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const r = 46;
            const x = 55 + Math.cos((deg * Math.PI) / 180) * r;
            const y = 55 + Math.sin((deg * Math.PI) / 180) * r;
            const color = deg % 90 === 0 ? "#ff5a7a" : "#5cc6ff";
            return <circle key={deg} cx={x} cy={y} r="3" fill={color} stroke="#fff2cc" strokeWidth="0.8" />;
          })}
          {/* filigree scrolls */}
          <path
            d="M 55 8 Q 75 18 85 35 M 55 102 Q 35 92 25 75"
            stroke="#fff2cc"
            strokeWidth="1"
            fill="none"
            opacity="0.55"
          />
        </svg>

        {/* Shine sweep across face */}
        <span className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
          <span
            className="absolute top-2 -left-1/2 w-1/2 h-[60%] bg-white/40 blur-sm"
            style={{ animation: "mirror-shine 2.8s ease-in-out infinite", borderRadius: "50%" }}
          />
        </span>
      </div>
    </button>
  );
}

export const Mirror = memo(MirrorBase);

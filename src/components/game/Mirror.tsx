import { memo, useRef, useState } from "react";
import type { Point } from "@/game/types";

interface MirrorProps {
  pos: Point;
  rotation: number;
  aligned: boolean;
  hint?: boolean;
  requiredTaps?: number;
  tapsTaken?: number;
  spinning?: boolean;
  splitter?: boolean;
  hideHint?: boolean;
  size?: number;
  onTap: (success?: boolean) => void;
}


const SPIN_MS = 2600;
const ALIGN_TOLERANCE_DEG = 22; // forgiving window for kids

function MirrorBase({
  pos,
  rotation,
  aligned,
  hint,
  requiredTaps = 1,
  tapsTaken = 0,
  spinning = false,
  hideHint = false,
  size = 120,
  onTap,
}: MirrorProps) {
  const [extraSpins, setExtraSpins] = useState(0);
  const mountRef = useRef(Date.now());
  const partial = aligned ? 0 : (tapsTaken / Math.max(requiredTaps, 1)) * 90;
  const w = size;
  const h = size * 1.33;

  const handleTap = () => {
    if (aligned) return;
    if (spinning) {
      const phase = ((Date.now() - mountRef.current) % SPIN_MS) / SPIN_MS;
      const curRot = phase * 360;
      const dist = Math.min(curRot, 360 - curRot);
      const success = dist < ALIGN_TOLERANCE_DEG;
      onTap(success);
      if (!success) setExtraSpins((n) => n + 1);
      return;
    }
    setExtraSpins((n) => n + 1);
    onTap(true);
  };

  const remaining = Math.max(0, requiredTaps - tapsTaken);
  const showTapsBadge = !hideHint && requiredTaps > 1 && !aligned && !spinning;

  // Visual rotation logic
  const visualRotation =
    spinning && !aligned
      ? null // CSS animation drives rotation when spinning
      : rotation + extraSpins * 180 + partial;

  return (
    <button
      type="button"
      onClick={handleTap}
      className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none z-20"
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      aria-label="Tap mirror"
    >
      {hint && !aligned && (
        <span
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 240,
            height: 240,
            background:
              "radial-gradient(circle, oklch(0.94 0.16 70 / 0.8), transparent 65%)",
            animation: "breathe 1.3s ease-in-out infinite",
          }}
        />
      )}

      {hint && !aligned && (
        <span
          className="font-hand absolute -top-20 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-2xl px-7 py-3 text-4xl font-bold text-[#5a2a0a] shadow-2xl ring-4 ring-[oklch(0.86_0.18_75)]"
          style={{
            background: "linear-gradient(180deg,#fff5d6,#ffd994)",
            animation: "float-soft 1.6s ease-in-out infinite",
          }}
        >
          👉 Tap me!
        </span>
      )}

      {showTapsBadge && (
        <span
          className="font-hand absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-base font-bold text-[#5a2a0a] shadow-md pointer-events-none"
          style={{ background: "linear-gradient(180deg,#fff5d6,#ffd994)" }}
        >
          {remaining} more tap{remaining === 1 ? "" : "s"}
        </span>
      )}

      <div
        className="relative"
        style={{
          width: w,
          height: h,
          transform: visualRotation !== null ? `rotate(${visualRotation}deg)` : undefined,
          animation: visualRotation === null ? `spin-cw ${SPIN_MS}ms linear infinite` : undefined,
          transition: "transform 0.9s cubic-bezier(.34,1.56,.64,1), filter 0.5s",
          filter: aligned
            ? "drop-shadow(0 0 38px oklch(0.96 0.18 75 / 1)) drop-shadow(0 0 14px oklch(0.98 0.14 85 / 0.9))"
            : "drop-shadow(0 8px 14px oklch(0.05 0 0 / 0.6)) drop-shadow(0 0 10px oklch(0.92 0.1 80 / 0.4))",
        }}
      >
        <svg viewBox="0 0 120 160" className="h-full w-full">
          <defs>
            {/* Silvery (idle) glass */}
            <radialGradient id="mGlassIdle" cx="38%" cy="30%" r="80%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#e8eef5" />
              <stop offset="60%" stopColor="#9aa6b6" />
              <stop offset="100%" stopColor="#3a4250" />
            </radialGradient>
            {/* Golden (aligned) glass */}
            <radialGradient id="mGlassGold" cx="38%" cy="30%" r="80%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="22%" stopColor="#fff7e0" />
              <stop offset="55%" stopColor="#ffd49a" />
              <stop offset="100%" stopColor="#7a3a0e" />
            </radialGradient>
            <linearGradient id="mSheen" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="45%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="55%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="mFrameGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff0b0" />
              <stop offset="45%" stopColor="#e6b13a" />
              <stop offset="100%" stopColor="#7a4a0e" />
            </linearGradient>
            <linearGradient id="mFrameSilver" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f0f3f7" />
              <stop offset="50%" stopColor="#a8b2c0" />
              <stop offset="100%" stopColor="#4a5260" />
            </linearGradient>

            <linearGradient id="mHandle" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d49a3a" />
              <stop offset="100%" stopColor="#5a2a0a" />
            </linearGradient>
            <clipPath id="mClip">
              <circle cx="60" cy="58" r="42" />
            </clipPath>
          </defs>

          <rect x="52" y="95" width="16" height="52" rx="8" fill="url(#mHandle)" />
          <rect x="50" y="105" width="20" height="3" fill="#7a4a0e" opacity="0.7" />
          <rect x="50" y="120" width="20" height="3" fill="#7a4a0e" opacity="0.7" />
          <rect x="50" y="135" width="20" height="3" fill="#7a4a0e" opacity="0.7" />
          <rect x="46" y="144" width="28" height="8" rx="3" fill="#e6b13a" />
          <circle cx="60" cy="156" r="4" fill="#c24a1a" stroke="#fff2cc" strokeWidth="0.8" />

          {/* Outer gold frame */}
          <circle cx="60" cy="58" r="56" fill={aligned ? "url(#mFrameGold)" : "url(#mFrameSilver)"} />
          <circle cx="60" cy="58" r="46" fill="#7a3a14" />

          {/* Reflective glass */}
          <circle cx="60" cy="58" r="42" fill={aligned ? "url(#mGlassGold)" : "url(#mGlassIdle)"} />

          {/* Sky reflection arc — gives "mirror reflecting the world" feel */}
          <g clipPath="url(#mClip)">
            <rect x="18" y="20" width="84" height="32" fill="#ffe9b0" opacity="0.45" />
            <ellipse cx="44" cy="34" rx="12" ry="4" fill="#ffffff" opacity="0.75" />
            <ellipse cx="76" cy="42" rx="8" ry="3" fill="#ffffff" opacity="0.55" />
            {/* moving sheen streak */}
            <rect
              x="-30"
              y="20"
              width="40"
              height="76"
              fill="url(#mSheen)"
              opacity="0.7"
              style={{ animation: "mirror-shine 3.2s ease-in-out infinite" }}
            />
          </g>

          {/* Crisp white rim highlight */}
          <circle
            cx="60"
            cy="58"
            r="41"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.5"
            opacity="0.6"
          />
          <path
            d="M 28 50 A 32 32 0 0 1 80 28"
            stroke="#ffffff"
            strokeWidth="5"
            fill="none"
            opacity="0.75"
            strokeLinecap="round"
          />
          <ellipse cx="48" cy="46" rx="14" ry="5" fill="#ffffff" opacity="0.7" />
          <ellipse cx="78" cy="80" rx="6" ry="3" fill="#ffffff" opacity="0.5" />

          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const r = 51;
            const x = 60 + Math.cos((deg * Math.PI) / 180) * r;
            const y = 58 + Math.sin((deg * Math.PI) / 180) * r;
            const color = deg % 90 === 0 ? "#c24a1a" : "#ffd24d";
            return (
              <circle key={deg} cx={x} cy={y} r="3" fill={color} stroke="#fff2cc" strokeWidth="0.6" />
            );
          })}

          {aligned && (
            <circle
              cx="60"
              cy="58"
              r="42"
              fill="none"
              stroke="oklch(0.98 0.18 85)"
              strokeWidth="3"
              opacity="0.95"
            />
          )}
        </svg>
      </div>
    </button>
  );
}

export const Mirror = memo(MirrorBase);

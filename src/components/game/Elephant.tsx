import { memo } from "react";

interface ElephantProps {
  pointing?: boolean;
  celebrating?: boolean;
  dancing?: boolean;
  size?: number;
}

/**
 * Cute mascot elephant — chunky body, four legs, big head, huge eyes.
 * Pure SVG so it scales crisply and animates entirely with CSS.
 */
function ElephantBase({ pointing = false, celebrating = false, dancing = false, size = 320 }: ElephantProps) {
  const anim = celebrating
    ? "happy-bounce 1.1s ease-in-out infinite"
    : dancing
      ? "elephant-dance 1.6s ease-in-out infinite"
      : "float-soft 4s ease-in-out infinite";

  return (
    <div
      className="relative select-none pointer-events-none"
      style={{
        height: size,
        width: size * 1.15,
        animation: anim,
        filter: "drop-shadow(0 30px 36px oklch(0.08 0.05 270 / 0.6))",
      }}
    >
      <svg viewBox="0 0 220 220" className="absolute inset-0 h-full w-full">
        <defs>
          <radialGradient id="elBody" cx="50%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#dcc1ff" />
            <stop offset="55%" stopColor="#a48bd9" />
            <stop offset="100%" stopColor="#5e468f" />
          </radialGradient>
          <radialGradient id="elBelly" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#f0d8ff" />
            <stop offset="100%" stopColor="#a48bd9 " stopOpacity="0" />
          </radialGradient>
          <radialGradient id="elEar" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#f6c8b6" />
            <stop offset="100%" stopColor="#b86859" />
          </radialGradient>
          <radialGradient id="cheek" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff9cb8" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ff9cb8" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="eye" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#1a1830" />
            <stop offset="100%" stopColor="#000010" />
          </radialGradient>
        </defs>

        {/* === Body — chunky, oval === */}
        <ellipse cx="110" cy="150" rx="78" ry="44" fill="url(#elBody)" />
        <ellipse cx="110" cy="160" rx="60" ry="26" fill="url(#elBelly)" opacity="0.7" />

        {/* === Four legs === */}
        {[
          { x: 56, h: 32 },
          { x: 86, h: 30 },
          { x: 130, h: 30 },
          { x: 162, h: 32 },
        ].map((l, i) => (
          <g key={i}>
            <rect x={l.x} y={180} width={18} height={l.h} rx={8} fill="#6f57a8" />
            <ellipse cx={l.x + 9} cy={180 + l.h} rx={11} ry={4} fill="#3e2a66" />
            {/* toenails */}
            <circle cx={l.x + 4} cy={180 + l.h - 1} r="1.6" fill="#fff2e0" />
            <circle cx={l.x + 9} cy={180 + l.h - 1} r="1.6" fill="#fff2e0" />
            <circle cx={l.x + 14} cy={180 + l.h - 1} r="1.6" fill="#fff2e0" />
          </g>
        ))}

        {/* Tail */}
        <path d="M 188 145 Q 205 150 200 168" stroke="#6f57a8" strokeWidth="6" fill="none" strokeLinecap="round" />
        <circle cx="200" cy="170" r="5" fill="#3e2a66" />

        {/* === Ears (oversized, wiggling) === */}
        <g style={{ transformOrigin: "60px 95px", animation: "ear-wiggle 3.5s ease-in-out infinite" }}>
          <ellipse cx="44" cy="100" rx="34" ry="44" fill="url(#elEar)" />
          <ellipse cx="46" cy="102" rx="20" ry="30" fill="#ff9cb8" opacity="0.45" />
        </g>
        <g style={{ transformOrigin: "160px 95px", animation: "ear-wiggle 3.5s ease-in-out infinite reverse" }}>
          <ellipse cx="176" cy="100" rx="34" ry="44" fill="url(#elEar)" />
          <ellipse cx="174" cy="102" rx="20" ry="30" fill="#ff9cb8" opacity="0.45" />
        </g>

        {/* === Big head === */}
        <ellipse cx="110" cy="100" rx="62" ry="62" fill="url(#elBody)" />

        {/* Diwali forehead jewel + tilak */}
        <circle cx="110" cy="58" r="5.5" fill="#ffd24d" stroke="#b86a1c" strokeWidth="1.5" />
        <path d="M 94 68 Q 110 76 126 68" stroke="#ffd24d" strokeWidth="2" fill="none" opacity="0.8" />
        <circle cx="86" cy="68" r="2" fill="#ffd24d" opacity="0.85" />
        <circle cx="134" cy="68" r="2" fill="#ffd24d" opacity="0.85" />

        {/* Cheeks */}
        <ellipse cx="76" cy="115" rx="14" ry="9" fill="url(#cheek)" />
        <ellipse cx="144" cy="115" rx="14" ry="9" fill="url(#cheek)" />

        {/* Eyes */}
        <g style={{ transformOrigin: "90px 100px", animation: "blink 4s ease-in-out infinite" }}>
          <ellipse cx="90" cy="100" rx="11" ry="13" fill="white" />
          <ellipse cx="91" cy="103" rx="8" ry="10" fill="url(#eye)" />
          <circle cx="93" cy="100" r="2.6" fill="white" />
          <circle cx="88" cy="106" r="1.2" fill="white" opacity="0.7" />
        </g>
        <g style={{ transformOrigin: "130px 100px", animation: "blink 4s ease-in-out infinite" }}>
          <ellipse cx="130" cy="100" rx="11" ry="13" fill="white" />
          <ellipse cx="131" cy="103" rx="8" ry="10" fill="url(#eye)" />
          <circle cx="133" cy="100" r="2.6" fill="white" />
          <circle cx="128" cy="106" r="1.2" fill="white" opacity="0.7" />
        </g>

        {/* Smile */}
        <path d="M 96 132 Q 110 142 124 132" stroke="#3a2548" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* Trunk — curved, sways gently */}
        <g style={{ transformOrigin: "110px 130px", animation: "trunk-sway 3s ease-in-out infinite" }}>
          <path
            d="M 110 130 Q 118 152 130 158 Q 142 162 142 150"
            stroke="#8e72c4"
            strokeWidth="15"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 112 135 Q 120 154 131 159"
            stroke="#c0a4ea"
            strokeWidth="3"
            fill="none"
            opacity="0.6"
            strokeLinecap="round"
          />
          {/* trunk rings */}
          <path d="M 116 142 Q 121 144 123 140" stroke="#5e468f" strokeWidth="1.2" fill="none" opacity="0.5" />
          <path d="M 122 150 Q 128 152 130 148" stroke="#5e468f" strokeWidth="1.2" fill="none" opacity="0.5" />
        </g>

        {/* Anklets on celebration */}
        {celebrating && (
          <>
            <circle cx="65" cy="208" r="3" fill="#ffd24d" />
            <circle cx="95" cy="208" r="3" fill="#ffd24d" />
            <circle cx="139" cy="208" r="3" fill="#ffd24d" />
            <circle cx="171" cy="208" r="3" fill="#ffd24d" />
          </>
        )}
      </svg>

      {pointing && (
        <div
          className="absolute -right-2 top-12 text-3xl"
          style={{ animation: "float-soft 1.2s ease-in-out infinite" }}
        >
          ✨
        </div>
      )}
    </div>
  );
}

export const Elephant = memo(ElephantBase);

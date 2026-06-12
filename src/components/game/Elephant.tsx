import { memo } from "react";

interface ElephantProps {
  pointing?: boolean;
  celebrating?: boolean;
  size?: number; // px height
}

/**
 * The emotional heart of the game. Pure SVG so it scales crisply and
 * animates with CSS — no rigging, no library. Proportions are mascot-y
 * on purpose: oversized head, huge eyes, tiny limbs.
 */
function ElephantBase({ pointing = false, celebrating = false, size = 320 }: ElephantProps) {
  return (
    <div
      className="relative select-none pointer-events-none"
      style={{
        height: size,
        width: size * 1.05,
        animation: celebrating
          ? "happy-bounce 1.2s ease-in-out infinite"
          : "float-soft 4s ease-in-out infinite",
        filter: "drop-shadow(0 30px 40px oklch(0.1 0.05 270 / 0.6))",
      }}
    >
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
        <defs>
          <radialGradient id="elephantBody" cx="50%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#d6b9ff" />
            <stop offset="60%" stopColor="#a48bd9" />
            <stop offset="100%" stopColor="#6f57a8" />
          </radialGradient>
          <radialGradient id="elephantEar" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#f4c7b4" />
            <stop offset="100%" stopColor="#c97a6a" />
          </radialGradient>
          <radialGradient id="cheekBlush" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff9cb8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ff9cb8" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="eyeShine" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#1a1830" />
            <stop offset="100%" stopColor="#000010" />
          </radialGradient>
        </defs>

        {/* Body (small, mostly hidden by huge head) */}
        <ellipse cx="100" cy="160" rx="55" ry="28" fill="url(#elephantBody)" />

        {/* Tiny legs */}
        <rect x="72" y="170" width="14" height="20" rx="7" fill="#6f57a8" />
        <rect x="114" y="170" width="14" height="20" rx="7" fill="#6f57a8" />

        {/* Ears (oversized, wiggling) */}
        <g style={{ transformOrigin: "55px 95px", animation: "ear-wiggle 3.5s ease-in-out infinite" }}>
          <ellipse cx="38" cy="100" rx="32" ry="42" fill="url(#elephantEar)" />
          <ellipse cx="40" cy="100" rx="20" ry="30" fill="#ff9cb8" opacity="0.45" />
        </g>
        <g style={{ transformOrigin: "145px 95px", animation: "ear-wiggle 3.5s ease-in-out infinite reverse" }}>
          <ellipse cx="162" cy="100" rx="32" ry="42" fill="url(#elephantEar)" />
          <ellipse cx="160" cy="100" rx="20" ry="30" fill="#ff9cb8" opacity="0.45" />
        </g>

        {/* Big head */}
        <ellipse cx="100" cy="100" rx="58" ry="60" fill="url(#elephantBody)" />

        {/* Diwali forehead jewel + paint */}
        <circle cx="100" cy="62" r="5" fill="#ffd24d" stroke="#b86a1c" strokeWidth="1.5" />
        <path d="M 86 70 Q 100 76 114 70" stroke="#ffd24d" strokeWidth="2" fill="none" opacity="0.8" />
        <circle cx="78" cy="70" r="2" fill="#ffd24d" opacity="0.85" />
        <circle cx="122" cy="70" r="2" fill="#ffd24d" opacity="0.85" />

        {/* Cheeks */}
        <ellipse cx="68" cy="115" rx="14" ry="9" fill="url(#cheekBlush)" />
        <ellipse cx="132" cy="115" rx="14" ry="9" fill="url(#cheekBlush)" />

        {/* Eyes — huge and shiny */}
        <g style={{ transformOrigin: "82px 100px", animation: "blink 4s ease-in-out infinite" }}>
          <ellipse cx="82" cy="100" rx="11" ry="13" fill="white" />
          <ellipse cx="83" cy="103" rx="8" ry="10" fill="url(#eyeShine)" />
          <circle cx="85" cy="100" r="2.6" fill="white" />
          <circle cx="80" cy="106" r="1.2" fill="white" opacity="0.7" />
        </g>
        <g style={{ transformOrigin: "118px 100px", animation: "blink 4s ease-in-out infinite" }}>
          <ellipse cx="118" cy="100" rx="11" ry="13" fill="white" />
          <ellipse cx="119" cy="103" rx="8" ry="10" fill="url(#eyeShine)" />
          <circle cx="121" cy="100" r="2.6" fill="white" />
          <circle cx="116" cy="106" r="1.2" fill="white" opacity="0.7" />
        </g>

        {/* Smile */}
        <path
          d="M 86 132 Q 100 142 114 132"
          stroke="#3a2548"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Trunk — curved and visible, sways gently */}
        <g style={{ transformOrigin: "100px 130px", animation: "trunk-sway 3s ease-in-out infinite" }}>
          <path
            d="M 100 130 Q 108 150 118 155 Q 128 158 128 148"
            stroke="#8e72c4"
            strokeWidth="14"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 102 135 Q 110 152 119 156"
            stroke="#c0a4ea"
            strokeWidth="3"
            fill="none"
            opacity="0.6"
            strokeLinecap="round"
          />
        </g>
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

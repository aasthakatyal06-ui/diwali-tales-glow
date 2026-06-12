import { memo } from "react";

interface VillageBackdropProps {
  brightness: number; // 0..1
}

/**
 * Layered SVG village — moon, distant mountains, temple silhouette, houses,
 * trees. Window/temple glow swells with `brightness` to sell the
 * "village waking up" feeling.
 */
function VillageBackdropBase({ brightness }: VillageBackdropProps) {
  const windowOpacity = 0.15 + brightness * 0.85;
  const skyTint = brightness; // shift sky from deep night → warm dusk-festival

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Deep sky gradient — gets warmer as brightness rises */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg,
            oklch(${0.12 + skyTint * 0.05} ${0.08 - skyTint * 0.03} ${275 - skyTint * 10}) 0%,
            oklch(${0.18 + skyTint * 0.08} ${0.09 - skyTint * 0.02} ${280 - skyTint * 30}) 45%,
            oklch(${0.25 + skyTint * 0.1} ${0.1} ${300 - skyTint * 50}) 75%,
            oklch(${0.32 + skyTint * 0.08} 0.09 ${330 - skyTint * 30}) 100%)`,
        }}
      />

      {/* Soft ambient bloom near the horizon */}
      <div
        className="absolute inset-x-0 bottom-0 h-[55%]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, oklch(0.7 0.18 45 / 0.35) 0%, transparent 70%)",
          opacity: 0.4 + brightness * 0.6,
        }}
      />

      {/* Moon */}
      <div
        className="absolute"
        style={{
          right: "10%",
          top: "12%",
          width: 110,
          height: 110,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 35%, oklch(0.98 0.04 90) 0%, oklch(0.86 0.06 80) 60%, oklch(0.6 0.04 80 / 0) 100%)",
          boxShadow: "0 0 80px oklch(0.96 0.05 90 / 0.4)",
        }}
      />

      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="mountains" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.22 0.08 280)" />
            <stop offset="100%" stopColor="oklch(0.16 0.07 275)" />
          </linearGradient>
          <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={`oklch(${0.28 + brightness * 0.1} 0.08 ${30 - brightness * 5})`} />
            <stop offset="100%" stopColor={`oklch(${0.12 + brightness * 0.05} 0.05 ${20})`} />
          </linearGradient>
          <linearGradient id="houseWall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={`oklch(${0.35 + brightness * 0.18} 0.08 ${40 - brightness * 5})`} />
            <stop offset="100%" stopColor={`oklch(${0.2 + brightness * 0.1} 0.06 ${30})`} />
          </linearGradient>
        </defs>

        {/* Distant mountains */}
        <path
          d="M 0 620 L 180 480 L 320 560 L 480 430 L 640 540 L 820 460 L 980 530 L 1180 470 L 1360 540 L 1600 490 L 1600 700 L 0 700 Z"
          fill="url(#mountains)"
          opacity="0.85"
        />

        {/* Temple silhouette — center back */}
        <g transform="translate(720 470)" opacity="0.95">
          <rect x="0" y="80" width="160" height="120" fill="url(#houseWall)" />
          <polygon points="0,80 80,10 160,80" fill={`oklch(${0.32 + brightness * 0.18} 0.12 35)`} />
          <polygon points="40,40 80,-30 120,40" fill={`oklch(${0.4 + brightness * 0.2} 0.14 35)`} />
          <circle cx="80" cy="-40" r="6" fill="oklch(0.92 0.16 80)" opacity={windowOpacity} />
          {/* Temple door glow */}
          <rect x="65" y="140" width="30" height="60" rx="15" fill="oklch(0.86 0.18 60)" opacity={windowOpacity} />
        </g>

        {/* Row of village houses */}
        {[
          { x: 80, w: 180, h: 200, roof: 60 },
          { x: 290, w: 150, h: 170, roof: 50 },
          { x: 470, w: 200, h: 220, roof: 70 },
          { x: 920, w: 170, h: 190, roof: 55 },
          { x: 1110, w: 200, h: 230, roof: 70 },
          { x: 1340, w: 180, h: 200, roof: 60 },
        ].map((h, i) => (
          <g key={i} transform={`translate(${h.x} ${670 - h.h})`}>
            <rect width={h.w} height={h.h} fill="url(#houseWall)" />
            <polygon
              points={`0,0 ${h.w / 2},${-h.roof} ${h.w},0`}
              fill={`oklch(${0.35 + brightness * 0.15} 0.13 30)`}
            />
            {/* Windows with warm glow */}
            <rect
              x={h.w * 0.15}
              y={h.h * 0.3}
              width={h.w * 0.2}
              height={h.h * 0.25}
              rx="4"
              fill="oklch(0.86 0.18 60)"
              opacity={windowOpacity * (0.6 + (i % 3) * 0.15)}
            />
            <rect
              x={h.w * 0.6}
              y={h.h * 0.3}
              width={h.w * 0.2}
              height={h.h * 0.25}
              rx="4"
              fill="oklch(0.86 0.18 60)"
              opacity={windowOpacity * (0.7 + (i % 2) * 0.15)}
            />
            {/* Door */}
            <rect
              x={h.w * 0.4}
              y={h.h * 0.6}
              width={h.w * 0.2}
              height={h.h * 0.4}
              rx="6"
              fill={`oklch(${0.18 + brightness * 0.05} 0.07 30)`}
            />
            {/* Marigold garland strung above door */}
            <path
              d={`M ${h.w * 0.1} ${h.h * 0.25} Q ${h.w * 0.5} ${h.h * 0.18} ${h.w * 0.9} ${h.h * 0.25}`}
              stroke="oklch(0.78 0.2 55)"
              strokeWidth="3"
              strokeDasharray="4 2"
              fill="none"
              opacity={0.5 + brightness * 0.5}
            />
          </g>
        ))}

        {/* Foreground ground */}
        <path d="M 0 670 L 1600 670 L 1600 900 L 0 900 Z" fill="url(#ground)" />

        {/* Foreground grass + flower hints */}
        {Array.from({ length: 40 }).map((_, i) => {
          const x = (i / 40) * 1600 + Math.random() * 20;
          return (
            <circle
              key={i}
              cx={x}
              cy={690 + Math.random() * 200}
              r={2 + Math.random() * 3}
              fill={Math.random() > 0.5 ? "oklch(0.78 0.2 55)" : "oklch(0.7 0.21 15)"}
              opacity={0.5 + brightness * 0.4}
            />
          );
        })}
      </svg>

      {/* Hanging lantern strings (top edge) */}
      <div className="absolute inset-x-0 top-0 h-32 pointer-events-none">
        <svg viewBox="0 0 1600 120" preserveAspectRatio="none" className="h-full w-full">
          <path
            d="M 0 20 Q 400 80 800 30 T 1600 20"
            stroke="oklch(0.5 0.05 30)"
            strokeWidth="2"
            fill="none"
          />
          {Array.from({ length: 14 }).map((_, i) => {
            const x = 60 + i * 110;
            const y = 30 + Math.sin(i * 0.7) * 25 + 20;
            const hue = i % 3 === 0 ? 45 : i % 3 === 1 ? 15 : 80;
            return (
              <g key={i} transform={`translate(${x} ${y})`}>
                <line x1="0" y1="-10" x2="0" y2="0" stroke="oklch(0.4 0.05 30)" strokeWidth="1" />
                <ellipse
                  cx="0"
                  cy="14"
                  rx="14"
                  ry="20"
                  fill={`oklch(0.7 0.2 ${hue})`}
                  opacity={0.5 + brightness * 0.5}
                  style={{
                    filter: `drop-shadow(0 0 ${8 + brightness * 16}px oklch(0.78 0.2 ${hue} / ${0.5 + brightness * 0.5}))`,
                  }}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Subtle vignette to focus the eye on the center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, oklch(0.08 0.05 270 / 0.55) 100%)",
        }}
      />
    </div>
  );
}

export const VillageBackdrop = memo(VillageBackdropBase);

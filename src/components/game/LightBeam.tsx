import { memo, useMemo } from "react";
import type { Point } from "@/game/types";

interface LightBeamProps {
  path: Point[]; // sequential points the beam threads through
  visible: boolean;
  stage: { w: number; h: number };
}

function segmentStyle(a: Point, b: Point, w: number, h: number) {
  const ax = (a.x / 100) * w;
  const ay = (a.y / 100) * h;
  const bx = (b.x / 100) * w;
  const by = (b.y / 100) * h;
  const dx = bx - ax;
  const dy = by - ay;
  const length = Math.hypot(dx, dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  return {
    left: ax,
    top: ay,
    width: length,
    transform: `rotate(${angle}deg)`,
  };
}

function LightBeamBase({ path, visible, stage }: LightBeamProps) {
  const segs = useMemo(() => {
    if (path.length < 2 || stage.w === 0) return [];
    return path.slice(0, -1).map((p, i) => ({
      key: `${i}-${p.x}-${p.y}`,
      style: segmentStyle(p, path[i + 1], stage.w, stage.h),
    }));
  }, [path, stage.w, stage.h]);

  return (
    <div
      className="absolute inset-0 pointer-events-none transition-opacity duration-700"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {segs.map((s) => (
        <div
          key={s.key}
          className="absolute h-[6px] origin-left rounded-full"
          style={{
            ...s.style,
            background:
              "linear-gradient(90deg, oklch(0.92 0.16 85 / 0.95), oklch(0.86 0.18 60 / 0.85))",
            boxShadow:
              "0 0 14px oklch(0.92 0.16 85 / 0.95), 0 0 36px oklch(0.86 0.18 60 / 0.75)",
            animation: "beam-pulse 1.6s ease-in-out infinite",
          }}
        />
      ))}
    </div>
  );
}

export const LightBeam = memo(LightBeamBase);

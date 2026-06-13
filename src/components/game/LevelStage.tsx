import { useEffect, useMemo, useState } from "react";
import type { LevelConfig } from "@/game/types";
import { VillageBackdrop } from "./VillageBackdrop";
import { Mirror } from "./Mirror";
import { Diya } from "./Diya";
import { LightBeam } from "./LightBeam";
import { Elephant } from "./Elephant";
import { Obstacle } from "./Obstacle";
import { Fireflies, FloatingPetals, StarField, SuccessSparkles } from "./Particles";
import { useStageSize } from "@/hooks/useStageSize";
import { useLevelState } from "@/hooks/useLevelState";
import { sfx } from "@/game/audio";

interface LevelStageProps {
  level: LevelConfig;
  onComplete: () => void;
}

export function LevelStage({ level, onComplete }: LevelStageProps) {
  const { ref, size } = useStageSize<HTMLDivElement>();
  const { aligned, cleared, tapCounts, tapMirror, tapObstacle, allAligned, beamPath, litDiyas } =
    useLevelState(level);
  const [celebrating, setCelebrating] = useState(false);

  useEffect(() => {
    if (!allAligned) return;
    sfx.beamConnect();
    const t1 = setTimeout(() => {
      level.diyas.forEach((_, i) => setTimeout(() => sfx.diyaLight(), i * 90));
      sfx.levelComplete();
      sfx.applause();
      setCelebrating(true);
    }, 350);
    // Tighter, more cohesive firework barrage — fewer bursts, evenly paced
    const fireworkTimers: number[] = [];
    for (let i = 0; i < 7; i++) {
      fireworkTimers.push(window.setTimeout(() => sfx.firework(), 700 + i * 700));
    }
    [2400, 5200].forEach((t) =>
      fireworkTimers.push(window.setTimeout(() => sfx.cheer(), t)),
    );
    const t2 = setTimeout(onComplete, 6800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      fireworkTimers.forEach(clearTimeout);
    };
  }, [allAligned, level.diyas, onComplete]);

  const brightness = Math.min(1, level.brightness + (allAligned ? 0.55 : 0));

  // Cohesive warm palette only — gold, marigold, rose. No cool blues/greens.
  const fireworks = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        x: 14 + (i / 7) * 72 + (Math.random() - 0.5) * 6,
        y: 10 + Math.random() * 30,
        delay: 0.4 + i * 0.55,
        hue: [45, 30, 15, 60, 75, 25, 50, 40][i],
        size: 180 + Math.random() * 100,
      })),
    [level.id],
  );

  return (
    <div ref={ref} className="relative h-full w-full overflow-hidden">
      <VillageBackdrop brightness={brightness} />
      <StarField count={70} />
      <Fireflies count={allAligned ? 55 : 22} />
      {allAligned && <FloatingPetals count={55} />}

      {/* Light source */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ left: `${level.source.x}%`, top: `${level.source.y}%` }}
      >
        <div
          className="h-16 w-16 rounded-full"
          style={{
            background:
              "radial-gradient(circle, oklch(0.95 0.18 85) 0%, oklch(0.78 0.2 45 / 0.6) 50%, transparent 80%)",
            boxShadow: "0 0 60px oklch(0.86 0.18 75 / 0.9), 0 0 120px oklch(0.78 0.2 45 / 0.6)",
            animation: "breathe 2.4s ease-in-out infinite",
          }}
        />
      </div>

      <LightBeam path={beamPath} visible={beamPath.length > 1} stage={size} />

      {/* Diyas — rendered low (on the ground row), not floating in front of houses */}
      {level.diyas.map((d) => (
        <Diya key={d.id} pos={d.pos} lit={litDiyas.has(d.id)} size={d.size} />
      ))}

      {/* Blocking obstacles — must be tapped before beam can pass */}
      {level.obstacles?.map((o) => (
        <Obstacle
          key={o.id}
          obstacle={o}
          cleared={!!cleared[o.id]}
          onTap={() => tapObstacle(o.id)}
        />
      ))}

      {level.mirrors.map((m) => (
        <Mirror
          key={m.id}
          pos={m.pos}
          rotation={aligned[m.id] ? m.alignedRotation : m.misalignedRotation}
          aligned={!!aligned[m.id]}
          requiredTaps={m.requiredTaps ?? 1}
          tapsTaken={tapCounts[m.id] ?? 0}
          hint={level.hintMirrorId === m.id && !aligned[m.id] && Object.keys(aligned).length === 0}
          onTap={() => tapMirror(m.id)}
        />
      ))}

      {allAligned && level.diyas.map((d) => <SuccessSparkles key={d.id} x={d.pos.x} y={d.pos.y} />)}

      {allAligned && (
        <div className="absolute inset-0 pointer-events-none">
          {fireworks.map((f) => (
            <div key={f.id} className="absolute" style={{ left: `${f.x}%`, top: `${f.y}%` }}>
              <div
                className="rounded-full"
                style={{
                  width: f.size,
                  height: f.size,
                  marginLeft: -f.size / 2,
                  marginTop: -f.size / 2,
                  background: `radial-gradient(circle, oklch(0.96 0.2 ${f.hue}) 0%, oklch(0.78 0.22 ${f.hue} / 0.7) 25%, transparent 70%)`,
                  animation: "firework-burst 2s ease-out infinite",
                  animationDelay: `${f.delay}s`,
                }}
              />
              {Array.from({ length: 12 }).map((_, k) => {
                const angle = (k / 12) * Math.PI * 2;
                return (
                  <span
                    key={k}
                    className="absolute left-0 top-0 h-[2px] origin-left rounded-full"
                    style={{
                      width: f.size * 0.5,
                      background: `linear-gradient(90deg, oklch(0.96 0.2 ${f.hue}), transparent)`,
                      transform: `rotate(${(angle * 180) / Math.PI}deg)`,
                      animation: "firework-rays 2s ease-out infinite",
                      animationDelay: `${f.delay}s`,
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* Elephant — sized per-level so it never covers the mirrors */}
      <div
        className="absolute -translate-x-1/2 -translate-y-full pointer-events-none"
        style={{ left: `${level.elephantPos.x}%`, top: `${level.elephantPos.y}%` }}
      >
        <Elephant
          size={level.elephantSize ?? Math.max(160, Math.min(size.h * 0.42, size.w * 0.24))}
          pointing={!allAligned}
          celebrating={celebrating}
        />
      </div>

      {/* Title card — top of screen, never near the mirrors */}
      <div
        className="absolute left-1/2 top-3 -translate-x-1/2 text-center pointer-events-none z-30"
        style={{ animation: "slide-up-fade 0.7s ease-out both" }}
      >
        <div className="font-display text-[10px] uppercase tracking-[0.3em] text-[oklch(0.86_0.16_75)]/80">
          Level {level.id}
        </div>
        <h2 className="font-display text-xl text-white drop-shadow-[0_2px_12px_oklch(0.05_0_0_/_0.8)] md:text-2xl">
          {level.title}
        </h2>
        <p className="mt-0.5 text-[11px] text-white/70 md:text-xs">{level.subtitle}</p>
      </div>
    </div>
  );
}

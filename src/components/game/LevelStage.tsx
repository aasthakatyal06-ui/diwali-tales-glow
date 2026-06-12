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
  const { aligned, tapMirror, allAligned, beamPath, litDiyas } = useLevelState(level);
  const [celebrating, setCelebrating] = useState(false);

  // Drive the celebration → next level handoff (longer, more intense)
  useEffect(() => {
    if (!allAligned) return;
    sfx.beamConnect();
    const t1 = setTimeout(() => {
      level.diyas.forEach((_, i) => setTimeout(() => sfx.diyaLight(), i * 100));
      sfx.levelComplete();
      sfx.cheer();
      setCelebrating(true);
    }, 350);
    // Mini firework barrage during celebration
    const fireworkTimers: number[] = [];
    for (let i = 0; i < 8; i++) {
      fireworkTimers.push(window.setTimeout(() => sfx.firework(), 700 + i * 420));
    }
    const t2 = setTimeout(onComplete, 5200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      fireworkTimers.forEach(clearTimeout);
    };
  }, [allAligned, level.diyas, onComplete]);

  // Brightness lifts dramatically when the level is solved
  const brightness = Math.min(1, level.brightness + (allAligned ? 0.55 : 0));

  // Random firework positions for celebration phase
  const fireworks = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => ({
        id: i,
        x: 12 + Math.random() * 76,
        y: 8 + Math.random() * 35,
        delay: 0.3 + Math.random() * 3.5,
        hue: [45, 15, 80, 320, 200, 0][i % 6],
        size: 160 + Math.random() * 160,
      })),
    [level.id],
  );

  return (
    <div ref={ref} className="relative h-full w-full overflow-hidden">
      <VillageBackdrop brightness={brightness} />
      <StarField count={70} />
      <Fireflies count={allAligned ? 40 : 20} />
      {allAligned && <FloatingPetals count={40} />}

      {/* Light source — a glowing temple flame at the start of the beam */}
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

      {/* Decorative obstacles (visual only) */}
      {level.obstacles?.map((o) => (
        <Obstacle key={o.id} obstacle={o} />
      ))}

      {/* Diyas (rendered below mirrors so mirrors sit on top) */}
      {level.diyas.map((d) => (
        <Diya key={d.id} pos={d.pos} lit={litDiyas.has(d.id)} size={d.size} />
      ))}

      {level.mirrors.map((m) => (
        <Mirror
          key={m.id}
          pos={m.pos}
          rotation={aligned[m.id] ? m.alignedRotation : m.misalignedRotation}
          aligned={!!aligned[m.id]}
          hint={level.hintMirrorId === m.id && !aligned[m.id] && Object.keys(aligned).length === 0}
          onTap={() => tapMirror(m.id)}
        />
      ))}

      {/* Celebration sparkles bloom at every newly lit diya */}
      {allAligned && level.diyas.map((d) => <SuccessSparkles key={d.id} x={d.pos.x} y={d.pos.y} />)}

      {/* Celebration fireworks — bright bursts across the upper sky */}
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
                  animation: "firework-burst 1.8s ease-out infinite",
                  animationDelay: `${f.delay}s`,
                }}
              />
              {Array.from({ length: 10 }).map((_, k) => {
                const angle = (k / 10) * Math.PI * 2;
                return (
                  <span
                    key={k}
                    className="absolute left-0 top-0 h-[2px] origin-left rounded-full"
                    style={{
                      width: f.size * 0.5,
                      background: `linear-gradient(90deg, oklch(0.96 0.2 ${f.hue}), transparent)`,
                      transform: `rotate(${(angle * 180) / Math.PI}deg)`,
                      animation: "firework-rays 1.8s ease-out infinite",
                      animationDelay: `${f.delay}s`,
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* Elephant — large, foreground, always visible */}
      <div
        className="absolute -translate-x-1/2 -translate-y-full pointer-events-none"
        style={{ left: `${level.elephantPos.x}%`, top: `${level.elephantPos.y}%` }}
      >
        <Elephant
          size={Math.min(360, Math.max(220, size.h * 0.55))}
          pointing={!allAligned}
          celebrating={celebrating}
        />
      </div>

      {/* Title card — small, soft, never blocks the world or mirrors */}
      <div
        className="absolute left-1/2 top-4 -translate-x-1/2 text-center pointer-events-none z-30"
        style={{ animation: "slide-up-fade 0.7s ease-out both" }}
      >
        <div className="font-display text-[10px] uppercase tracking-[0.3em] text-[oklch(0.86_0.16_75)]/80">
          Level {level.id}
        </div>
        <h2 className="font-display text-xl text-white drop-shadow-[0_2px_12px_oklch(0.05_0_0_/_0.8)] md:text-3xl">
          {level.title}
        </h2>
        <p className="mt-0.5 text-xs text-white/70 md:text-sm">{level.subtitle}</p>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import type { LevelConfig } from "@/game/types";
import { VillageBackdrop } from "./VillageBackdrop";
import { Mirror } from "./Mirror";
import { Diya } from "./Diya";
import { LightBeam } from "./LightBeam";
import { Elephant } from "./Elephant";
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

  // Drive the celebration → next level handoff
  useEffect(() => {
    if (!allAligned) return;
    sfx.beamConnect();
    const t1 = setTimeout(() => {
      level.diyas.forEach((_, i) => setTimeout(() => sfx.diyaLight(), i * 120));
      sfx.levelComplete();
      sfx.cheer();
      setCelebrating(true);
    }, 350);
    const t2 = setTimeout(onComplete, 3200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [allAligned, level.diyas, onComplete]);

  // Brightness lifts when the player completes the level — sells the transformation
  const brightness = Math.min(1, level.brightness + (allAligned ? 0.3 : 0));

  return (
    <div ref={ref} className="relative h-full w-full overflow-hidden">
      <VillageBackdrop brightness={brightness} />
      <StarField count={70} />
      <Fireflies count={20} />
      {allAligned && <FloatingPetals count={20} />}

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

      {/* Title card — small, soft, never blocks the world */}
      <div
        className="absolute left-1/2 top-6 -translate-x-1/2 text-center"
        style={{ animation: "slide-up-fade 0.7s ease-out both" }}
      >
        <div className="font-display text-xs uppercase tracking-[0.3em] text-[oklch(0.86_0.16_75)]/80">
          Level {level.id}
        </div>
        <h2 className="font-display text-3xl text-white drop-shadow-[0_2px_12px_oklch(0.05_0_0_/_0.8)] md:text-5xl">
          {level.title}
        </h2>
        <p className="mt-1 text-sm text-white/80 md:text-base">{level.subtitle}</p>
      </div>
    </div>
  );
}

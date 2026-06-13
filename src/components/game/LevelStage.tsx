import { useEffect, useMemo, useState } from "react";
import type { LevelConfig } from "@/game/types";
import { VillageBackdrop } from "./VillageBackdrop";
import { Mirror } from "./Mirror";
import { Diya } from "./Diya";
import { LightBeam } from "./LightBeam";
import { Elephant } from "./Elephant";
import { Obstacle } from "./Obstacle";
import { Fireflies, StarField, SuccessSparkles } from "./Particles";
import { useStageSize } from "@/hooks/useStageSize";
import { useLevelState } from "@/hooks/useLevelState";
import { sfx } from "@/game/audio";

interface LevelStageProps {
  level: LevelConfig;
  onComplete: () => void;
}

const SEEN_KEY = "chakra-tutorials-seen";
function isTutorialSeen(id: number) {
  if (typeof window === "undefined") return false;
  try {
    const s = JSON.parse(window.sessionStorage.getItem(SEEN_KEY) || "[]") as number[];
    return s.includes(id);
  } catch {
    return false;
  }
}
function markTutorialSeen(id: number) {
  if (typeof window === "undefined") return;
  try {
    const s = JSON.parse(window.sessionStorage.getItem(SEEN_KEY) || "[]") as number[];
    if (!s.includes(id)) {
      s.push(id);
      window.sessionStorage.setItem(SEEN_KEY, JSON.stringify(s));
    }
  } catch {
    // ignore
  }
}

export function LevelStage({ level, onComplete }: LevelStageProps) {
  const { ref, size } = useStageSize<HTMLDivElement>();
  const { aligned, cleared, tapCounts, tapMirror, tapObstacle, allAligned, beamPath, litDiyas } =
    useLevelState(level);
  const [celebrating, setCelebrating] = useState(false);
  const [showTutorial, setShowTutorial] = useState(
    !!level.tutorial && !isTutorialSeen(level.id),
  );

  useEffect(() => {
    if (!allAligned) return;
    sfx.beamConnect();
    const t1 = setTimeout(() => {
      level.diyas.forEach((_, i) => setTimeout(() => sfx.diyaLight(), i * 90));
      sfx.levelComplete();
      sfx.applause();
      setCelebrating(true);
    }, 350);
    const fireworkTimers: number[] = [];
    for (let i = 0; i < 10; i++) {
      fireworkTimers.push(window.setTimeout(() => sfx.firework(), 600 + i * 600));
    }
    [2000, 4400, 6800].forEach((t) =>
      fireworkTimers.push(window.setTimeout(() => sfx.cheer(), t)),
    );
    const t2 = setTimeout(onComplete, 8200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      fireworkTimers.forEach(clearTimeout);
    };
  }, [allAligned, level.diyas, onComplete]);

  const brightness = Math.min(1, level.brightness + (allAligned ? 0.55 : 0));

  // Warm palette only — gold, marigold, rose.
  const fireworks = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        x: 10 + (i / 11) * 80 + (Math.random() - 0.5) * 6,
        y: 8 + Math.random() * 36,
        delay: 0.4 + i * 0.45,
        hue: [45, 30, 15, 60, 75, 25, 50, 40][i % 8],
        size: 140 + Math.random() * 90,
      })),
    [level.id],
  );

  const minDim = Math.min(size.w, size.h) || 600;
  // Responsive mirror size — fits Chromebook short screens too.
  const mirrorSize = Math.max(76, Math.min(120, minDim * 0.13));
  const elephantSize = level.elephantSize ?? Math.max(110, Math.min(180, minDim * 0.22));

  return (
    <div ref={ref} className="relative h-full w-full overflow-hidden">
      <VillageBackdrop brightness={brightness} />
      <StarField count={70} />
      <Fireflies count={allAligned ? 65 : 22} />

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

      {level.diyas.map((d) => (
        <Diya key={d.id} pos={d.pos} lit={litDiyas.has(d.id)} size={d.size} />
      ))}

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
          size={mirrorSize}
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
              {/* Soft core glow (small, not a big flash) */}
              <div
                className="rounded-full"
                style={{
                  width: f.size * 0.35,
                  height: f.size * 0.35,
                  marginLeft: -f.size * 0.175,
                  marginTop: -f.size * 0.175,
                  background: `radial-gradient(circle, oklch(0.96 0.2 ${f.hue} / 0.9), transparent 70%)`,
                  animation: "firework-burst 2s ease-out infinite",
                  animationDelay: `${f.delay}s`,
                }}
              />
              {/* Star-shaped ray tips — many short lines, each ending in a sparkle dot */}
              {Array.from({ length: 18 }).map((_, k) => {
                const angle = (k / 18) * Math.PI * 2;
                const len = f.size * (0.32 + (k % 2) * 0.1);
                return (
                  <span
                    key={k}
                    className="absolute left-0 top-0"
                    style={{
                      width: len,
                      height: 0,
                      transform: `rotate(${(angle * 180) / Math.PI}deg)`,
                      animation: "firework-rays 2s ease-out infinite",
                      animationDelay: `${f.delay}s`,
                      transformOrigin: "0 0",
                    }}
                  >
                    <span
                      className="block h-[2px] rounded-full"
                      style={{
                        width: "100%",
                        background: `linear-gradient(90deg, transparent, oklch(0.96 0.22 ${f.hue}) 60%, oklch(0.98 0.2 ${f.hue}))`,
                      }}
                    />
                    <span
                      className="absolute right-[-3px] top-[-3px] h-[7px] w-[7px] rounded-full"
                      style={{
                        background: `radial-gradient(circle, oklch(0.98 0.22 ${f.hue}), transparent 70%)`,
                        boxShadow: `0 0 10px oklch(0.96 0.22 ${f.hue})`,
                      }}
                    />
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* Elephant — small, on the ground, off to one side. Never covers a diya. */}
      <div
        className="absolute -translate-x-1/2 -translate-y-full pointer-events-none z-[5]"
        style={{ left: `${level.elephantPos.x}%`, top: `${level.elephantPos.y}%` }}
      >
        <Elephant size={elephantSize} pointing={!allAligned} celebrating={celebrating} />
      </div>

      {/* Title card — top of screen */}
      <div
        className="absolute left-1/2 top-2 -translate-x-1/2 text-center pointer-events-none z-30"
        style={{ animation: "slide-up-fade 0.7s ease-out both" }}
      >
        <div className="font-display text-[10px] uppercase tracking-[0.3em] text-[oklch(0.86_0.16_75)]/80">
          Level {level.id}
        </div>
        <h2 className="font-display text-xl text-white drop-shadow-[0_2px_12px_oklch(0.05_0_0_/_0.8)] md:text-2xl">
          {level.title}
        </h2>
      </div>

      {/* First-time tutorial card — kid-friendly, big, dismissable */}
      {showTutorial && level.tutorial && (
        <div
          className="absolute inset-0 z-40 flex items-center justify-center bg-black/55 backdrop-blur-sm"
          onClick={() => {
            markTutorialSeen(level.id);
            setShowTutorial(false);
          }}
        >
          <div
            className="mx-6 max-w-md rounded-3xl px-7 py-6 text-center shadow-2xl ring-4 ring-[oklch(0.86_0.18_75)]"
            style={{
              background: "linear-gradient(180deg,#fff5d6,#ffd994)",
              animation: "slide-up-fade 0.5s ease-out both",
            }}
          >
            <p className="font-display text-3xl text-[#5a2a0a] md:text-4xl">
              {level.tutorial.title}
            </p>
            <p className="font-hand mt-3 text-xl text-[#5a2a0a] md:text-2xl">
              {level.tutorial.body}
            </p>
            <button
              type="button"
              className="font-display mt-5 rounded-full bg-[#c24a1a] px-7 py-2 text-xl text-white shadow-lg hover:bg-[#a83a14]"
            >
              Let&apos;s go!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

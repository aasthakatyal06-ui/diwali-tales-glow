import { useCallback, useEffect, useMemo, useState } from "react";
import type { LevelConfig } from "@/game/types";
import { sfx } from "@/game/audio";

export function useLevelState(level: LevelConfig) {
  const [aligned, setAligned] = useState<Record<string, boolean>>({});
  const [cleared, setCleared] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setAligned({});
    setCleared({});
  }, [level.id]);

  const tapMirror = useCallback((id: string) => {
    sfx.mirrorTap();
    setAligned((prev) => ({ ...prev, [id]: true }));
  }, []);

  const tapObstacle = useCallback((id: string) => {
    sfx.shimmer();
    setCleared((prev) => ({ ...prev, [id]: true }));
  }, []);

  const blockingObstacles = useMemo(
    () => (level.obstacles ?? []).filter((o) => o.blocking),
    [level.obstacles],
  );

  const allObstaclesCleared = useMemo(
    () => blockingObstacles.every((o) => cleared[o.id]),
    [blockingObstacles, cleared],
  );

  const allMirrorsAligned = useMemo(
    () => level.mirrors.every((m) => aligned[m.id]),
    [level.mirrors, aligned],
  );

  const allAligned = allMirrorsAligned && allObstaclesCleared;

  const beamPath = useMemo(() => {
    const pts = [level.source];
    for (const m of level.mirrors) {
      if (aligned[m.id]) pts.push(m.pos);
      else break;
    }
    if (allAligned) {
      for (const d of level.diyas) pts.push(d.pos);
    }
    return pts;
  }, [level, aligned, allAligned]);

  const litDiyas = useMemo(() => {
    const set = new Set<string>();
    if (allAligned) level.diyas.forEach((d) => set.add(d.id));
    return set;
  }, [allAligned, level.diyas]);

  return { aligned, cleared, tapMirror, tapObstacle, allAligned, beamPath, litDiyas };
}

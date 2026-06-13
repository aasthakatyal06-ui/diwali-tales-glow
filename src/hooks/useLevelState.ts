import { useCallback, useEffect, useMemo, useState } from "react";
import type { LevelConfig } from "@/game/types";
import { sfx } from "@/game/audio";

export function useLevelState(level: LevelConfig) {
  const [tapCounts, setTapCounts] = useState<Record<string, number>>({});
  const [cleared, setCleared] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setTapCounts({});
    setCleared({});
  }, [level.id]);

  /** success=false means the mirror was tapped but didn't lock (used by
   *  spinning mirrors when the player mistimes the tap). */
  const tapMirror = useCallback((id: string, success: boolean = true) => {
    sfx.mirrorTap();
    if (!success) return;
    setTapCounts((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  }, []);

  const tapObstacle = useCallback((id: string) => {
    setCleared((prev) => ({ ...prev, [id]: true }));
  }, []);

  const aligned = useMemo(() => {
    const out: Record<string, boolean> = {};
    for (const m of level.mirrors) {
      const need = m.requiredTaps ?? 1;
      const taps = tapCounts[m.id] ?? 0;
      out[m.id] = taps >= need;
    }
    return out;
  }, [level.mirrors, tapCounts]);

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

  return { aligned, cleared, tapCounts, tapMirror, tapObstacle, allAligned, beamPath, litDiyas };
}

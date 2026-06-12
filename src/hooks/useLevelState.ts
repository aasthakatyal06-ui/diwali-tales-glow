import { useCallback, useEffect, useMemo, useState } from "react";
import type { LevelConfig } from "@/game/types";
import { sfx } from "@/game/audio";

export function useLevelState(level: LevelConfig) {
  const [aligned, setAligned] = useState<Record<string, boolean>>({});

  // Reset alignment when the level changes
  useEffect(() => {
    setAligned({});
  }, [level.id]);

  const tapMirror = useCallback(
    (id: string) => {
      sfx.mirrorTap();
      setAligned((prev) => ({ ...prev, [id]: true }));
    },
    [],
  );

  const allAligned = useMemo(
    () => level.mirrors.every((m) => aligned[m.id]),
    [level.mirrors, aligned],
  );

  const beamPath = useMemo(() => {
    // Beam reveals progressively: source -> each aligned mirror in order.
    // When ALL mirrors aligned, beam continues through all diyas in order.
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

  return { aligned, tapMirror, allAligned, beamPath, litDiyas };
}

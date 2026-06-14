import { useCallback, useEffect, useMemo, useState } from "react";
import type { LevelConfig, Point } from "@/game/types";
import { sfx } from "@/game/audio";

const DEFAULT_ORIENTATIONS = 4;

/**
 * Mirrors cycle through N discrete rotations on each tap. Only one position
 * is "correct". The light beam visibly overshoots past the first misaligned
 * mirror so the player can SEE which mirror is wrong and adjust intentionally.
 */
export function useLevelState(level: LevelConfig) {
  const [indices, setIndices] = useState<Record<string, number>>({});
  const [cleared, setCleared] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const init: Record<string, number> = {};
    for (const m of level.mirrors) init[m.id] = m.startIndex;
    setIndices(init);
    setCleared({});
  }, [level.id, level.mirrors]);

  const aligned = useMemo(() => {
    const out: Record<string, boolean> = {};
    for (const m of level.mirrors) {
      out[m.id] = (indices[m.id] ?? m.startIndex) === m.correctIndex;
    }
    return out;
  }, [level.mirrors, indices]);

  const locked = useMemo(() => {
    const out: Record<string, boolean> = {};
    for (const m of level.mirrors) {
      out[m.id] = !!m.lockedUntil?.some((id) => !aligned[id]);
    }
    return out;
  }, [level.mirrors, aligned]);

  const tapMirror = useCallback(
    (id: string) => {
      const m = level.mirrors.find((mm) => mm.id === id);
      if (!m) return;
      if (m.lockedUntil?.some((dep) => (indices[dep] ?? 0) !== (level.mirrors.find((x) => x.id === dep)?.correctIndex ?? -1))) {
        return;
      }
      sfx.mirrorTap();
      setIndices((prev) => {
        const N = m.orientations ?? DEFAULT_ORIENTATIONS;
        const cur = prev[id] ?? m.startIndex;
        return { ...prev, [id]: (cur + 1) % N };
      });
    },
    [level.mirrors, indices],
  );

  const tapObstacle = useCallback((id: string) => {
    setCleared((prev) => ({ ...prev, [id]: true }));
  }, []);

  const rotations = useMemo(() => {
    const out: Record<string, number> = {};
    for (const m of level.mirrors) {
      const N = m.orientations ?? DEFAULT_ORIENTATIONS;
      const idx = indices[m.id] ?? m.startIndex;
      out[m.id] = (idx * 360) / N;
    }
    return out;
  }, [level.mirrors, indices]);

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

  // Beam threads through aligned mirrors in order. The first misaligned
  // mirror produces an "overshoot" tail — the beam shoots past it in the
  // current direction so the player visually sees what's wrong.
  const beamPath = useMemo<Point[]>(() => {
    const pts: Point[] = [level.source];
    let blocked = false;
    for (const m of level.mirrors) {
      pts.push(m.pos);
      if (!aligned[m.id]) {
        const prev = pts[pts.length - 2];
        const dx = m.pos.x - prev.x;
        const dy = m.pos.y - prev.y;
        const len = Math.hypot(dx, dy) || 1;
        const ext = 20;
        pts.push({ x: m.pos.x + (dx / len) * ext, y: m.pos.y + (dy / len) * ext });
        blocked = true;
        break;
      }
    }
    if (!blocked && allObstaclesCleared) {
      for (const d of level.diyas) pts.push(d.pos);
    }
    return pts;
  }, [level, aligned, allObstaclesCleared]);

  const litDiyas = useMemo(() => {
    const set = new Set<string>();
    if (allAligned) level.diyas.forEach((d) => set.add(d.id));
    return set;
  }, [allAligned, level.diyas]);

  // Which mirrors are "reachable" by the beam (all preceding mirrors aligned).
  // Used to limit ghost ray visibility — only show for reachable mirrors.
  const reachable = useMemo(() => {
    const set = new Set<string>();
    for (const m of level.mirrors) {
      set.add(m.id);
      if (!aligned[m.id]) break;
    }
    return set;
  }, [level.mirrors, aligned]);

  return {
    aligned,
    rotations,
    cleared,
    locked,
    tapMirror,
    tapObstacle,
    allAligned,
    beamPath,
    litDiyas,
    reachable,
  };
}

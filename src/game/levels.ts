import type { LevelConfig } from "./types";

// Every mirror has 4 discrete rotations (90° apart). The correct rotation is
// auto-computed from geometry — it points the mirror at the NEXT mirror in
// the chain (or, for the last mirror, at the first diya). The starting
// rotation is always 180° off from correct so the player MUST reason about
// which way each mirror has to face.

const RAW_LEVELS: LevelConfig[] = [
  {
    id: 1,
    title: "First Light",
    subtitle: "Spin the mirror until it catches the light",
    source: { x: 10, y: 42 },
    mirrors: [
      { id: "m1", pos: { x: 50, y: 42 }, orientations: 4, startIndex: 1, correctIndex: 0 },
    ],
    diyas: [{ id: "d1", pos: { x: 50, y: 88 }, size: "lg" }],
    elephantPos: { x: 82, y: 100 },
    elephantSize: 200,
    hintMirrorId: "m1",
    brightness: 0.0,
    tutorial: {
      title: "Tap to spin the mirror!",
      body: "Each tap turns it a quarter turn. Keep tapping until the mirror turns golden — that means the direction is correct!",
    },
  },
  {
    id: 2,
    title: "Guiding the Beam",
    subtitle: "Plan both mirrors before you start tapping",
    source: { x: 6, y: 36 },
    mirrors: [
      { id: "m1", pos: { x: 32, y: 36 }, orientations: 4, startIndex: 2, correctIndex: 0 },
      { id: "m2", pos: { x: 62, y: 36 }, orientations: 4, startIndex: 1, correctIndex: 0 },
    ],
    diyas: [{ id: "d1", pos: { x: 62, y: 86 }, size: "lg" }],
    elephantPos: { x: 14, y: 100 },
    elephantSize: 190,
    brightness: 0.15,
    ghostRayRange: 2,
    tutorial: {
      title: "Think ahead!",
      body: "The first mirror must pass the light to the second. Spin each mirror until it turns golden — then the direction is right!",
    },
  },
  {
    id: 3,
    title: "The Hidden Path",
    subtitle: "Four mirrors, two diyas — read every ghost ray before tapping",
    source: { x: 5, y: 32 },
    mirrors: [
      { id: "m1", pos: { x: 22, y: 32 }, orientations: 4, startIndex: 3, correctIndex: 0 },
      { id: "m2", pos: { x: 46, y: 32 }, orientations: 4, startIndex: 2, correctIndex: 0 },
      { id: "m3", pos: { x: 68, y: 32 }, orientations: 4, startIndex: 1, correctIndex: 0 },
      { id: "m4", pos: { x: 88, y: 32 }, orientations: 4, startIndex: 2, correctIndex: 0 },
    ],
    diyas: [
      { id: "d1", pos: { x: 46, y: 88 }, size: "md" },
      { id: "d2", pos: { x: 88, y: 88 }, size: "lg" },
    ],
    elephantPos: { x: 10, y: 100 },
    elephantSize: 220,
    hideTapHints: true,
    ghostRayRange: 2,
    brightness: 0.28,
  },
  {
    id: 4,
    title: "Around the Stones",
    subtitle: "Moving obstacles! Time your taps carefully.",
    source: { x: 5, y: 30 },
    mirrors: [
      { id: "m1", pos: { x: 20, y: 30 }, orientations: 4, startIndex: 1, correctIndex: 0 },
      { id: "m2", pos: { x: 42, y: 30 }, orientations: 4, startIndex: 3, correctIndex: 0 },
      { id: "m3", pos: { x: 64, y: 30 }, orientations: 4, startIndex: 2, correctIndex: 0 },
      { id: "m4", pos: { x: 86, y: 30 }, orientations: 4, startIndex: 3, correctIndex: 0 },
    ],
    diyas: [
      { id: "d1", pos: { x: 42, y: 86 }, size: "sm" },
      { id: "d2", pos: { x: 64, y: 86 }, size: "md" },
      { id: "d3", pos: { x: 92, y: 88 }, size: "lg" },
    ],
    elephantPos: { x: 8, y: 100 },
    elephantSize: 210,
    obstacles: [
      { id: "o1", pos: { x: 31, y: 30 }, kind: "stone", blocking: true },
      { id: "o2", pos: { x: 53, y: 30 }, kind: "pot", blocking: true, moving: true, range: 3 },
      { id: "o3", pos: { x: 75, y: 30 }, kind: "stone", blocking: true, moving: true, range: 4 },
    ],
    hintObstacleId: "o2",
    hideTapHints: true,
    ghostRayRange: 2,
    brightness: 0.42,
    tutorial: {
      title: "Stones on the move!",
      body: "Some obstacles slide back and forth! Wait for them to line up with the mirror, then smash!",
    },
  },
  {
    id: 5,
    title: "The Grand Chain",
    subtitle: "Seven mirrors, each locked behind the last. No room for guessing.",
    source: { x: 5, y: 22 },
    mirrors: [
      { id: "m1", pos: { x: 14, y: 22 }, orientations: 4, startIndex: 2, correctIndex: 0 },
      { id: "m2", pos: { x: 28, y: 38 }, orientations: 4, startIndex: 3, correctIndex: 0, lockedUntil: ["m1"] },
      { id: "m3", pos: { x: 42, y: 22 }, orientations: 4, startIndex: 1, correctIndex: 0, lockedUntil: ["m2"] },
      { id: "m4", pos: { x: 56, y: 38 }, orientations: 4, startIndex: 2, correctIndex: 0, lockedUntil: ["m3"] },
      { id: "m5", pos: { x: 70, y: 22 }, orientations: 4, startIndex: 3, correctIndex: 0, lockedUntil: ["m4"] },
      { id: "m6", pos: { x: 84, y: 38 }, orientations: 4, startIndex: 1, correctIndex: 0, lockedUntil: ["m5"] },
      { id: "m7", pos: { x: 94, y: 22 }, orientations: 4, startIndex: 2, correctIndex: 0, lockedUntil: ["m6"] },
    ],
    diyas: [
      { id: "d1", pos: { x: 28, y: 88 }, size: "sm" },
      { id: "d2", pos: { x: 56, y: 86 }, size: "md" },
      { id: "d3", pos: { x: 84, y: 88 }, size: "md" },
      { id: "d4", pos: { x: 96, y: 86 }, size: "lg" },
    ],
    elephantPos: { x: 50, y: 100 },
    elephantSize: 230,
    obstacles: [
      { id: "o1", pos: { x: 21, y: 28 }, kind: "stone", blocking: true },
      { id: "o2", pos: { x: 35, y: 28 }, kind: "pot", blocking: true, moving: true, range: 3 },
      { id: "o3", pos: { x: 49, y: 28 }, kind: "stone", blocking: true },
      { id: "o4", pos: { x: 63, y: 28 }, kind: "pot", blocking: true, moving: true, range: 4 },
      { id: "o5", pos: { x: 77, y: 28 }, kind: "stone", blocking: true },
      { id: "o6", pos: { x: 89, y: 28 }, kind: "pot", blocking: true, moving: true, range: 3 },
    ],
    hideTapHints: true,
    ghostRayRange: 1,
    brightness: 0.6,
    tutorial: {
      title: "The Grand Chain!",
      body: "Seven locked mirrors! Each one unlocks only after the previous mirror is golden. Plan every step!",
    },
  },
  {
    id: 6,
    title: "The Crossroads",
    subtitle: "Two paths, one beam. Solve both to light the village.",
    source: { x: 5, y: 26 },
    mirrors: [
      // Entry mirror — not locked, always solvable first
      { id: "m1", pos: { x: 18, y: 26 }, orientations: 4, startIndex: 2, correctIndex: 0 },
      // Upper path (m2 -> m3 -> m4)
      { id: "m2", pos: { x: 36, y: 16 }, orientations: 4, startIndex: 3, correctIndex: 0, lockedUntil: ["m1"] },
      { id: "m3", pos: { x: 56, y: 16 }, orientations: 4, startIndex: 1, correctIndex: 0, lockedUntil: ["m2"] },
      { id: "m4", pos: { x: 76, y: 16 }, orientations: 4, startIndex: 2, correctIndex: 0, lockedUntil: ["m3"] },
      // Lower path (m5 -> m6 -> m7)
      { id: "m5", pos: { x: 36, y: 44 }, orientations: 4, startIndex: 1, correctIndex: 0, lockedUntil: ["m1"] },
      { id: "m6", pos: { x: 56, y: 44 }, orientations: 4, startIndex: 3, correctIndex: 0, lockedUntil: ["m5"] },
      { id: "m7", pos: { x: 76, y: 44 }, orientations: 4, startIndex: 2, correctIndex: 0, lockedUntil: ["m6"] },
    ],
    diyas: [
      // Upper path diya
      { id: "d1", pos: { x: 76, y: 86 }, size: "lg" },
      // Lower path diya
      { id: "d2", pos: { x: 56, y: 86 }, size: "md" },
      // Final celebration diya
      { id: "d3", pos: { x: 94, y: 86 }, size: "lg" },
    ],
    elephantPos: { x: 50, y: 100 },
    elephantSize: 240,
    obstacles: [
      // Upper path obstacles
      { id: "o1", pos: { x: 46, y: 16 }, kind: "stone", blocking: true },
      { id: "o2", pos: { x: 66, y: 16 }, kind: "pot", blocking: true, moving: true, range: 4 },
      // Lower path obstacles
      { id: "o3", pos: { x: 46, y: 44 }, kind: "pot", blocking: true, moving: true, range: 3 },
      { id: "o4", pos: { x: 66, y: 44 }, kind: "stone", blocking: true },
      // Decoy obstacle in the middle
      { id: "o5", pos: { x: 86, y: 30 }, kind: "stone", blocking: true, moving: true, range: 5 },
    ],
    hideTapHints: true,
    ghostRayRange: 1,
    brightness: 0.82,
    tutorial: {
      title: "The Crossroads!",
      body: "The beam splits into two paths! Solve BOTH — upper and lower — to light every diya. Plan your route!",
    },
  },
];

// Auto-compute each mirror's correct rotation from geometry: it points toward
// the next mirror (or the first diya for the last mirror). The starting
// rotation is always 180° opposite, so the ghost-ray clearly mis-aims and
// the player has to think about each mirror's true target.
function withComputedAngles(raw: LevelConfig): LevelConfig {
  const mirrors = raw.mirrors.map((m, i) => {
    const N = m.orientations ?? 4;
    const target =
      i < raw.mirrors.length - 1
        ? raw.mirrors[i + 1].pos
        : raw.diyas[0]?.pos ?? m.pos;
    const dx = target.x - m.pos.x;
    const dy = target.y - m.pos.y;
    // Mirror's arrow points up at rotation 0 → dir (sin θ, -cos θ).
    // Solve: θ = atan2(dx, -dy).
    const theta = Math.atan2(dx, -dy);
    let correct = Math.round((theta / (2 * Math.PI)) * N);
    correct = ((correct % N) + N) % N;
    // Always start 180° off from correct so the ghost-ray clearly mis-aims
    // and the player has to think about each mirror's true target.
    const start = (correct + 2) % N;
    return { ...m, correctIndex: correct, startIndex: start };
  });
  return { ...raw, mirrors };
}

export const LEVELS: LevelConfig[] = RAW_LEVELS.map(withComputedAngles);

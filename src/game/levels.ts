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
      body: "Each tap turns it a quarter. Find the angle that points the light at the diya.",
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
      body: "The first mirror must pass the light to the second. Picture the path before you tap.",
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
    subtitle: "Clear the obstacles AND solve four mirrors",
    source: { x: 5, y: 30 },
    mirrors: [
      { id: "m1", pos: { x: 18, y: 30 }, orientations: 4, startIndex: 1, correctIndex: 0 },
      { id: "m2", pos: { x: 38, y: 30 }, orientations: 4, startIndex: 3, correctIndex: 0 },
      { id: "m3", pos: { x: 60, y: 30 }, orientations: 4, startIndex: 2, correctIndex: 0 },
      { id: "m4", pos: { x: 82, y: 30 }, orientations: 4, startIndex: 3, correctIndex: 0 },
    ],
    diyas: [
      { id: "d1", pos: { x: 38, y: 86 }, size: "sm" },
      { id: "d2", pos: { x: 60, y: 86 }, size: "md" },
      { id: "d3", pos: { x: 92, y: 88 }, size: "lg" },
    ],
    elephantPos: { x: 8, y: 100 },
    elephantSize: 210,
    obstacles: [
      { id: "o1", pos: { x: 28, y: 30 }, kind: "stone", blocking: true },
      { id: "o2", pos: { x: 49, y: 30 }, kind: "pot", blocking: true },
      { id: "o3", pos: { x: 71, y: 30 }, kind: "stone", blocking: true },
    ],
    hintObstacleId: "o1",
    hideTapHints: true,
    ghostRayRange: 2,
    brightness: 0.42,
    tutorial: {
      title: "Stones in the way!",
      body: "Tap each glowing stone or pot to clear it. THEN solve the mirrors.",
    },
  },
  {
    id: 5,
    title: "Locked Courtyard",
    subtitle: "Unlock the chain — but which mirror matters most?",
    source: { x: 4, y: 26 },
    mirrors: [
      { id: "m1", pos: { x: 12, y: 26 }, orientations: 4, startIndex: 2, correctIndex: 0 },
      { id: "m2", pos: { x: 24, y: 26 }, orientations: 4, startIndex: 3, correctIndex: 0, lockedUntil: ["m1"] },
      { id: "m3", pos: { x: 38, y: 40 }, orientations: 4, startIndex: 1, correctIndex: 0, lockedUntil: ["m2"] },
      { id: "m4", pos: { x: 54, y: 26 }, orientations: 4, startIndex: 2, correctIndex: 0, lockedUntil: ["m3"] },
      { id: "m5", pos: { x: 70, y: 26 }, orientations: 4, startIndex: 3, correctIndex: 0, lockedUntil: ["m4"] },
      { id: "m6", pos: { x: 86, y: 26 }, orientations: 4, startIndex: 1, correctIndex: 0, lockedUntil: ["m5"] },
    ],
    diyas: [
      { id: "d1", pos: { x: 24, y: 88 }, size: "sm" },
      { id: "d2", pos: { x: 38, y: 88 }, size: "sm" },
      { id: "d3", pos: { x: 54, y: 86 }, size: "md" },
      { id: "d4", pos: { x: 70, y: 88 }, size: "md" },
      { id: "d5", pos: { x: 92, y: 86 }, size: "lg" },
    ],
    elephantPos: { x: 50, y: 100 },
    elephantSize: 230,
    obstacles: [
      { id: "o1", pos: { x: 18, y: 26 }, kind: "stone", blocking: true },
      { id: "o2", pos: { x: 32, y: 26 }, kind: "pot", blocking: true },
      { id: "o3", pos: { x: 46, y: 26 }, kind: "stone", blocking: true },
      { id: "o4", pos: { x: 62, y: 26 }, kind: "pot", blocking: true },
      { id: "o5", pos: { x: 78, y: 26 }, kind: "stone", blocking: true },
      // Decoy obstacle on lower path — must figure out the upper chain is the real path
      { id: "o6", pos: { x: 54, y: 56 }, kind: "pot", blocking: true, moving: true, range: 4 },
    ],
    hideTapHints: true,
    ghostRayRange: 1,
    brightness: 0.6,
    tutorial: {
      title: "Locked mirrors!",
      body: "A locked 🔒 mirror won't move until the one before it is aligned. M3 is off-path — plan the chain!",
    },
  },
  {
    id: 6,
    title: "Grand Diwali Night",
    subtitle: "Multiple spinning mirrors. Time every reflection.",
    source: { x: 4, y: 24 },
    mirrors: [
      { id: "m1", pos: { x: 12, y: 24 }, orientations: 4, startIndex: 2, correctIndex: 0 },
      { id: "m2", pos: { x: 24, y: 24 }, orientations: 4, startIndex: 3, correctIndex: 0, lockedUntil: ["m1"] },
      { id: "m3", pos: { x: 38, y: 24 }, orientations: 4, startIndex: 1, correctIndex: 0, lockedUntil: ["m2"], autoRotate: true, autoRotateMs: 1600 },
      { id: "m4", pos: { x: 54, y: 24 }, orientations: 4, startIndex: 2, correctIndex: 0, lockedUntil: ["m3"] },
      { id: "m5", pos: { x: 68, y: 24 }, orientations: 4, startIndex: 3, correctIndex: 0, lockedUntil: ["m4"], autoRotate: true, autoRotateMs: 1000 },
      { id: "m6", pos: { x: 82, y: 24 }, orientations: 4, startIndex: 1, correctIndex: 0, lockedUntil: ["m5"] },
      { id: "m7", pos: { x: 92, y: 24 }, orientations: 4, startIndex: 0, correctIndex: 0, autoRotate: true, autoRotateMs: 800 },
    ],
    diyas: [
      { id: "d1", pos: { x: 24, y: 88 }, size: "sm" },
      { id: "d2", pos: { x: 38, y: 86 }, size: "sm" },
      { id: "d3", pos: { x: 54, y: 86 }, size: "md" },
      { id: "d4", pos: { x: 68, y: 88 }, size: "md" },
      { id: "d5", pos: { x: 82, y: 86 }, size: "md" },
      { id: "d6", pos: { x: 96, y: 86 }, size: "lg" },
    ],
    elephantPos: { x: 50, y: 100 },
    elephantSize: 240,
    obstacles: [
      { id: "o1", pos: { x: 18, y: 24 }, kind: "stone", blocking: true },
      { id: "o2", pos: { x: 32, y: 24 }, kind: "pot", blocking: true },
      { id: "o3", pos: { x: 46, y: 24 }, kind: "stone", blocking: true },
      { id: "o4", pos: { x: 61, y: 24 }, kind: "pot", blocking: true },
      { id: "o5", pos: { x: 75, y: 24 }, kind: "stone", blocking: true },
      { id: "o6", pos: { x: 87, y: 24 }, kind: "pot", blocking: true },
      { id: "o7", pos: { x: 38, y: 56 }, kind: "stone", blocking: true, moving: true, range: 5 },
      { id: "o8", pos: { x: 68, y: 56 }, kind: "pot", blocking: true, moving: true, range: 4 },
    ],
    hideTapHints: true,
    ghostRayRange: 1,
    brightness: 0.82,
    tutorial: {
      title: "The final test!",
      body: "Three spinning mirrors at different speeds. Align the chain, then time each spin. Patience + planning!",
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
    const start = m.autoRotate ? correct : (correct + 2) % N;
    return { ...m, correctIndex: correct, startIndex: start };
  });
  return { ...raw, mirrors };
}

export const LEVELS: LevelConfig[] = RAW_LEVELS.map(withComputedAngles);

import type { LevelConfig } from "./types";

// Coordinate system: x/y are percentages of the stage (0-100).
// Beam path = source -> mirrors[0..n] -> diyas[0..m] in order.
// Diyas always sit on the ground (y ~ 84-90) so they don't float in front of houses.
// Difficulty progression:
//   L1-2: single tap to align each mirror.
//   L3:   single tap mirrors + a decorative pot.
//   L4:   mirrors need 2 taps (dial in the angle) + 1 blocking obstacle.
//   L5:   mirrors need 2–3 taps + multiple blocking obstacles in sequence.
//   L6:   most mirrors need 3 taps, all obstacles blocking — final challenge.

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    title: "First Light",
    subtitle: "Tap the mirror to light the diya",
    source: { x: 12, y: 40 },
    mirrors: [
      { id: "m1", pos: { x: 50, y: 40 }, misalignedRotation: -35, alignedRotation: 0 },
    ],
    diyas: [{ id: "d1", pos: { x: 50, y: 88 }, size: "lg" }],
    elephantPos: { x: 88, y: 99 },
    hintMirrorId: "m1",
    brightness: 0.0,
  },
  {
    id: 2,
    title: "Festival Path",
    subtitle: "Light the way through the village",
    source: { x: 8, y: 35 },
    mirrors: [
      { id: "m1", pos: { x: 32, y: 35 }, misalignedRotation: 30, alignedRotation: 0 },
      { id: "m2", pos: { x: 62, y: 35 }, misalignedRotation: -25, alignedRotation: 0 },
    ],
    diyas: [
      { id: "d1", pos: { x: 32, y: 88 }, size: "sm" },
      { id: "d2", pos: { x: 62, y: 86 }, size: "md" },
      { id: "d3", pos: { x: 88, y: 88 }, size: "lg" },
    ],
    elephantPos: { x: 94, y: 99 },
    brightness: 0.12,
  },
  {
    id: 3,
    title: "Market Awakens",
    subtitle: "Wake up the sleepy stalls",
    source: { x: 6, y: 30 },
    mirrors: [
      { id: "m1", pos: { x: 28, y: 30 }, misalignedRotation: -40, alignedRotation: 0 },
      { id: "m2", pos: { x: 58, y: 30 }, misalignedRotation: 35, alignedRotation: 0 },
    ],
    diyas: [
      { id: "d1", pos: { x: 28, y: 86 }, size: "sm" },
      { id: "d2", pos: { x: 58, y: 88 }, size: "md" },
      { id: "d3", pos: { x: 78, y: 86 }, size: "md" },
      { id: "d4", pos: { x: 92, y: 88 }, size: "lg" },
    ],
    elephantPos: { x: 94, y: 99 },
    obstacles: [{ id: "o1", pos: { x: 44, y: 78 }, kind: "pot" }],
    brightness: 0.26,
  },
  {
    id: 4,
    title: "Lantern Grove",
    subtitle: "Tap the mirrors twice to dial them in",
    source: { x: 5, y: 28 },
    mirrors: [
      { id: "m1", pos: { x: 22, y: 28 }, misalignedRotation: 30, alignedRotation: 0, requiredTaps: 2 },
      { id: "m2", pos: { x: 48, y: 28 }, misalignedRotation: -30, alignedRotation: 0, requiredTaps: 2 },
      { id: "m3", pos: { x: 74, y: 28 }, misalignedRotation: 30, alignedRotation: 0, requiredTaps: 2 },
    ],
    diyas: [
      { id: "d1", pos: { x: 22, y: 88 }, size: "sm" },
      { id: "d2", pos: { x: 48, y: 86 }, size: "sm" },
      { id: "d3", pos: { x: 74, y: 88 }, size: "md" },
      { id: "d4", pos: { x: 92, y: 86 }, size: "lg" },
    ],
    elephantPos: { x: 96, y: 99 },
    obstacles: [
      { id: "o1", pos: { x: 35, y: 28 }, kind: "stone", blocking: true },
    ],
    brightness: 0.42,
  },
  {
    id: 5,
    title: "Temple Courtyard",
    subtitle: "Some mirrors need more turns. Clear the path too.",
    source: { x: 5, y: 26 },
    mirrors: [
      { id: "m1", pos: { x: 18, y: 26 }, misalignedRotation: -30, alignedRotation: 0, requiredTaps: 2 },
      { id: "m2", pos: { x: 38, y: 26 }, misalignedRotation: 35, alignedRotation: 0, requiredTaps: 3 },
      { id: "m3", pos: { x: 58, y: 26 }, misalignedRotation: -35, alignedRotation: 0, requiredTaps: 2 },
      { id: "m4", pos: { x: 78, y: 26 }, misalignedRotation: 30, alignedRotation: 0, requiredTaps: 3 },
    ],
    diyas: [
      { id: "d1", pos: { x: 18, y: 88 }, size: "sm" },
      { id: "d2", pos: { x: 38, y: 86 }, size: "sm" },
      { id: "d3", pos: { x: 58, y: 88 }, size: "md" },
      { id: "d4", pos: { x: 78, y: 86 }, size: "md" },
      { id: "d5", pos: { x: 93, y: 88 }, size: "lg" },
    ],
    elephantPos: { x: 5, y: 99 },
    obstacles: [
      { id: "o1", pos: { x: 28, y: 26 }, kind: "stone", blocking: true },
      { id: "o2", pos: { x: 68, y: 26 }, kind: "pot", blocking: true },
    ],
    brightness: 0.6,
  },
  {
    id: 6,
    title: "Grand Diwali Night",
    subtitle: "Three turns each. Clear every stone. Restore the flame.",
    source: { x: 4, y: 24 },
    mirrors: [
      { id: "m1", pos: { x: 16, y: 24 }, misalignedRotation: 35, alignedRotation: 0, requiredTaps: 3 },
      { id: "m2", pos: { x: 32, y: 24 }, misalignedRotation: -30, alignedRotation: 0, requiredTaps: 2 },
      { id: "m3", pos: { x: 50, y: 24 }, misalignedRotation: 30, alignedRotation: 0, requiredTaps: 3 },
      { id: "m4", pos: { x: 68, y: 24 }, misalignedRotation: -35, alignedRotation: 0, requiredTaps: 3 },
      { id: "m5", pos: { x: 86, y: 24 }, misalignedRotation: 30, alignedRotation: 0, requiredTaps: 2 },
    ],
    diyas: [
      { id: "d1", pos: { x: 16, y: 88 }, size: "sm" },
      { id: "d2", pos: { x: 32, y: 86 }, size: "sm" },
      { id: "d3", pos: { x: 50, y: 88 }, size: "md" },
      { id: "d4", pos: { x: 68, y: 86 }, size: "md" },
      { id: "d5", pos: { x: 86, y: 88 }, size: "md" },
      { id: "d6", pos: { x: 95, y: 86 }, size: "lg" },
    ],
    elephantPos: { x: 5, y: 99 },
    obstacles: [
      { id: "o1", pos: { x: 24, y: 24 }, kind: "stone", blocking: true },
      { id: "o2", pos: { x: 41, y: 24 }, kind: "pot", blocking: true },
      { id: "o3", pos: { x: 59, y: 24 }, kind: "stone", blocking: true },
      { id: "o4", pos: { x: 77, y: 24 }, kind: "pot", blocking: true },
    ],
    brightness: 0.82,
  },
];

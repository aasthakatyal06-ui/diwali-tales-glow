import type { LevelConfig } from "./types";

// Coordinate system: x/y are percentages of the stage (0-100).
// Beam path = source -> mirrors[0..n] -> diyas[0..m] in order.
// Mirrors are visually tilted when "misaligned" and snap upright when tapped.
// We intentionally keep puzzles trivial — the magic is the star.

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    title: "First Light",
    subtitle: "Tap the mirror to light the diya",
    source: { x: 18, y: 55 },
    mirrors: [
      { id: "m1", pos: { x: 45, y: 55 }, misalignedRotation: -35, alignedRotation: 0 },
    ],
    diyas: [{ id: "d1", pos: { x: 75, y: 55 }, size: "lg" }],
    elephantPos: { x: 82, y: 78 },
    hintMirrorId: "m1",
    brightness: 0.05,
  },
  {
    id: 2,
    title: "Festival Path",
    subtitle: "Light the way through the village",
    source: { x: 12, y: 40 },
    mirrors: [
      { id: "m1", pos: { x: 35, y: 40 }, misalignedRotation: 30, alignedRotation: 0 },
      { id: "m2", pos: { x: 60, y: 60 }, misalignedRotation: -25, alignedRotation: 0 },
    ],
    diyas: [
      { id: "d1", pos: { x: 35, y: 60 }, size: "sm" },
      { id: "d2", pos: { x: 60, y: 75 }, size: "md" },
      { id: "d3", pos: { x: 85, y: 60 }, size: "lg" },
    ],
    elephantPos: { x: 18, y: 80 },
    brightness: 0.18,
  },
  {
    id: 3,
    title: "Market Awakens",
    subtitle: "Wake up the sleepy stalls",
    source: { x: 10, y: 65 },
    mirrors: [
      { id: "m1", pos: { x: 30, y: 65 }, misalignedRotation: -40, alignedRotation: 0 },
      { id: "m2", pos: { x: 55, y: 45 }, misalignedRotation: 35, alignedRotation: 0 },
    ],
    diyas: [
      { id: "d1", pos: { x: 30, y: 45 }, size: "sm" },
      { id: "d2", pos: { x: 55, y: 70 }, size: "md" },
      { id: "d3", pos: { x: 78, y: 45 }, size: "md" },
      { id: "d4", pos: { x: 90, y: 65 }, size: "lg" },
    ],
    elephantPos: { x: 80, y: 82 },
    brightness: 0.32,
  },
  {
    id: 4,
    title: "Lantern Grove",
    subtitle: "Fill the sky with floating light",
    source: { x: 8, y: 50 },
    mirrors: [
      { id: "m1", pos: { x: 28, y: 50 }, misalignedRotation: 30, alignedRotation: 0 },
      { id: "m2", pos: { x: 50, y: 32 }, misalignedRotation: -30, alignedRotation: 0 },
      { id: "m3", pos: { x: 72, y: 55 }, misalignedRotation: 30, alignedRotation: 0 },
    ],
    diyas: [
      { id: "d1", pos: { x: 28, y: 32 }, size: "sm" },
      { id: "d2", pos: { x: 50, y: 55 }, size: "sm" },
      { id: "d3", pos: { x: 72, y: 32 }, size: "md" },
      { id: "d4", pos: { x: 92, y: 55 }, size: "lg" },
    ],
    elephantPos: { x: 16, y: 82 },
    brightness: 0.5,
  },
  {
    id: 5,
    title: "Temple Courtyard",
    subtitle: "Wake the sacred shrine",
    source: { x: 10, y: 70 },
    mirrors: [
      { id: "m1", pos: { x: 25, y: 70 }, misalignedRotation: -30, alignedRotation: 0 },
      { id: "m2", pos: { x: 42, y: 45 }, misalignedRotation: 35, alignedRotation: 0 },
      { id: "m3", pos: { x: 60, y: 65 }, misalignedRotation: -35, alignedRotation: 0 },
      { id: "m4", pos: { x: 78, y: 40 }, misalignedRotation: 30, alignedRotation: 0 },
    ],
    diyas: [
      { id: "d1", pos: { x: 25, y: 45 }, size: "sm" },
      { id: "d2", pos: { x: 42, y: 65 }, size: "sm" },
      { id: "d3", pos: { x: 60, y: 40 }, size: "md" },
      { id: "d4", pos: { x: 78, y: 60 }, size: "md" },
      { id: "d5", pos: { x: 90, y: 40 }, size: "lg" },
    ],
    elephantPos: { x: 16, y: 84 },
    brightness: 0.68,
  },
  {
    id: 6,
    title: "Grand Diwali Night",
    subtitle: "Restore the sacred flame",
    source: { x: 8, y: 60 },
    mirrors: [
      { id: "m1", pos: { x: 22, y: 60 }, misalignedRotation: 35, alignedRotation: 0 },
      { id: "m2", pos: { x: 38, y: 38 }, misalignedRotation: -30, alignedRotation: 0 },
      { id: "m3", pos: { x: 55, y: 58 }, misalignedRotation: 30, alignedRotation: 0 },
      { id: "m4", pos: { x: 72, y: 35 }, misalignedRotation: -35, alignedRotation: 0 },
    ],
    diyas: [
      { id: "d1", pos: { x: 22, y: 38 }, size: "sm" },
      { id: "d2", pos: { x: 38, y: 58 }, size: "sm" },
      { id: "d3", pos: { x: 55, y: 35 }, size: "md" },
      { id: "d4", pos: { x: 72, y: 58 }, size: "md" },
      { id: "d5", pos: { x: 88, y: 45 }, size: "lg" },
    ],
    elephantPos: { x: 14, y: 84 },
    brightness: 0.85,
  },
];

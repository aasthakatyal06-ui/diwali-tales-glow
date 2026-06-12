import type { LevelConfig } from "./types";

// Coordinate system: x/y are percentages of the stage (0-100).
// Beam path = source -> mirrors[0..n] -> diyas[0..m] in order.
// Later levels introduce decorative "obstacles" (stones/pots) to make
// the path feel earned without adding rule complexity.

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    title: "First Light",
    subtitle: "Tap the mirror to light the diya",
    source: { x: 18, y: 58 },
    mirrors: [
      { id: "m1", pos: { x: 45, y: 58 }, misalignedRotation: -35, alignedRotation: 0 },
    ],
    diyas: [{ id: "d1", pos: { x: 75, y: 58 }, size: "lg" }],
    elephantPos: { x: 82, y: 80 },
    hintMirrorId: "m1",
    brightness: 0.0,
  },
  {
    id: 2,
    title: "Festival Path",
    subtitle: "Light the way through the village",
    source: { x: 12, y: 48 },
    mirrors: [
      { id: "m1", pos: { x: 35, y: 48 }, misalignedRotation: 30, alignedRotation: 0 },
      { id: "m2", pos: { x: 60, y: 65 }, misalignedRotation: -25, alignedRotation: 0 },
    ],
    diyas: [
      { id: "d1", pos: { x: 35, y: 65 }, size: "sm" },
      { id: "d2", pos: { x: 60, y: 78 }, size: "md" },
      { id: "d3", pos: { x: 85, y: 65 }, size: "lg" },
    ],
    elephantPos: { x: 18, y: 82 },
    brightness: 0.12,
  },
  {
    id: 3,
    title: "Market Awakens",
    subtitle: "Wake up the sleepy stalls",
    source: { x: 10, y: 70 },
    mirrors: [
      { id: "m1", pos: { x: 30, y: 70 }, misalignedRotation: -40, alignedRotation: 0 },
      { id: "m2", pos: { x: 55, y: 50 }, misalignedRotation: 35, alignedRotation: 0 },
    ],
    diyas: [
      { id: "d1", pos: { x: 30, y: 50 }, size: "sm" },
      { id: "d2", pos: { x: 55, y: 72 }, size: "md" },
      { id: "d3", pos: { x: 78, y: 50 }, size: "md" },
      { id: "d4", pos: { x: 90, y: 70 }, size: "lg" },
    ],
    elephantPos: { x: 80, y: 84 },
    obstacles: [
      { id: "o1", pos: { x: 42, y: 65 }, kind: "pot" },
    ],
    brightness: 0.26,
  },
  {
    id: 4,
    title: "Lantern Grove",
    subtitle: "Slip past the sacred stones",
    source: { x: 8, y: 55 },
    mirrors: [
      { id: "m1", pos: { x: 27, y: 55 }, misalignedRotation: 30, alignedRotation: 0 },
      { id: "m2", pos: { x: 48, y: 42 }, misalignedRotation: -30, alignedRotation: 0 },
      { id: "m3", pos: { x: 70, y: 60 }, misalignedRotation: 30, alignedRotation: 0 },
    ],
    diyas: [
      { id: "d1", pos: { x: 27, y: 42 }, size: "sm" },
      { id: "d2", pos: { x: 48, y: 60 }, size: "sm" },
      { id: "d3", pos: { x: 70, y: 42 }, size: "md" },
      { id: "d4", pos: { x: 90, y: 60 }, size: "lg" },
    ],
    elephantPos: { x: 16, y: 84 },
    obstacles: [
      { id: "o1", pos: { x: 38, y: 52 }, kind: "stone" },
      { id: "o2", pos: { x: 60, y: 52 }, kind: "pot" },
    ],
    brightness: 0.42,
  },
  {
    id: 5,
    title: "Temple Courtyard",
    subtitle: "Wake the sacred shrine",
    source: { x: 8, y: 70 },
    mirrors: [
      { id: "m1", pos: { x: 24, y: 70 }, misalignedRotation: -30, alignedRotation: 0 },
      { id: "m2", pos: { x: 40, y: 50 }, misalignedRotation: 35, alignedRotation: 0 },
      { id: "m3", pos: { x: 58, y: 68 }, misalignedRotation: -35, alignedRotation: 0 },
      { id: "m4", pos: { x: 76, y: 48 }, misalignedRotation: 30, alignedRotation: 0 },
    ],
    diyas: [
      { id: "d1", pos: { x: 24, y: 50 }, size: "sm" },
      { id: "d2", pos: { x: 40, y: 68 }, size: "sm" },
      { id: "d3", pos: { x: 58, y: 48 }, size: "md" },
      { id: "d4", pos: { x: 76, y: 65 }, size: "md" },
      { id: "d5", pos: { x: 90, y: 48 }, size: "lg" },
    ],
    elephantPos: { x: 16, y: 86 },
    obstacles: [
      { id: "o1", pos: { x: 32, y: 60 }, kind: "stone" },
      { id: "o2", pos: { x: 50, y: 58 }, kind: "pot" },
      { id: "o3", pos: { x: 68, y: 58 }, kind: "stone" },
    ],
    brightness: 0.6,
  },
  {
    id: 6,
    title: "Grand Diwali Night",
    subtitle: "Restore the sacred flame",
    source: { x: 8, y: 62 },
    mirrors: [
      { id: "m1", pos: { x: 22, y: 62 }, misalignedRotation: 35, alignedRotation: 0 },
      { id: "m2", pos: { x: 36, y: 46 }, misalignedRotation: -30, alignedRotation: 0 },
      { id: "m3", pos: { x: 52, y: 62 }, misalignedRotation: 30, alignedRotation: 0 },
      { id: "m4", pos: { x: 68, y: 46 }, misalignedRotation: -35, alignedRotation: 0 },
      { id: "m5", pos: { x: 82, y: 62 }, misalignedRotation: 30, alignedRotation: 0 },
    ],
    diyas: [
      { id: "d1", pos: { x: 22, y: 46 }, size: "sm" },
      { id: "d2", pos: { x: 36, y: 62 }, size: "sm" },
      { id: "d3", pos: { x: 52, y: 46 }, size: "md" },
      { id: "d4", pos: { x: 68, y: 62 }, size: "md" },
      { id: "d5", pos: { x: 82, y: 46 }, size: "md" },
      { id: "d6", pos: { x: 92, y: 62 }, size: "lg" },
    ],
    elephantPos: { x: 13, y: 86 },
    obstacles: [
      { id: "o1", pos: { x: 29, y: 54 }, kind: "stone" },
      { id: "o2", pos: { x: 44, y: 54 }, kind: "pot" },
      { id: "o3", pos: { x: 60, y: 54 }, kind: "stone" },
      { id: "o4", pos: { x: 75, y: 54 }, kind: "pot" },
    ],
    brightness: 0.82,
  },
];

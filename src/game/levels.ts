import type { LevelConfig } from "./types";

// Coords: x/y are % of the stage (0-100). Diyas sit on the ground (y ~ 86-88).
// Elephant is placed off to the side on the ground row, sized small so it
// never covers a diya or mirror. Tutorial cards introduce each new mechanic
// the first time it appears (kid-friendly big font, dismisses with a tap).

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    title: "First Light",
    subtitle: "Tap the mirror to wake the diya",
    source: { x: 10, y: 42 },
    mirrors: [
      { id: "m1", pos: { x: 50, y: 42 }, misalignedRotation: -35, alignedRotation: 0 },
    ],
    diyas: [{ id: "d1", pos: { x: 50, y: 88 }, size: "lg" }],
    elephantPos: { x: 82, y: 100 },
    elephantSize: 150,
    hintMirrorId: "m1",
    brightness: 0.0,
    tutorial: {
      title: "Tap the shiny mirror!",
      body: "It will spin and send the light to the diya.",
    },
  },
  {
    id: 2,
    title: "Festival Path",
    subtitle: "Light the way through the village",
    source: { x: 6, y: 36 },
    mirrors: [
      { id: "m1", pos: { x: 32, y: 36 }, misalignedRotation: 30, alignedRotation: 0 },
      { id: "m2", pos: { x: 62, y: 36 }, misalignedRotation: -25, alignedRotation: 0 },
    ],
    diyas: [
      { id: "d1", pos: { x: 32, y: 88 }, size: "sm" },
      { id: "d2", pos: { x: 62, y: 86 }, size: "md" },
      { id: "d3", pos: { x: 88, y: 88 }, size: "lg" },
    ],
    elephantPos: { x: 14, y: 100 },
    elephantSize: 140,
    brightness: 0.12,
  },
  {
    id: 3,
    title: "Market Awakens",
    subtitle: "Wake up the sleepy stalls",
    source: { x: 5, y: 32 },
    mirrors: [
      { id: "m1", pos: { x: 26, y: 32 }, misalignedRotation: -40, alignedRotation: 0 },
      { id: "m2", pos: { x: 58, y: 32 }, misalignedRotation: 35, alignedRotation: 0 },
    ],
    diyas: [
      { id: "d1", pos: { x: 26, y: 86 }, size: "sm" },
      { id: "d2", pos: { x: 58, y: 88 }, size: "md" },
      { id: "d3", pos: { x: 78, y: 86 }, size: "md" },
      { id: "d4", pos: { x: 92, y: 88 }, size: "lg" },
    ],
    elephantPos: { x: 14, y: 100 },
    elephantSize: 140,
    obstacles: [{ id: "o1", pos: { x: 44, y: 78 }, kind: "pot" }],
    brightness: 0.26,
  },
  {
    id: 4,
    title: "Lantern Grove",
    subtitle: "Stones in the way? Tap them to push aside.",
    source: { x: 5, y: 30 },
    mirrors: [
      { id: "m1", pos: { x: 22, y: 30 }, misalignedRotation: 30, alignedRotation: 0, requiredTaps: 2 },
      { id: "m2", pos: { x: 48, y: 30 }, misalignedRotation: -30, alignedRotation: 0, requiredTaps: 2 },
      { id: "m3", pos: { x: 74, y: 30 }, misalignedRotation: 30, alignedRotation: 0, requiredTaps: 2 },
    ],
    diyas: [
      { id: "d1", pos: { x: 22, y: 88 }, size: "sm" },
      { id: "d2", pos: { x: 48, y: 86 }, size: "sm" },
      { id: "d3", pos: { x: 74, y: 88 }, size: "md" },
      { id: "d4", pos: { x: 92, y: 86 }, size: "lg" },
    ],
    elephantPos: { x: 12, y: 100 },
    elephantSize: 130,
    obstacles: [
      { id: "o1", pos: { x: 35, y: 30 }, kind: "stone", blocking: true },
      { id: "o2", pos: { x: 61, y: 30 }, kind: "pot", blocking: true },
    ],
    brightness: 0.42,
    tutorial: {
      title: "Push the stones aside!",
      body: "Tap any glowing stone or pot to clear the path. Some mirrors need TWO taps now!",
    },
  },
  {
    id: 5,
    title: "Temple Courtyard",
    subtitle: "Moving stones! Tap them as they slide.",
    source: { x: 4, y: 28 },
    mirrors: [
      { id: "m1", pos: { x: 18, y: 28 }, misalignedRotation: -30, alignedRotation: 0, requiredTaps: 2 },
      { id: "m2", pos: { x: 38, y: 28 }, misalignedRotation: 35, alignedRotation: 0, requiredTaps: 3 },
      { id: "m3", pos: { x: 58, y: 28 }, misalignedRotation: -35, alignedRotation: 0, requiredTaps: 2 },
      { id: "m4", pos: { x: 78, y: 28 }, misalignedRotation: 30, alignedRotation: 0, requiredTaps: 3 },
    ],
    diyas: [
      { id: "d1", pos: { x: 18, y: 88 }, size: "sm" },
      { id: "d2", pos: { x: 38, y: 86 }, size: "sm" },
      { id: "d3", pos: { x: 58, y: 88 }, size: "md" },
      { id: "d4", pos: { x: 78, y: 86 }, size: "md" },
      { id: "d5", pos: { x: 93, y: 88 }, size: "lg" },
    ],
    elephantPos: { x: 12, y: 100 },
    elephantSize: 130,
    obstacles: [
      { id: "o1", pos: { x: 28, y: 28 }, kind: "stone", blocking: true, moving: true, range: 6 },
      { id: "o2", pos: { x: 48, y: 28 }, kind: "pot", blocking: true },
      { id: "o3", pos: { x: 68, y: 28 }, kind: "stone", blocking: true, moving: true, range: 7 },
    ],
    brightness: 0.6,
    tutorial: {
      title: "Some stones move!",
      body: "Watch them slide back and forth — then tap to push them away.",
    },
  },
  {
    id: 6,
    title: "Grand Diwali Night",
    subtitle: "The last challenge — restore the festival!",
    source: { x: 4, y: 26 },
    mirrors: [
      // Mix of multi-tap, SPINNING (must time the tap), and moving obstacles.
      { id: "m1", pos: { x: 16, y: 26 }, misalignedRotation: 35, alignedRotation: 0, requiredTaps: 2 },
      { id: "m2", pos: { x: 34, y: 26 }, misalignedRotation: -30, alignedRotation: 0, spinning: true },
      { id: "m3", pos: { x: 52, y: 26 }, misalignedRotation: 30, alignedRotation: 0, requiredTaps: 3 },
      { id: "m4", pos: { x: 70, y: 26 }, misalignedRotation: -35, alignedRotation: 0, spinning: true },
      { id: "m5", pos: { x: 87, y: 26 }, misalignedRotation: 30, alignedRotation: 0, requiredTaps: 2 },
    ],
    diyas: [
      { id: "d1", pos: { x: 16, y: 88 }, size: "sm" },
      { id: "d2", pos: { x: 34, y: 86 }, size: "sm" },
      { id: "d3", pos: { x: 52, y: 88 }, size: "md" },
      { id: "d4", pos: { x: 70, y: 86 }, size: "md" },
      { id: "d5", pos: { x: 87, y: 88 }, size: "md" },
      { id: "d6", pos: { x: 95, y: 86 }, size: "lg" },
    ],
    elephantPos: { x: 8, y: 100 },
    elephantSize: 140,
    obstacles: [
      { id: "o1", pos: { x: 25, y: 26 }, kind: "stone", blocking: true, moving: true, range: 6 },
      { id: "o2", pos: { x: 43, y: 26 }, kind: "pot", blocking: true, moving: true, range: 5 },
      { id: "o3", pos: { x: 61, y: 26 }, kind: "stone", blocking: true, moving: true, range: 7 },
      { id: "o4", pos: { x: 78, y: 26 }, kind: "pot", blocking: true },
    ],
    brightness: 0.82,
    // No hand-holding badges this time — players figure it out.
    hideTapHints: true,
    tutorial: {
      title: "The final test!",
      body: "Some mirrors are spinning — tap them at JUST the right moment to lock the light. No hints this time. You can do it!",
    },
  },
];

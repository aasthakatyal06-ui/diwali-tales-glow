import type { LevelConfig } from "./types";

// Every mirror has 4 discrete rotations (90° apart) and exactly ONE is
// correct. Each mirror starts in a wrong position so the puzzle is never
// trivially solved. The light beam visibly overshoots past the first
// misaligned mirror, so the player can reason about WHICH mirror to fix.

export const LEVELS: LevelConfig[] = [
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
    elephantSize: 150,
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
    elephantSize: 140,
    brightness: 0.15,
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
    elephantSize: 200,
    hideTapHints: true,
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
    elephantSize: 190,
    obstacles: [
      { id: "o1", pos: { x: 28, y: 30 }, kind: "stone", blocking: true },
      { id: "o2", pos: { x: 49, y: 30 }, kind: "pot", blocking: true },
      { id: "o3", pos: { x: 71, y: 30 }, kind: "stone", blocking: true },
    ],
    hideTapHints: true,
    brightness: 0.42,
    tutorial: {
      title: "Stones in the way!",
      body: "Tap each glowing stone or pot to clear it. THEN solve the mirrors.",
    },
  },
  {
    id: 5,
    title: "Temple Courtyard",
    subtitle: "Five mirrors. Trace every ghost ray. No hints.",
    source: { x: 4, y: 28 },
    mirrors: [
      { id: "m1", pos: { x: 15, y: 28 }, orientations: 4, startIndex: 2, correctIndex: 0 },
      { id: "m2", pos: { x: 33, y: 28 }, orientations: 4, startIndex: 1, correctIndex: 0 },
      { id: "m3", pos: { x: 51, y: 28 }, orientations: 4, startIndex: 3, correctIndex: 0 },
      { id: "m4", pos: { x: 69, y: 28 }, orientations: 4, startIndex: 2, correctIndex: 0 },
      { id: "m5", pos: { x: 87, y: 28 }, orientations: 4, startIndex: 1, correctIndex: 0 },
    ],
    diyas: [
      { id: "d1", pos: { x: 33, y: 88 }, size: "sm" },
      { id: "d2", pos: { x: 51, y: 86 }, size: "sm" },
      { id: "d3", pos: { x: 69, y: 86 }, size: "md" },
      { id: "d4", pos: { x: 93, y: 88 }, size: "lg" },
    ],
    elephantPos: { x: 8, y: 100 },
    elephantSize: 190,
    obstacles: [
      { id: "o1", pos: { x: 24, y: 28 }, kind: "stone", blocking: true },
      { id: "o2", pos: { x: 42, y: 28 }, kind: "pot", blocking: true },
      { id: "o3", pos: { x: 60, y: 28 }, kind: "stone", blocking: true },
      { id: "o4", pos: { x: 78, y: 28 }, kind: "pot", blocking: true },
    ],
    hideTapHints: true,
    brightness: 0.6,
  },
  {
    id: 6,
    title: "Grand Diwali Night",
    subtitle: "Six mirrors, six obstacles. The real test.",
    source: { x: 4, y: 26 },
    mirrors: [
      { id: "m1", pos: { x: 13, y: 26 }, orientations: 4, startIndex: 1, correctIndex: 0 },
      { id: "m2", pos: { x: 28, y: 26 }, orientations: 4, startIndex: 3, correctIndex: 0 },
      { id: "m3", pos: { x: 43, y: 26 }, orientations: 4, startIndex: 2, correctIndex: 0 },
      { id: "m4", pos: { x: 58, y: 26 }, orientations: 4, startIndex: 1, correctIndex: 0 },
      { id: "m5", pos: { x: 73, y: 26 }, orientations: 4, startIndex: 3, correctIndex: 0 },
      { id: "m6", pos: { x: 88, y: 26 }, orientations: 4, startIndex: 2, correctIndex: 0 },
    ],
    diyas: [
      { id: "d1", pos: { x: 28, y: 88 }, size: "sm" },
      { id: "d2", pos: { x: 43, y: 86 }, size: "sm" },
      { id: "d3", pos: { x: 58, y: 86 }, size: "md" },
      { id: "d4", pos: { x: 73, y: 88 }, size: "md" },
      { id: "d5", pos: { x: 94, y: 86 }, size: "lg" },
    ],
    elephantPos: { x: 6, y: 100 },
    elephantSize: 200,
    obstacles: [
      { id: "o1", pos: { x: 20, y: 26 }, kind: "stone", blocking: true },
      { id: "o2", pos: { x: 35, y: 26 }, kind: "pot", blocking: true },
      { id: "o3", pos: { x: 50, y: 26 }, kind: "stone", blocking: true },
      { id: "o4", pos: { x: 65, y: 26 }, kind: "pot", blocking: true },
      { id: "o5", pos: { x: 80, y: 26 }, kind: "stone", blocking: true },
      { id: "o6", pos: { x: 51, y: 60 }, kind: "pot", blocking: true },
    ],
    brightness: 0.82,
    hideTapHints: true,
    tutorial: {
      title: "The final test!",
      body: "Follow each mirror's ghost ray. Plan the full chain BEFORE you tap.",
    },
  },
];

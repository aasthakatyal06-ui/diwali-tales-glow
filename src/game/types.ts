export interface Point {
  x: number;
  y: number;
}

export interface MirrorConfig {
  id: string;
  pos: Point;
  /** Number of discrete rotation positions the mirror can be in. Default 4. */
  orientations?: number;
  /** Index (0..orientations-1) the mirror starts in. Must not equal correctIndex. */
  startIndex: number;
  /** Index (0..orientations-1) that solves this mirror. */
  correctIndex: number;
  /** Mirror cannot be tapped until ALL of these mirrors are aligned. */
  lockedUntil?: string[];
}

export interface DiyaConfig {
  id: string;
  pos: Point;
  size?: "sm" | "md" | "lg";
}

export interface ObstacleConfig {
  id: string;
  pos: Point;
  kind: "stone" | "pot";
  blocking?: boolean;
  moving?: boolean;
  range?: number;
}

export interface LevelConfig {
  id: number;
  title: string;
  subtitle: string;
  source: Point;
  mirrors: MirrorConfig[];
  diyas: DiyaConfig[];
  elephantPos: Point;
  elephantSize?: number;
  obstacles?: ObstacleConfig[];
  hintMirrorId?: string;
  hintObstacleId?: string;
  tutorial?: { title: string; body: string };
  /** Hide on-screen tap badges. */
  hideTapHints?: boolean;
  /** How many reflections ahead the ghost ray is visible. Default: Infinity. */
  ghostRayRange?: number;
  brightness: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface MirrorConfig {
  id: string;
  pos: Point;
  misalignedRotation: number;
  alignedRotation: number;
  /** Number of taps required before this mirror locks aligned. Default 1. */
  requiredTaps?: number;
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
  /** When true the obstacle blocks the beam; player must tap it to clear. */
  blocking?: boolean;
  /** When true the obstacle slides left/right; player must tap to clear. */
  moving?: boolean;
  /** Horizontal travel distance in % of stage width (used when moving). */
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
  /** First-time tutorial card shown over the level (only when a new mechanic
   *  appears for the first time). Kid-friendly, big font. */
  tutorial?: { title: string; body: string };
  brightness: number;
}

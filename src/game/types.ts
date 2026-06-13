export interface Point {
  x: number;
  y: number;
}

export interface MirrorConfig {
  id: string;
  pos: Point;
  misalignedRotation: number;
  alignedRotation: number;
  /** Number of taps required before this mirror locks aligned. Default 1.
   *  Higher numbers create a puzzle: rotate through multiple positions
   *  to find the right one. */
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
  /** When true the obstacle blocks the beam; player must tap it to push it aside. */
  blocking?: boolean;
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
  brightness: number;
}

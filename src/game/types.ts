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
  /** When true the mirror spins continuously — player must tap it at the right
   *  moment (when it passes the aligned angle) to lock it. New for level 6. */
  spinning?: boolean;
  /** Splitter mirrors visually fan light into two paths. Gameplay-wise they
   *  still need to be aligned like any other mirror. */
  splitter?: boolean;

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
  tutorial?: { title: string; body: string };
  /** Hide on-screen tap badges (X more taps / Tap to move!). Used in the
   *  final level so the player has to figure out the puzzle themselves. */
  hideTapHints?: boolean;
  brightness: number;
}

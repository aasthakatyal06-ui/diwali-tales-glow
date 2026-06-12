export interface Point {
  x: number; // 0-100 (% of stage width)
  y: number; // 0-100 (% of stage height)
}

export interface MirrorConfig {
  id: string;
  pos: Point;
  // Mirror has two states: misaligned (tilt) and aligned (correct). Children only need to tap to align.
  misalignedRotation: number; // degrees
  alignedRotation: number; // degrees
}

export interface DiyaConfig {
  id: string;
  pos: Point;
  size?: "sm" | "md" | "lg";
}

export interface LevelConfig {
  id: number;
  title: string;
  subtitle: string;
  source: Point;
  // Beam path is source -> mirrors (in order) -> diyas (last diya is endpoint)
  mirrors: MirrorConfig[];
  diyas: DiyaConfig[];
  elephantPos: Point;
  // Pointer hint: which mirror to tap first
  hintMirrorId?: string;
  brightness: number; // 0-1, how much the village has woken up at level start
}

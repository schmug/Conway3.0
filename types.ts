export interface Cell {
  alive: boolean;
  color: string;
  id: number; // Used to track connected components or "pattern origin"
}

export type Grid = Cell[][];

export interface Pattern {
  name: string;
  grid: number[][]; // 0 or 1
  offsetX: number; // Center offset
  offsetY: number;
}

export interface GameState {
  grid: Grid;
  generation: number;
  score: number;
  highScore: number;
  patternsLeft: number;
  isRunning: boolean;
  isStable: boolean;
  stabilizationGeneration: number | null;
}

export interface Coordinate {
  x: number;
  y: number;
}
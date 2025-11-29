
export enum CellState {
  EMPTY = 0,
  OCCUPIED = 1,
  I = 2,
  J = 3,
  L = 4,
  O = 5,
  S = 6,
  T = 7,
  Z = 8,
}

export type Board = CellState[][];

export type TetrominoShape = CellState[][];

export interface Tetromino {
  shape: TetrominoShape[];
  color: string;
  type: CellState;
}

export interface Position {
  x: number;
  y: number;
}

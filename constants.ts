
import { CellState, Tetromino } from './types';

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export const INITIAL_DROP_SPEED = 500; // milliseconds

export const TETROMINOES: { [key: number]: Tetromino } = {
  // Fix: The shape for CellState.EMPTY needs to be a TetrominoShape[] (array of 2D arrays),
  // so [[0]] needs to be wrapped in another array to match TetrominoShape[].
  [CellState.EMPTY]: { shape: [[[0]]], color: 'bg-transparent', type: CellState.EMPTY },
  [CellState.I]: {
    shape: [
      [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
      [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]],
      [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0]],
      [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]],
    ],
    color: 'bg-cyan-400',
    type: CellState.I,
  },
  [CellState.J]: {
    shape: [
      [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
      [[0, 1, 1], [0, 1, 0], [0, 1, 0]],
      [[0, 0, 0], [1, 1, 1], [0, 0, 1]],
      [[0, 1, 0], [0, 1, 0], [1, 1, 0]],
    ],
    color: 'bg-blue-600',
    type: CellState.J,
  },
  [CellState.L]: {
    shape: [
      [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
      [[0, 1, 0], [0, 1, 0], [0, 1, 1]],
      [[0, 0, 0], [1, 1, 1], [1, 0, 0]],
      [[1, 1, 0], [0, 1, 0], [0, 1, 0]],
    ],
    color: 'bg-orange-500',
    type: CellState.L,
  },
  [CellState.O]: {
    shape: [
      [[1, 1], [1, 1]],
    ],
    color: 'bg-yellow-400',
    type: CellState.O,
  },
  [CellState.S]: {
    shape: [
      [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
      [[0, 1, 0], [0, 1, 1], [0, 0, 1]],
      [[0, 0, 0], [0, 1, 1], [1, 1, 0]],
      [[1, 0, 0], [1, 1, 0], [0, 1, 0]],
    ],
    color: 'bg-green-500',
    type: CellState.S,
  },
  [CellState.T]: {
    shape: [
      [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
      [[0, 1, 0], [0, 1, 1], [0, 1, 0]],
      [[0, 0, 0], [1, 1, 1], [0, 1, 0]],
      [[0, 1, 0], [1, 1, 0], [0, 1, 0]],
    ],
    color: 'bg-purple-500',
    type: CellState.T,
  },
  [CellState.Z]: {
    shape: [
      [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
      [[0, 0, 1], [0, 1, 1], [0, 1, 0]],
      [[0, 0, 0], [1, 1, 0], [0, 1, 1]],
      [[0, 1, 0], [1, 1, 0], [1, 0, 0]],
    ],
    color: 'bg-red-500',
    type: CellState.Z,
  },
};

export const TETROMINO_TYPES = [
  CellState.I,
  CellState.J,
  CellState.L,
  CellState.O,
  CellState.S,
  CellState.T,
  CellState.Z,
];

// Score calculation
export const LINE_CLEAR_SCORES = [0, 40, 100, 300, 1200];
export const LEVEL_UP_LINES = 10;
export const MAX_LEVEL = 20; // Cap level for speed

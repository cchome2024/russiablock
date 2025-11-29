
import React from 'react';
import { Tetromino, CellState } from '../types';
import { TETROMINOES } from '../constants';

interface TetrominoDisplayProps {
  tetromino: Tetromino | null;
  title: string;
}

const TetrominoDisplay: React.FC<TetrominoDisplayProps> = ({ tetromino, title }) => {
  const displaySize = tetromino ? tetromino.shape[0].length : 4; // Max 4x4 for 'I'
  const emptyShape = Array.from({ length: displaySize }, () =>
    Array.from({ length: displaySize }, () => CellState.EMPTY)
  );

  const displayShape = tetromino ? tetromino.shape[0] : emptyShape;

  return (
    <div className="flex flex-col items-center p-2 bg-gray-800 rounded-lg shadow-md border border-gray-700 w-full max-w-[10rem]">
      <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
      <div
        className="grid"
        style={{
          gridTemplateRows: `repeat(${displaySize}, minmax(0, 1rem))`,
          gridTemplateColumns: `repeat(${displaySize}, minmax(0, 1rem))`,
          width: `${displaySize * 1}rem`,
          height: `${displaySize * 1}rem`,
        }}
      >
        {displayShape.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              className={`
                w-4 h-4 border border-gray-700
                ${cell !== CellState.EMPTY ? TETROMINOES[tetromino?.type || CellState.EMPTY]?.color : 'bg-transparent'}
                ${cell !== CellState.EMPTY && 'shadow-inner'}
              `}
              style={{
                boxShadow: cell !== CellState.EMPTY ? 'inset 0 0 3px rgba(0,0,0,0.5)' : 'none',
              }}
            ></div>
          ))
        )}
      </div>
    </div>
  );
};

export default TetrominoDisplay;

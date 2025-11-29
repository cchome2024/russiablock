
import React from 'react';
import { Board, CellState } from '../types';
import { TETROMINOES } from '../constants';

interface BoardProps {
  board: Board;
}

const Board: React.FC<BoardProps> = ({ board }) => {
  return (
    <div
      className="grid border-2 border-gray-700 bg-gray-900 shadow-lg"
      style={{
        gridTemplateRows: `repeat(${board.length}, minmax(0, 1.5rem))`, // Each row 1.5rem high
        gridTemplateColumns: `repeat(${board[0].length}, minmax(0, 1.5rem))`, // Each column 1.5rem wide
        width: `${board[0].length * 1.5}rem`,
        height: `${board.length * 1.5}rem`,
      }}
    >
      {board.map((row, y) =>
        row.map((cell, x) => (
          <div
            key={`${y}-${x}`}
            className={`
              w-6 h-6 border border-gray-800 transition-colors duration-75 ease-in-out
              ${TETROMINOES[cell]?.color || 'bg-transparent'}
              ${cell !== CellState.EMPTY && 'shadow-inner'}
            `}
            style={{
                // Add an inner shadow to give depth to occupied cells
                boxShadow: cell !== CellState.EMPTY ? 'inset 0 0 5px rgba(0,0,0,0.5)' : 'none',
            }}
          ></div>
        ))
      )}
    </div>
  );
};

export default Board;

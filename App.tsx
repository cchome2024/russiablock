
import React, { useEffect, useCallback } from 'react';
import useGameLogic from './hooks/useGameLogic';
import Board from './components/Board';
import TetrominoDisplay from './components/TetrominoDisplay';

function App() {
  const {
    board,
    nextTetromino,
    score,
    level,
    gameOver,
    isPaused,
    startGame,
    pauseGame,
    resetGame,
    moveTetromino,
    rotateTetromino,
  } = useGameLogic();

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (gameOver || isPaused) return;

      switch (e.key) {
        case 'ArrowLeft':
          moveTetromino('left');
          break;
        case 'ArrowRight':
          moveTetromino('right');
          break;
        case 'ArrowDown':
          moveTetromino('down');
          break;
        case 'ArrowUp':
          rotateTetromino();
          break;
        case ' ': // Spacebar
          // TODO: Implement hard drop later if desired
          // For now, spacebar could be pause/unpause if game is not over
          break;
      }
    },
    [gameOver, isPaused, moveTetromino, rotateTetromino],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 text-white">
      <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-8 drop-shadow-lg">
        React Tetris
      </h1>

      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        {/* Game Area */}
        <div className="relative">
          <Board board={board} />
          {(gameOver || isPaused) && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center flex-col p-4 rounded-lg">
              {gameOver && (
                <p className="text-3xl font-bold text-red-500 animate-pulse mb-4">GAME OVER!</p>
              )}
              {isPaused && !gameOver && (
                <p className="text-3xl font-bold text-yellow-400 animate-bounce mb-4">PAUSED</p>
              )}
              <button
                onClick={gameOver ? resetGame : pauseGame}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg font-semibold rounded-full shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105"
              >
                {gameOver ? 'RESTART' : 'RESUME'}
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6 w-full md:w-auto max-w-xs p-4 bg-gray-800 rounded-xl shadow-2xl border-2 border-gray-700">
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">SCORE:</h2>
            <p className="text-5xl font-mono font-bold text-yellow-300 mb-6">{score}</p>

            <h2 className="text-xl font-bold mb-2 text-cyan-400">LEVEL:</h2>
            <p className="text-3xl font-mono font-bold text-green-400 mb-6">{level}</p>

            <TetrominoDisplay tetromino={nextTetromino} title="NEXT" />
          </div>

          <div className="flex flex-col gap-3 mt-4">
            {!gameOver && (
              <button
                onClick={startGame}
                disabled={!isPaused && !gameOver}
                className={`w-full py-3 rounded-full text-lg font-semibold shadow-md focus:outline-none transition-all duration-300 transform hover:scale-105
                  ${!isPaused && !gameOver
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50'
                  }
                `}
              >
                START GAME
              </button>
            )}

            {!gameOver && (
              <button
                onClick={pauseGame}
                disabled={isPaused}
                className={`w-full py-3 rounded-full text-lg font-semibold shadow-md focus:outline-none transition-all duration-300 transform hover:scale-105
                  ${isPaused
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-50'
                  }
                `}
              >
                PAUSE
              </button>
            )}

            <button
              onClick={resetGame}
              className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white text-lg font-semibold rounded-full shadow-md hover:from-red-600 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105"
            >
              RESET
            </button>
          </div>

          <div className="mt-6 p-3 bg-gray-700 rounded-lg text-sm text-center text-gray-300">
            <p className="font-bold mb-1">CONTROLS:</p>
            <p>← → ↓ : Move Tetromino</p>
            <p>↑ : Rotate Tetromino</p>
            <p>SPACE : Hard Drop (WIP)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

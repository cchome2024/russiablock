
import { useState, useEffect, useCallback, useRef } from 'react';
import { Board, CellState, Tetromino, Position } from '../types';
import { BOARD_WIDTH, BOARD_HEIGHT, TETROMINOES, TETROMINO_TYPES, INITIAL_DROP_SPEED, LINE_CLEAR_SCORES, LEVEL_UP_LINES, MAX_LEVEL } from '../constants';

// Helper function to create an empty game board
const createEmptyBoard = (): Board =>
  Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => CellState.EMPTY)
  );

// Helper function to get a random tetromino
const getRandomTetromino = (): Tetromino => {
  const randomIndex = Math.floor(Math.random() * TETROMINO_TYPES.length);
  const type = TETROMINO_TYPES[randomIndex];
  return TETROMINOES[type];
};

const useGameLogic = () => {
  const [board, setBoard] = useState<Board>(createEmptyBoard);
  const [currentTetromino, setCurrentTetromino] = useState<Tetromino | null>(null);
  const [currentPosition, setCurrentPosition] = useState<Position>({ x: 0, y: 0 });
  const [currentRotation, setCurrentRotation] = useState(0);
  const [nextTetromino, setNextTetromino] = useState<Tetromino | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [linesCleared, setLinesCleared] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  const dropTimeRef = useRef<number | null>(null); // Use ref for mutable dropTime
  const intervalIdRef = useRef<number | null>(null);

  // Calculate current drop speed based on level
  const currentDropSpeed = INITIAL_DROP_SPEED - (level - 1) * 30; // Speed up by 30ms per level

  const checkCollision = useCallback(
    (shape: CellState[][], pos: Position, boardToCheck: Board): boolean => {
      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          if (shape[y][x] !== CellState.EMPTY) {
            const boardY = pos.y + y;
            const boardX = pos.x + x;

            // Check if outside board boundaries
            if (boardY < 0 || boardY >= BOARD_HEIGHT || boardX < 0 || boardX >= BOARD_WIDTH) {
              return true;
            }
            // Check if colliding with an occupied cell on the board
            if (boardToCheck[boardY] && boardToCheck[boardY][boardX] !== CellState.EMPTY) {
              return true;
            }
          }
        }
      }
      return false;
    },
    [],
  );

  const mergeTetromino = useCallback(
    (boardToMerge: Board, tetromino: Tetromino, position: Position, rotation: number): Board => {
      const newBoard = boardToMerge.map((row) => [...row]); // Deep copy
      const tetrominoShape = tetromino.shape[rotation];

      for (let y = 0; y < tetrominoShape.length; y++) {
        for (let x = 0; x < tetrominoShape[y].length; x++) {
          if (tetrominoShape[y][x] !== CellState.EMPTY) {
            newBoard[position.y + y][position.x + x] = tetromino.type;
          }
        }
      }
      return newBoard;
    },
    [],
  );

  const clearLines = useCallback(
    (boardToClear: Board): { newBoard: Board; linesRemoved: number } => {
      let linesRemoved = 0;
      const newBoard = boardToClear.filter((row) =>
        row.some((cell) => cell === CellState.EMPTY)
      );

      linesRemoved = BOARD_HEIGHT - newBoard.length;

      // Add new empty rows to the top
      while (newBoard.length < BOARD_HEIGHT) {
        newBoard.unshift(Array.from({ length: BOARD_WIDTH }, () => CellState.EMPTY));
      }
      return { newBoard, linesRemoved };
    },
    [],
  );

  const updateScoreAndLevel = useCallback(
    (lines: number) => {
      if (lines === 0) return;
      setScore((prev) => prev + LINE_CLEAR_SCORES[lines] * level);
      setLinesCleared((prev) => {
        const newTotalLines = prev + lines;
        if (newTotalLines >= level * LEVEL_UP_LINES && level < MAX_LEVEL) {
          setLevel((prevLevel) => prevLevel + 1);
        }
        return newTotalLines;
      });
    },
    [level],
  );

  const spawnTetromino = useCallback(() => {
    const newTet = nextTetromino || getRandomTetromino();
    const startPosition: Position = { x: Math.floor(BOARD_WIDTH / 2) - Math.floor(newTet.shape[0].length / 2), y: 0 };

    if (checkCollision(newTet.shape[0], startPosition, board)) {
      setGameOver(true);
      setIsPaused(true);
      return;
    }

    setCurrentTetromino(newTet);
    setCurrentPosition(startPosition);
    setCurrentRotation(0);
    setNextTetromino(getRandomTetromino());
  }, [board, nextTetromino, checkCollision]);

  const dropTetromino = useCallback(() => {
    if (gameOver || isPaused || !currentTetromino) return;

    const newPos = { ...currentPosition, y: currentPosition.y + 1 };
    if (!checkCollision(currentTetromino.shape[currentRotation], newPos, board)) {
      setCurrentPosition(newPos);
    } else {
      // Collision detected, lock tetromino
      const mergedBoard = mergeTetromino(board, currentTetromino, currentPosition, currentRotation);
      const { newBoard: clearedBoard, linesRemoved } = clearLines(mergedBoard);

      setBoard(clearedBoard);
      updateScoreAndLevel(linesRemoved);

      // Spawn a new tetromino
      spawnTetromino();
    }
  }, [
    board,
    currentTetromino,
    currentPosition,
    currentRotation,
    gameOver,
    isPaused,
    checkCollision,
    mergeTetromino,
    clearLines,
    updateScoreAndLevel,
    spawnTetromino,
  ]);

  const moveTetromino = useCallback(
    (dir: 'left' | 'right' | 'down') => {
      if (gameOver || isPaused || !currentTetromino) return;

      let newPos = { ...currentPosition };
      switch (dir) {
        case 'left':
          newPos.x -= 1;
          break;
        case 'right':
          newPos.x += 1;
          break;
        case 'down':
          newPos.y += 1;
          break;
      }

      if (!checkCollision(currentTetromino.shape[currentRotation], newPos, board)) {
        setCurrentPosition(newPos);
        if (dir === 'down') {
          dropTimeRef.current = Date.now(); // Reset drop timer on manual down move
        }
      } else if (dir === 'down') {
        // Collision on manual down, lock tetromino
        const mergedBoard = mergeTetromino(board, currentTetromino, currentPosition, currentRotation);
        const { newBoard: clearedBoard, linesRemoved } = clearLines(mergedBoard);

        setBoard(clearedBoard);
        updateScoreAndLevel(linesRemoved);
        spawnTetromino();
      }
    },
    [
      gameOver,
      isPaused,
      currentTetromino,
      currentPosition,
      currentRotation,
      board,
      checkCollision,
      mergeTetromino,
      clearLines,
      updateScoreAndLevel,
      spawnTetromino,
    ],
  );

  const rotateTetromino = useCallback(() => {
    if (gameOver || isPaused || !currentTetromino) return;

    const nextRotation = (currentRotation + 1) % currentTetromino.shape.length;
    // Simple wall kick logic (try to move left/right if rotation collides)
    const kicks = [0, -1, 1, -2, 2]; // offsets to try for wall kicks
    for (const kick of kicks) {
      const newPos: Position = { x: currentPosition.x + kick, y: currentPosition.y };
      if (!checkCollision(currentTetromino.shape[nextRotation], newPos, board)) {
        setCurrentRotation(nextRotation);
        setCurrentPosition(newPos);
        return;
      }
    }
  }, [gameOver, isPaused, currentTetromino, currentPosition, currentRotation, board, checkCollision]);

  // Game Loop
  useEffect(() => {
    if (gameOver || isPaused) {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
      return;
    }

    const gameLoop = () => {
      if (dropTimeRef.current === null) {
        dropTimeRef.current = Date.now();
      }

      const now = Date.now();
      const delta = now - dropTimeRef.current;

      if (delta > currentDropSpeed) {
        dropTetromino();
        dropTimeRef.current = now;
      }
    };

    // Clear existing interval before setting a new one, important for speed changes
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }
    intervalIdRef.current = window.setInterval(gameLoop, currentDropSpeed / 20); // Check more frequently than drop speed

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [gameOver, isPaused, dropTetromino, currentDropSpeed]);


  // Initialize game on start or reset
  const startGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setCurrentTetromino(null); // Will be spawned by useEffect
    setCurrentPosition({ x: 0, y: 0 });
    setCurrentRotation(0);
    setNextTetromino(getRandomTetromino()); // Pre-load next
    setScore(0);
    setLevel(1);
    setLinesCleared(0);
    setGameOver(false);
    setIsPaused(false);
    dropTimeRef.current = Date.now();
  }, []);

  const pauseGame = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const resetGame = useCallback(() => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }
    startGame();
  }, [startGame]);

  // Initial spawn when game starts or a new game is initiated
  useEffect(() => {
    if (!currentTetromino && !gameOver && !isPaused) {
      spawnTetromino();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTetromino, gameOver, isPaused]); // Only run when currentTetromino is null (needs spawn)

  // Combined board for rendering: static blocks + active tetromino
  const drawBoard = useCallback(() => {
    const newBoard = board.map((row) => [...row]); // Start with the static board
    if (currentTetromino && !gameOver && !isPaused) {
      const tetrominoShape = currentTetromino.shape[currentRotation];
      for (let y = 0; y < tetrominoShape.length; y++) {
        for (let x = 0; x < tetrominoShape[y].length; x++) {
          if (tetrominoShape[y][x] !== CellState.EMPTY) {
            const boardY = currentPosition.y + y;
            const boardX = currentPosition.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              newBoard[boardY][boardX] = currentTetromino.type;
            }
          }
        }
      }
    }
    return newBoard;
  }, [board, currentTetromino, currentPosition, currentRotation, gameOver, isPaused]);

  return {
    board: drawBoard(),
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
  };
};

export default useGameLogic;

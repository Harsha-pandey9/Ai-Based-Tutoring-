import { useState, useEffect } from "react";

const rows = 5;
const cols = 5;
const minesCount = 5;

function createBoard() {
  let board = Array(rows)
    .fill()
    .map(() => Array(cols).fill({ revealed: false, mine: false }));

  let minesPlaced = 0;
  while (minesPlaced < minesCount) {
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * cols);
    if (!board[r][c].mine) {
      board[r][c] = { ...board[r][c], mine: true };
      minesPlaced++;
    }
  }
  return board;
}

export default function Minesweeper() {
  const [board, setBoard] = useState(createBoard());
  const [gameOver, setGameOver] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [highScore, setHighScore] = useState(() => localStorage.getItem("minesHigh") || 0);
  const [startTime, setStartTime] = useState(Date.now());
  const [timeTaken, setTimeTaken] = useState(0);

  const revealCell = (r, c) => {
    if (gameOver || board[r][c].revealed) return;
    let newBoard = [...board];
    newBoard[r][c] = { ...newBoard[r][c], revealed: true };
    setRevealedCount(revealedCount + 1);

    if (newBoard[r][c].mine) {
      setGameOver(true);
      setAttempts(attempts + 1);
    }
    setBoard(newBoard);
  };

  const resetGame = () => {
    setBoard(createBoard());
    setGameOver(false);
    setRevealedCount(0);
    setStartTime(Date.now());
  };

  const totalSafeCells = rows * cols - minesCount;
  const isWin = revealedCount === totalSafeCells && !gameOver;

  useEffect(() => {
    if (isWin) {
      let score = Math.max(0, 100 - Math.floor((Date.now() - startTime) / 1000));
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("minesHigh", score);
      }
      setTimeTaken(Math.floor((Date.now() - startTime) / 1000));
    }
  }, [isWin]);

  return (
    <div className="p-6 text-center bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl shadow-lg max-w-md mx-auto">
      {/* Score Card */}
      <div className="flex justify-between mb-3 p-3 bg-white/50 rounded-lg backdrop-blur shadow">
        <p className="font-bold">Attempts: {attempts}</p>
        <p className="font-bold">High Score: {highScore}</p>
        <p className="font-bold">Time: {Math.floor((Date.now() - startTime) / 1000)}s</p>
      </div>

      <h2 className="text-3xl font-bold mb-4 text-purple-700">Minesweeper</h2>
      <div className="grid grid-cols-5 gap-2 w-max mx-auto">
        {board.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              onClick={() => revealCell(r, c)}
              className={`w-12 h-12 flex items-center justify-center rounded-lg font-bold transition-all 
                ${
                  cell.revealed
                    ? cell.mine
                      ? "bg-red-500 text-white scale-110"
                      : "bg-green-400 text-white scale-105"
                    : "bg-gray-200 hover:bg-gray-300 shadow-md hover:scale-105"
                }`}
            >
              {cell.revealed && (cell.mine ? "💣" : "✅")}
            </button>
          ))
        )}
      </div>

      {gameOver && (
        <div className="mt-4">
          <p className="text-red-600 font-bold text-xl animate-bounce">💥 Game Over!</p>
          <button
            onClick={resetGame}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            🔄 Try Again
          </button>
        </div>
      )}

      {isWin && (
        <div className="mt-4">
          <p className="text-green-600 font-bold text-xl animate-pulse">
            🎉 You Win! Time: {timeTaken}s
          </p>
          <button
            onClick={resetGame}
            className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
          >
            🔄 Play Again
          </button>
        </div>
      )}
    </div>
  );
}

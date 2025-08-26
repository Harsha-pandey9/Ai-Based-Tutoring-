import { useState, useEffect } from "react";

export default function WhacAMole() {
  const [moleIndex, setMoleIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(() => localStorage.getItem("moleHigh") || 0);
  const [timeLeft, setTimeLeft] = useState(20); // 20 sec game

  useEffect(() => {
    if (gameOver) return;

    const moleInterval = setInterval(() => {
      setMoleIndex(Math.floor(Math.random() * 9));
    }, 800);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem("moleHigh", score);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(moleInterval);
      clearInterval(timer);
    };
  }, [gameOver]);

  const hitMole = (index) => {
    if (index === moleIndex) {
      setScore(score + 1);
      setMoleIndex(null);
    }
  };

  const resetGame = () => {
    setScore(0);
    setGameOver(false);
    setMoleIndex(null);
    setTimeLeft(20);
  };

  return (
    <div className="p-6 text-center bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl shadow-lg max-w-lg mx-auto">
      {/* Score Card */}
      <div className="flex justify-between mb-3 p-3 bg-white/60 rounded-lg backdrop-blur shadow">
        <p className="font-bold">Score: {score}</p>
        <p className="font-bold">High Score: {highScore}</p>
        <p className="font-bold">Time Left: {timeLeft}s</p>
      </div>

      <h2 className="text-3xl font-bold mb-3 text-pink-700">Whac-A-Mole</h2>
      <div className="grid grid-cols-3 gap-4 w-max mx-auto">
        {Array.from({ length: 9 }).map((_, i) => (
          <button
            key={i}
            onClick={() => hitMole(i)}
            disabled={gameOver}
            className={`w-24 h-24 rounded-full transition-all border-4 shadow-lg 
              ${i === moleIndex ? "bg-yellow-400 animate-bounce" : "bg-gray-300 hover:bg-gray-400"}`}
          >
            {i === moleIndex ? "🐹" : ""}
          </button>
        ))}
      </div>

      {gameOver && (
        <div className="mt-4">
          <p className="text-red-600 font-bold text-xl animate-bounce">
            💥 Time Up! Final Score: {score}
          </p>
          <button
            onClick={resetGame}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            🔄 Play Again
          </button>
        </div>
      )}
    </div>
  );
}

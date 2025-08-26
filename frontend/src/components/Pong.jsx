import { useEffect, useRef, useState } from "react";

export default function Pong() {
  const canvasRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => localStorage.getItem("pongHigh") || 0);
  const [lives, setLives] = useState(3);
  const [resetKey, setResetKey] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let ball = { x: 200, y: 150, dx: 2, dy: 2, radius: 10 };
    let paddle = { x: 150, y: 280, w: 100, h: 12 };
    let frame;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background Gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#2563eb");
      gradient.addColorStop(1, "#9333ea");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Paddle
      ctx.fillStyle = "#facc15";
      ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);

      // Ball
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = "#ef4444";
      ctx.fill();

      // Movement
      ball.x += ball.dx;
      ball.y += ball.dy;

      // Wall bounce
      if (ball.x < ball.radius || ball.x > canvas.width - ball.radius) ball.dx *= -1;
      if (ball.y < ball.radius) {
        ball.dy *= -1;
        setScore((prev) => prev + 5);
      }

      // Paddle collision
      if (
        ball.y + ball.radius > paddle.y &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.w
      ) {
        ball.dy *= -1;
        setScore((prev) => prev + 10);
      }

      // Lose Life
      if (ball.y > canvas.height) {
        setLives((prev) => prev - 1);
        if (lives - 1 <= 0) {
          setGameOver(true);
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem("pongHigh", score);
          }
          return;
        }
        ball = { x: 200, y: 150, dx: 2, dy: 2, radius: 10 };
      }

      frame = requestAnimationFrame(draw);
    }
    draw();

    function movePaddle(e) {
      if (e.key === "ArrowLeft") paddle.x -= 25;
      if (e.key === "ArrowRight") paddle.x += 25;
    }
    window.addEventListener("keydown", movePaddle);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", movePaddle);
    };
  }, [resetKey]);

  const resetGame = () => {
    setResetKey(resetKey + 1);
    setGameOver(false);
    setScore(0);
    setLives(3);
    setStartTime(Date.now());
  };

  return (
    <div className="p-6 text-center">
      {/* Score Card */}
      <div className="flex justify-between mb-3 p-3 bg-white/60 rounded-lg backdrop-blur shadow max-w-md mx-auto">
        <p className="font-bold">Score: {score}</p>
        <p className="font-bold">High Score: {highScore}</p>
        <p className="font-bold">Lives: {lives}</p>
        <p className="font-bold">Time: {Math.floor((Date.now() - startTime) / 1000)}s</p>
      </div>

      <h2 className="text-3xl font-bold mb-4 text-blue-700">Pong Game</h2>
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className="rounded-lg shadow-2xl border-4 border-yellow-400 mx-auto"
      ></canvas>
      <p className="text-gray-700 mt-3">🎮 Use ← and → arrow keys to move paddle</p>

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
    </div>
  );
}

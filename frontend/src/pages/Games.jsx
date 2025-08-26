import { Link } from "react-router-dom";
import { FaBomb, FaTableTennis, FaMousePointer } from "react-icons/fa";

export default function Games() {
  const games = [
    { name: "Minesweeper", icon: <FaBomb />, path: "/games/minesweeper", color: "from-red-500 to-pink-500" },
    { name: "Pong", icon: <FaTableTennis />, path: "/games/pong", color: "from-green-500 to-emerald-500" },
    { name: "Whac-a-Mole", icon: <FaMousePointer />, path: "/games/whac-a-mole", color: "from-blue-500 to-indigo-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black p-8 text-white">
      <h2 className="text-4xl sm:text-5xl font-extrabold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-500">
        Play & Learn: Games Arena
      </h2>

      <div className="grid gap-6 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 max-w-5xl mx-auto">
        {games.map((game, index) => (
          <Link
            key={index}
            to={game.path}
            className={`rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-gradient-to-tr ${game.color} hover:scale-105 hover:shadow-xl transform transition duration-300 ease-in-out`}
          >
            <div className="text-5xl mb-4">{game.icon}</div>
            <h3 className="text-xl font-semibold">{game.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}

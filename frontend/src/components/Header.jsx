import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";
import {
  FaGamepad, 
  FaRocket, 
  FaBars, 
  FaTimes, 
  FaMoon, 
  FaSun,
  FaCode,
  FaBrain,
  FaChartLine,
  FaFileAlt,
  FaMicrophone,
  FaGraduationCap
} from "react-icons/fa";

export default function Header() {
  const { isSignedIn } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const navigationItems = [
    { name: "Home", path: "/" },
    { name: "Coding Playground", path: "/coding-playground" },
    { name: "Mock Interview", path: "/mock-interview" },
    { name: "Test Series", path: "/test-series" },
    { name: "Aptitude", path: "/aptitude" },
    { name: "Progress", path: "/progress" },
    { name: "Games", path: "/games" },
    { name: "About", path: "/about" },
  ];

  const NavLinks = () => (
    <>
      {navigationItems.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          onClick={closeMenu}
          className="px-4 py-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 font-medium"
        >
          {item.name}
        </Link>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-slate-800 via-stone-800 to-amber-800 dark:from-slate-900 dark:via-stone-900 dark:to-amber-900 shadow-xl border-b border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          
          {/* Simple Animated ALPHA-X Logo */}
          <Link to="/" className="group flex items-center">
            <div className="relative">
              <h1 className="text-3xl font-black text-transparent bg-gradient-to-r from-amber-300 via-orange-300 to-red-300 bg-clip-text animate-pulse">
                ALPHA-X
              </h1>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 group-hover:w-full transition-all duration-500"></div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            <NavLinks />
            
            {/* User Button */}
            {isSignedIn && (
              <div className="ml-4 flex items-center">
                <UserButton 
                  afterSignOutUrl="/login"
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10 rounded-full border-2 border-white/20 hover:border-white/40 transition-all duration-200"
                    }
                  }}
                />
              </div>
            )}
            
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="ml-4 p-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              title="Toggle theme"
            >
              {theme === "light" ? <FaMoon className="text-lg" /> : <FaSun className="text-lg" />}
            </button>
          </nav>

          {/* Mobile Controls */}
          <div className="lg:hidden flex items-center gap-3">
            {/* User Button for Mobile */}
            {isSignedIn && (
              <UserButton 
                afterSignOutUrl="/login"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 rounded-full border-2 border-white/20"
                  }
                }}
              />
            )}
            
            {/* Theme Toggle for Mobile */}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              title="Toggle theme"
            >
              {theme === "light" ? <FaMoon /> : <FaSun />}
            </button>
            
            {/* Hamburger Menu */}
            <button
              onClick={toggleMenu}
              className="p-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-slate-900/95 dark:bg-black/95 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <nav className="flex flex-col gap-2">
              {navigationItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  onClick={closeMenu}
                  className="px-4 py-3 text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
// src/components/FloatingChatButton.jsx
import React, { useState } from "react";
import { BsRobot } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";
import Chat from "./Chat";

const FloatingChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 bg-gradient-to-r from-slate-600 to-amber-600 hover:from-slate-700 hover:to-amber-700 text-white p-5 rounded-full shadow-2xl z-50 transition-all duration-300 transform hover:scale-110 ${
          isOpen ? 'rotate-180' : 'rotate-0'
        }`}
        aria-label="Toggle AI Chat"
      >
        {isOpen ? (
          <FaTimes className="text-2xl" />
        ) : (
          <BsRobot className="text-2xl" />
        )}
      </button>

      {/* Enhanced Chat Box */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-20 z-30 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Chat Container */}
          <div className="fixed bottom-20 right-4 w-[95vw] sm:w-[85vw] md:w-[600px] lg:w-[700px] h-[80vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl z-40 overflow-hidden border border-slate-200 dark:border-slate-700 transform transition-all duration-300 scale-100">
            <Chat onClose={() => setIsOpen(false)} />
          </div>
        </>
      )}
    </>
  );
};

export default FloatingChatButton;
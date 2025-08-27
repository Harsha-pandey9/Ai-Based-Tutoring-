import React from 'react';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-amber-50 dark:from-slate-900 dark:via-stone-900 dark:to-amber-900 flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="relative mx-auto w-24 h-24 mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-full shadow-2xl flex items-center justify-center border-4 border-white/30 animate-pulse">
            <div className="text-center">
              <div className="text-2xl font-black text-white mb-1">A</div>
              <div className="text-xs font-bold text-white/90 tracking-wider">ALPHA</div>
            </div>
          </div>
          
          {/* Floating X */}
          <div className="absolute top-1 right-1 w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full shadow-lg flex items-center justify-center animate-bounce">
            <span className="text-white font-bold text-sm">X</span>
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-slate-700 to-amber-700 bg-clip-text text-transparent">
          {message}
        </h2>
        
        {/* Loading Dots */}
        <div className="flex justify-center space-x-2 mb-8">
          <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>

        {/* Progress Bar */}
        <div className="w-64 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full animate-pulse"></div>
        </div>
        
        <p className="text-slate-600 dark:text-slate-400 mt-4 text-sm">
          Please wait while we load your content...
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
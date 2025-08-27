import React from 'react';
import { useNavigate } from 'react-router-dom';

const ComponentFallback = ({ componentName = 'Component', error = null }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🚧</div>
          <h1 className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-4">
            {componentName} Temporarily Unavailable
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            This feature is currently experiencing issues. We're working to fix it!
          </p>
          
          {error && (
            <details className="text-left bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
              <summary className="cursor-pointer font-semibold text-orange-600 dark:text-orange-400 mb-2">
                Technical Details
              </summary>
              <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-auto">
                {error.toString()}
              </pre>
            </details>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors duration-200"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200"
            >
              Go to Home
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentFallback;
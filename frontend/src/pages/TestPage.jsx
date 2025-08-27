import React from 'react';
import { useLocation } from 'react-router-dom';

const TestPage = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <h1 className="text-4xl font-bold text-green-600 dark:text-green-400 mb-6">
            ✅ Test Page Working!
          </h1>
          
          <div className="space-y-4">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              If you can see this page, routing is working correctly.
            </p>
            
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Current Route Info:</h3>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li><strong>Pathname:</strong> {location.pathname}</li>
                <li><strong>Search:</strong> {location.search || 'None'}</li>
                <li><strong>Hash:</strong> {location.hash || 'None'}</li>
                <li><strong>Full URL:</strong> {window.location.href}</li>
              </ul>
            </div>

            <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Environment Info:</h3>
              <ul className="space-y-1 text-sm text-blue-600 dark:text-blue-400">
                <li><strong>Mode:</strong> {import.meta.env.MODE}</li>
                <li><strong>API URL:</strong> {import.meta.env.VITE_API_URL || 'Not set'}</li>
                <li><strong>Base URL:</strong> {import.meta.env.BASE_URL}</li>
              </ul>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Go Back
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
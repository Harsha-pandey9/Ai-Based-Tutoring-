import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';

const BackendTest = () => {
  const [testResults, setTestResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const testEndpoint = async (name, url, options = {}) => {
    try {
      const startTime = Date.now();
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers: options.headers || {},
        body: options.body || null,
        ...options
      });
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      setTestResults(prev => ({
        ...prev,
        [name]: {
          status: 'success',
          data,
          responseTime,
          timestamp: new Date().toISOString()
        }
      }));
      
      return data;
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [name]: {
          status: 'error',
          error: error.message,
          timestamp: new Date().toISOString()
        }
      }));
      return null;
    }
  };

  const runAllTests = async () => {
    setIsLoading(true);
    setTestResults({});
    
    // Test basic health check
    await testEndpoint('Health Check', API_ENDPOINTS.HEALTH);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Test API endpoint
    await testEndpoint('API Test', `${API_ENDPOINTS.HEALTH}api/test`);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Test stats endpoint
    await testEndpoint('Stats', API_ENDPOINTS.STATS);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Test aptitude leaderboard
    await testEndpoint('Aptitude Leaderboard', API_ENDPOINTS.GET_APTITUDE_LEADERBOARD);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Test progress endpoint (no auth)
    await testEndpoint('Test Progress', API_ENDPOINTS.TEST_PROGRESS);
    
    setIsLoading(false);
  };

  const clearResults = () => {
    setTestResults({});
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <details className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
        <summary className="cursor-pointer p-4 font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg">
          🔧 Backend Test Panel
        </summary>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
          <div className="space-y-3">
            <div className="flex gap-2">
              <button
                onClick={runAllTests}
                disabled={isLoading}
                className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Testing...' : 'Test Backend'}
              </button>
              <button
                onClick={clearResults}
                className="px-3 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
              >
                Clear
              </button>
            </div>
            
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <div><strong>Backend URL:</strong> {import.meta.env.VITE_API_URL || 'http://localhost:5000'}</div>
              <div><strong>Environment:</strong> {import.meta.env.MODE}</div>
            </div>
            
            {Object.keys(testResults).length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Test Results:</h4>
                {Object.entries(testResults).map(([name, result]) => (
                  <div
                    key={name}
                    className={`p-2 rounded text-xs ${
                      result.status === 'success'
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    }`}
                  >
                    <div className="font-semibold">{name}</div>
                    {result.status === 'success' ? (
                      <div>
                        ✅ Success ({result.responseTime}ms)
                        {result.data && (
                          <details className="mt-1">
                            <summary className="cursor-pointer">Response</summary>
                            <pre className="mt-1 text-xs overflow-x-auto">
                              {JSON.stringify(result.data, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    ) : (
                      <div>❌ Error: {result.error}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </details>
    </div>
  );
};

export default BackendTest;
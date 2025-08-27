import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';

const BackendTest = () => {
  const [testResults, setTestResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [customBackendUrl, setCustomBackendUrl] = useState(() => {
    return localStorage.getItem('backendTestUrl') || 'https://ai-based-tutoring.onrender.com';
  });
  const [useCustomUrl, setUseCustomUrl] = useState(() => {
    return localStorage.getItem('useCustomBackendUrl') === 'true';
  });

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

  const getBaseUrl = () => {
    return useCustomUrl ? customBackendUrl : (import.meta.env.VITE_API_URL || 'http://localhost:5000');
  };

  const runAllTests = async () => {
    setIsLoading(true);
    setTestResults({});
    
    const baseUrl = getBaseUrl();
    
    // Test basic health check
    await testEndpoint('Health Check', baseUrl);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Test API endpoint
    await testEndpoint('API Test', `${baseUrl}/api/test`);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Test stats endpoint
    await testEndpoint('Stats', `${baseUrl}/api/stats`);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Test aptitude leaderboard
    await testEndpoint('Aptitude Leaderboard', `${baseUrl}/api/get_aptitude_leaderboard`);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Test progress endpoint (no auth)
    await testEndpoint('Test Progress', `${baseUrl}/api/test_progress`);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Test chat endpoint (no auth)
    await testEndpoint('Chat Test', `${baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: 'Hello, this is a test message'
      })
    });
    
    setIsLoading(false);
  };

  const clearResults = () => {
    setTestResults({});
  };

  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    setCustomBackendUrl(newUrl);
    localStorage.setItem('backendTestUrl', newUrl);
  };

  const toggleCustomUrl = () => {
    const newValue = !useCustomUrl;
    setUseCustomUrl(newValue);
    localStorage.setItem('useCustomBackendUrl', newValue.toString());
    if (newValue) {
      // When enabling custom URL, clear previous results
      setTestResults({});
    }
  };

  const setPresetUrl = (url) => {
    setCustomBackendUrl(url);
    localStorage.setItem('backendTestUrl', url);
    setUseCustomUrl(true);
    localStorage.setItem('useCustomBackendUrl', 'true');
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
            {/* URL Configuration */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="useCustomUrl"
                  checked={useCustomUrl}
                  onChange={toggleCustomUrl}
                  className="rounded"
                />
                <label htmlFor="useCustomUrl" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Use Custom URL
                </label>
              </div>
              
              {useCustomUrl && (
                <div className="space-y-2">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-600 dark:text-gray-400">Backend URL:</label>
                    <input
                      type="url"
                      value={customBackendUrl}
                      onChange={handleUrlChange}
                      placeholder="https://your-backend.com"
                      className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    />
                  </div>
                  
                  {/* Quick Presets */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-600 dark:text-gray-400">Quick Presets:</label>
                    <div className="flex flex-wrap gap-1">
                      <button
                        onClick={() => setPresetUrl('https://ai-based-tutoring.onrender.com')}
                        className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800"
                      >
                        Render
                      </button>
                      <button
                        onClick={() => setPresetUrl('http://localhost:5000')}
                        className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800"
                      >
                        Local
                      </button>
                      <button
                        onClick={() => setPresetUrl('http://localhost:3000')}
                        className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded hover:bg-purple-200 dark:hover:bg-purple-800"
                      >
                        Dev
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={runAllTests}
                disabled={isLoading}
                className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 flex-1"
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
            
            {/* Current Configuration */}
            <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-2 rounded">
              <div><strong>Current URL:</strong> {getBaseUrl()}</div>
              <div><strong>Environment:</strong> {import.meta.env.MODE}</div>
              <div><strong>Source:</strong> {useCustomUrl ? 'Custom' : 'Environment'}</div>
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
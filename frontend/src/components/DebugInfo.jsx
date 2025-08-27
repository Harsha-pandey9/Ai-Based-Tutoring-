import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';

const DebugInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const info = {
      currentPath: location.pathname,
      search: location.search,
      hash: location.hash,
      authLoaded,
      userLoaded,
      isSignedIn,
      userId: user?.id || 'Not available',
      userEmail: user?.primaryEmailAddress?.emailAddress || 'Not available',
      environment: import.meta.env.MODE,
      apiUrl: import.meta.env.VITE_API_URL,
      clerkKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? 'Set' : 'Not set',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    setDebugInfo(info);
    console.log('Debug Info:', info);
  }, [location, authLoaded, userLoaded, isSignedIn, user]);

  if (import.meta.env.MODE !== 'development') {
    return null; // Only show in development
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <details className="bg-black/90 text-white p-4 rounded-lg text-xs">
        <summary className="cursor-pointer font-bold text-green-400 mb-2">
          🐛 Debug Info
        </summary>
        <div className="space-y-1">
          <div><strong>Path:</strong> {debugInfo.currentPath}</div>
          <div><strong>Auth Loaded:</strong> {debugInfo.authLoaded ? '✅' : '❌'}</div>
          <div><strong>User Loaded:</strong> {debugInfo.userLoaded ? '✅' : '❌'}</div>
          <div><strong>Signed In:</strong> {debugInfo.isSignedIn ? '✅' : '❌'}</div>
          <div><strong>Environment:</strong> {debugInfo.environment}</div>
          <div><strong>API URL:</strong> {debugInfo.apiUrl || 'Not set'}</div>
          <div><strong>Clerk Key:</strong> {debugInfo.clerkKey}</div>
          <div><strong>User ID:</strong> {debugInfo.userId}</div>
          <div><strong>Email:</strong> {debugInfo.userEmail}</div>
          <div><strong>URL:</strong> {debugInfo.url}</div>
        </div>
        <button
          onClick={() => navigate('/')}
          className="mt-2 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
        >
          Go Home
        </button>
      </details>
    </div>
  );
};

export default DebugInfo;
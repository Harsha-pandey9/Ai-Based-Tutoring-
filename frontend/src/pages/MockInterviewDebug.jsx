import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '@clerk/clerk-react';

const MockInterviewDebug = () => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [waitingUsers, setWaitingUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [matchFound, setMatchFound] = useState(null);
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(`[${timestamp}] ${message}`);
  };

  useEffect(() => {
    // Create socket connection
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      upgrade: true,
    });

    setSocket(newSocket);

    // Connection events
    newSocket.on('connect', () => {
      setIsConnected(true);
      addLog('✅ Connected to server');
      
      // Join interview pool
      newSocket.emit('join_interview_pool', { 
        userId: user?.id || 'test-user', 
        username: user?.firstName || 'Test User' 
      });
      addLog('📝 Joined interview pool');
    });

    newSocket.on('connect_error', (error) => {
      addLog(`❌ Connection error: ${error.message}`);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      addLog('❌ Disconnected from server');
    });

    // Interview events
    newSocket.on('online_users_count', (count) => {
      setOnlineUsers(count);
      addLog(`👥 Online users: ${count}`);
    });

    newSocket.on('waiting_users', (users) => {
      setWaitingUsers(users);
      addLog(`⏳ Waiting users: ${users.length}`);
    });

    newSocket.on('match_found', ({ roomId, partner, role }) => {
      setMatchFound({ roomId, partner, role });
      setIsSearching(false);
      addLog(`🎉 MATCH FOUND! Room: ${roomId}, Partner: ${partner.username}, Role: ${role}`);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const startSearch = () => {
    if (!socket || !isConnected) {
      addLog('❌ Not connected to server');
      return;
    }

    setIsSearching(true);
    addLog('🔍 Starting search for partner...');
    
    socket.emit('find_match', { 
      userId: user?.id || 'test-user', 
      username: user?.firstName || 'Test User' 
    });
  };

  const cancelSearch = () => {
    if (!socket) return;
    
    setIsSearching(false);
    addLog('❌ Cancelled search');
    
    socket.emit('cancel_search', { 
      userId: user?.id || 'test-user' 
    });
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-amber-50 dark:from-slate-900 dark:via-stone-900 dark:to-amber-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-slate-800 dark:text-white">
          Mock Interview Debug Mode
        </h1>

        {/* Connection Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg">
            <h3 className="font-semibold mb-2">Connection</h3>
            <div className={`px-3 py-1 rounded-full text-sm ${
              isConnected 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg">
            <h3 className="font-semibold mb-2">Online Users</h3>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {onlineUsers}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg">
            <h3 className="font-semibold mb-2">Waiting</h3>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {waitingUsers.length}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg">
            <h3 className="font-semibold mb-2">Status</h3>
            <div className={`px-3 py-1 rounded-full text-sm ${
              matchFound 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : isSearching
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
            }`}>
              {matchFound ? 'Matched' : isSearching ? 'Searching' : 'Idle'}
            </div>
          </div>
        </div>

        {/* Match Result */}
        {matchFound && (
          <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-4">
              🎉 Match Found!
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-green-700 dark:text-green-300">
              <div>
                <strong>Room ID:</strong> {matchFound.roomId}
              </div>
              <div>
                <strong>Partner:</strong> {matchFound.partner.username}
              </div>
              <div>
                <strong>Your Role:</strong> {matchFound.role}
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Controls</h3>
          <div className="flex gap-4">
            {!isSearching && !matchFound && (
              <button
                onClick={startSearch}
                disabled={!isConnected}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-all duration-200"
              >
                Find Partner
              </button>
            )}

            {isSearching && (
              <button
                onClick={cancelSearch}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200"
              >
                Cancel Search
              </button>
            )}

            <button
              onClick={clearLogs}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all duration-200"
            >
              Clear Logs
            </button>
          </div>
        </div>

        {/* Debug Logs */}
        <div className="bg-black text-green-400 rounded-lg p-6 font-mono text-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Debug Logs</h3>
            <span className="text-xs text-green-600">
              {logs.length} entries
            </span>
          </div>
          <div className="h-64 overflow-y-auto space-y-1">
            {logs.length === 0 ? (
              <div className="text-green-600">No logs yet...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="leading-relaxed">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-amber-50 dark:bg-amber-900 border border-amber-200 dark:border-amber-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-4">
            🧪 Testing Instructions
          </h3>
          <ol className="text-amber-700 dark:text-amber-300 space-y-2">
            <li><strong>1.</strong> Open this page in TWO different browser windows/tabs</li>
            <li><strong>2.</strong> Make sure both show "Connected" status</li>
            <li><strong>3.</strong> Click "Find Partner" in the FIRST window</li>
            <li><strong>4.</strong> Click "Find Partner" in the SECOND window</li>
            <li><strong>5.</strong> Both should show "Match Found!" immediately</li>
            <li><strong>6.</strong> Check the debug logs to see what's happening</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default MockInterviewDebug;
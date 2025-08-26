import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const InterviewTest = () => {
  const [socket1] = useState(() => io('http://localhost:5000'));
  const [socket2] = useState(() => io('http://localhost:5000'));
  
  const [user1Status, setUser1Status] = useState('disconnected');
  const [user2Status, setUser2Status] = useState('disconnected');
  const [matchStatus, setMatchStatus] = useState('No match');
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    // User 1 Socket Events
    socket1.on('connect', () => {
      setUser1Status('connected');
      socket1.emit('join_interview_pool', { userId: 'user1', username: 'Alice' });
    });

    socket1.on('online_users_count', (count) => {
      setOnlineCount(count);
    });

    socket1.on('match_found', ({ partner, roomId }) => {
      setMatchStatus(`User 1 matched with ${partner.username} in room ${roomId}`);
    });

    // User 2 Socket Events
    socket2.on('connect', () => {
      setUser2Status('connected');
      socket2.emit('join_interview_pool', { userId: 'user2', username: 'Bob' });
    });

    socket2.on('match_found', ({ partner, roomId }) => {
      setMatchStatus(`User 2 matched with ${partner.username} in room ${roomId}`);
    });

    return () => {
      socket1.disconnect();
      socket2.disconnect();
    };
  }, [socket1, socket2]);

  const startMatching = () => {
    // User 1 starts searching
    socket1.emit('find_match', { userId: 'user1', username: 'Alice' });
    
    // User 2 starts searching (this should create a match)
    setTimeout(() => {
      socket2.emit('find_match', { userId: 'user2', username: 'Bob' });
    }, 1000);
  };

  return (
    <div className="p-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">
        Real-Time Matching Test
      </h2>
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
          <span className="font-medium">User 1 (Alice):</span>
          <span className={`px-3 py-1 rounded-full text-sm ${
            user1Status === 'connected' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {user1Status}
          </span>
        </div>

        <div className="flex justify-between items-center p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
          <span className="font-medium">User 2 (Bob):</span>
          <span className={`px-3 py-1 rounded-full text-sm ${
            user2Status === 'connected' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {user2Status}
          </span>
        </div>

        <div className="flex justify-between items-center p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
          <span className="font-medium">Online Users:</span>
          <span className="font-bold text-blue-600 dark:text-blue-400">{onlineCount}</span>
        </div>

        <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
          <span className="font-medium">Match Status:</span>
          <p className="mt-2 text-slate-600 dark:text-slate-400">{matchStatus}</p>
        </div>
      </div>

      <button
        onClick={startMatching}
        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg transition-all duration-200"
      >
        Test Real-Time Matching
      </button>

      <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900 rounded-lg border border-amber-200 dark:border-amber-700">
        <h3 className="font-bold text-amber-800 dark:text-amber-200 mb-2">How it works:</h3>
        <ol className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
          <li>1. Both users connect to the server automatically</li>
          <li>2. Click "Test Real-Time Matching" to simulate two users searching</li>
          <li>3. The system instantly matches them together</li>
          <li>4. Both users get notified and join the same interview room</li>
        </ol>
      </div>
    </div>
  );
};

export default InterviewTest;
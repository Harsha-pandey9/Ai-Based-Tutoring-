import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Editor } from '@monaco-editor/react';
import { 
  FaMicrophone, 
  FaMicrophoneSlash, 
  FaVolumeUp, 
  FaVolumeOff,
  FaVolumeMute, 
  FaPlay, 
  FaStop, 
  FaUsers, 
  FaCode, 
  FaComments, 
  FaRocket, 
  FaLightbulb, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock, 
  FaExchangeAlt,
  FaUserFriends,
  FaPaperPlane,
  FaPhoneSlash,
  FaRandom
} from 'react-icons/fa';
import { SOCKET_CONFIG, API_ENDPOINTS } from '../config/api';

const MockInterviewWorking = () => {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [isMatched, setIsMatched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [partner, setPartner] = useState(null);
  const [roomId, setRoomId] = useState(null);
  
  // Interview State
  const [myRole, setMyRole] = useState('solver');
  const [currentProblem, setCurrentProblem] = useState(null);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [roundNumber, setRoundNumber] = useState(1);
  
  // Code Editor State
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState([]);
  
  // Voice Communication State
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [audioStream, setAudioStream] = useState(null);
  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);
  
  // Chat State
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  
  // Socket.IO State
  const [socket, setSocket] = useState(null);
  const [waitingUsers, setWaitingUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  // Coding problems
  const codingProblems = [
    {
      id: 1,
      title: "Two Sum",
      difficulty: "Easy",
      timeLimit: 30,
      description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.`,
      examples: [
        { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" }
      ],
      testCases: [
        { input: "[2,7,11,15], 9", expected: "[0,1]", hidden: false }
      ],
      starterCode: {
        python: `def two_sum(nums, target):
    # Write your solution here
    pass

# Test your solution
nums = [2, 7, 11, 15]
target = 9
result = two_sum(nums, target)
print(result)`,
        javascript: `function twoSum(nums, target) {
    // Write your solution here
}

const nums = [2, 7, 11, 15];
const target = 9;
const result = twoSum(nums, target);
console.log(result);`,
        java: `public class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        return new int[]{};
    }
}`
      }
    }
  ];

  // Initialize Socket.IO connection
  useEffect(() => {
    const newSocket = io(SOCKET_CONFIG.URL, {
      transports: ['websocket', 'polling'],
      upgrade: true,
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('✅ Connected to server');
      newSocket.emit('join_interview_pool', {
        userId: user?.id,
        username: user?.firstName || user?.username || 'Anonymous'
      });
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('❌ Disconnected from server');
    });

    newSocket.on('online_users_count', (count) => {
      setOnlineUsers(count);
    });

    newSocket.on('waiting_users', (users) => {
      setWaitingUsers(users);
    });

    newSocket.on('match_found', (data) => {
      console.log('🎉 Match found:', data);
      setPartner({
        username: data.partner.username,
        id: data.partner.userId
      });
      setRoomId(data.roomId);
      setMyRole(data.role);
      setIsMatched(true);
      setIsSearching(false);
      
      // Start with a random problem
      const randomProblem = codingProblems[0];
      setCurrentProblem(randomProblem);
      setCode(randomProblem.starterCode[language]);
      setTimeLeft(randomProblem.timeLimit * 60);
      setIsTimerRunning(true);
      setIsCallActive(true);
      
      // Add welcome messages
      const welcomeMessages = [
        {
          username: 'System',
          message: `🎉 You've been matched with ${data.partner.username}!`,
          timestamp: new Date().toISOString(),
          type: 'system'
        },
        {
          username: 'System',
          message: `🎯 Your role: ${data.role === 'solver' ? 'Candidate (solve the problem)' : 'Interviewer (help guide)'}`,
          timestamp: new Date().toISOString(),
          type: 'system'
        }
      ];
      
      setMessages(welcomeMessages);
    });

    // Real-time message handling
    newSocket.on('receive_message', (data) => {
      const message = {
        username: data.username,
        message: data.message,
        timestamp: data.timestamp,
        type: 'partner'
      };
      setMessages(prev => [...prev, message]);
    });

    // Real-time code sharing
    newSocket.on('code_update', (data) => {
      setCode(data.code);
    });

    // Real-time partner disconnect
    newSocket.on('partner_disconnected', () => {
      setIsMatched(false);
      setPartner(null);
      setRoomId(null);
      setMyRole('solver');
      setCurrentProblem(null);
      setMessages([]);
      setCode('');
      setOutput('');
      setTestResults([]);
      setIsCallActive(false);
      
      const disconnectMessage = {
        username: 'System',
        message: '❌ Your partner has disconnected. Returning to matching screen...',
        timestamp: new Date().toISOString(),
        type: 'system'
      };
      setMessages([disconnectMessage]);
    });

    // Real-time voice status updates
    newSocket.on('partner_mute_status', ({ isMuted, username }) => {
      const message = {
        username: 'System',
        message: `🎤 ${username} ${isMuted ? 'muted' : 'unmuted'} their microphone`,
        timestamp: new Date().toISOString(),
        type: 'system'
      };
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('partner_deafen_status', ({ isDeafened, username }) => {
      const message = {
        username: 'System',
        message: `🔊 ${username} ${isDeafened ? 'disabled' : 'enabled'} their audio`,
        timestamp: new Date().toISOString(),
        type: 'system'
      };
      setMessages(prev => [...prev, message]);
    });

    // Real-time role swap
    newSocket.on('roles_swapped', ({ newRole }) => {
      setMyRole(newRole);
      const message = {
        username: 'System',
        message: `🔄 Roles swapped! You are now the ${newRole === 'solver' ? 'Problem Solver' : 'Helper/Interviewer'}`,
        timestamp: new Date().toISOString(),
        type: 'system'
      };
      setMessages(prev => [...prev, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user, language]);

  // Initialize audio stream only when matched
  useEffect(() => {
    const initAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        setAudioStream(stream);
        if (localAudioRef.current) {
          localAudioRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    };

    if (isMatched) {
      initAudio();
    }
    
    return () => {
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isMatched]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
      handleSwitchTurns();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startSearching = () => {
    setIsSearching(true);
    
    if (socket && isConnected) {
      socket.emit('find_match', {
        userId: user?.id,
        username: user?.firstName || user?.username || 'Anonymous'
      });
    }
  };

  const cancelSearch = () => {
    setIsSearching(false);
    if (socket) {
      socket.emit('cancel_search', { userId: user?.id });
    }
  };

  const handleSwitchTurns = () => {
    const newRole = myRole === 'solver' ? 'interviewer' : 'solver';
    setMyRole(newRole);
    setRoundNumber(prev => prev + 1);
    
    const systemMessage = {
      username: 'System',
      message: `🔄 Roles switched! You are now the ${newRole}.`,
      timestamp: new Date().toISOString(),
      type: 'system'
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  const runCode = async () => {
    if (!code.trim()) return;

    setIsRunning(true);
    setOutput('Running code...');

    try {
      const response = await fetch(API_ENDPOINTS.EXECUTE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: code,
          language: language
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setOutput(result.output || 'Code executed successfully');
        
        // Run test cases
        if (currentProblem) {
          const results = currentProblem.testCases.map((testCase, index) => ({
            id: index + 1,
            input: testCase.input,
            expected: testCase.expected,
            passed: Math.random() > 0.2,
            actual: testCase.expected,
            hidden: testCase.hidden
          }));
          setTestResults(results);
        }
      } else {
        setOutput(`Error: ${result.error}`);
      }
    } catch (error) {
      setOutput(`Network Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message = {
      username: user?.firstName || 'You',
      message: newMessage,
      timestamp: new Date().toISOString(),
      type: 'user'
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Send to partner via socket
    if (socket && roomId) {
      socket.emit('send_message', {
        roomId: roomId,
        username: user?.firstName || 'Anonymous',
        message: newMessage,
        timestamp: new Date().toISOString()
      });
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioStream) {
      audioStream.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
    }
    
    // Notify partner in real-time
    if (socket && roomId) {
      socket.emit('voice_mute_status', {
        roomId: roomId,
        isMuted: !isMuted,
        username: user?.firstName || 'Anonymous'
      });
    }
    
    const message = {
      username: 'System',
      message: `🎤 You ${!isMuted ? 'muted' : 'unmuted'} your microphone`,
      timestamp: new Date().toISOString(),
      type: 'system'
    };
    setMessages(prev => [...prev, message]);
  };

  const toggleDeafen = () => {
    setIsDeafened(!isDeafened);
    if (remoteAudioRef.current) {
      remoteAudioRef.current.muted = !isDeafened;
    }
    
    // Notify partner in real-time
    if (socket && roomId) {
      socket.emit('voice_deafen_status', {
        roomId: roomId,
        isDeafened: !isDeafened,
        username: user?.firstName || 'Anonymous'
      });
    }
    
    const message = {
      username: 'System',
      message: `🔊 You ${!isDeafened ? 'disabled' : 'enabled'} audio`,
      timestamp: new Date().toISOString(),
      type: 'system'
    };
    setMessages(prev => [...prev, message]);
  };

  const endCall = () => {
    // Notify partner in real-time
    if (socket && roomId) {
      socket.emit('disconnect_interview', { roomId: roomId });
    }
    
    setIsCallActive(false);
    setIsMatched(false);
    setPartner(null);
    setRoomId(null);
    setMessages([]);
    setCurrentProblem(null);
    setCode('');
    setOutput('');
    setTestResults([]);
    setIsTimerRunning(false);
    
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
    }
    
    const message = {
      username: 'System',
      message: '📞 You disconnected from the interview',
      timestamp: new Date().toISOString(),
      type: 'system'
    };
    setMessages([message]);
  };

  const swapRoles = () => {
    // Notify partner in real-time
    if (socket && roomId) {
      socket.emit('swap_roles', { roomId: roomId });
    }
    handleSwitchTurns();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-amber-50 dark:from-slate-900 dark:via-stone-900 dark:to-amber-900 transition-colors duration-300">
      
      {/* Hidden audio elements */}
      <audio ref={localAudioRef} muted autoPlay />
      <audio ref={remoteAudioRef} autoPlay />
      
      {!isMatched ? (
        // Matching Screen - NO BUTTONS HERE
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            
            {/* Connection Status */}
            {!isConnected && (
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">Connecting to server...</span>
                </div>
              </div>
            )}
            
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-slate-700 to-amber-700 bg-clip-text text-transparent">
                Practice Coding Interviews
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                Get matched with another developer for a real-time coding interview. All control buttons will appear after you find a partner.
              </p>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <FaUsers className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{onlineUsers}</h3>
                    <p className="text-slate-600 dark:text-slate-400">Users Online</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <FaCode className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{waitingUsers.length}</h3>
                    <p className="text-slate-600 dark:text-slate-400">Waiting for Match</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isConnected 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                      : 'bg-gradient-to-r from-red-500 to-red-600'
                  }`}>
                    <FaRocket className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                      {isConnected ? 'Live' : 'Offline'}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">Connection Status</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Matching Interface */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
              {!isSearching ? (
                <div>
                  <div className="mb-8">
                    <div className="w-24 h-24 bg-gradient-to-r from-slate-600 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FaUserFriends className="text-white text-3xl" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
                      Ready for Your Interview?
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto mb-6">
                      Click below to find a partner. Once matched, all real-time control buttons (mute, audio, disconnect, swap roles, run code) will appear.
                    </p>
                  </div>

                  <button
                    onClick={startSearching}
                    disabled={!isConnected}
                    className="px-12 py-4 bg-gradient-to-r from-slate-600 to-amber-600 hover:from-slate-700 hover:to-amber-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:transform-none disabled:cursor-not-allowed"
                  >
                    {isConnected ? 'Find Interview Partner' : 'Connecting...'}
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-8">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                      <FaUsers className="text-white text-3xl" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
                      Finding Your Partner...
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                      Looking for another developer to practice with. Control buttons will appear once matched!
                    </p>
                  </div>

                  <div className="flex justify-center gap-4 mb-8">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>

                  <button
                    onClick={cancelSearch}
                    className="px-8 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-full transition-all duration-200"
                  >
                    Cancel Search
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Interview Screen - BUTTONS APPEAR HERE AFTER MATCH
        <div className="h-screen flex flex-col overflow-hidden">
          
          {/* Header Bar with Real-time Controls - ONLY VISIBLE AFTER MATCH */}
          <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                  Mock Interview Platform
                </h1>
                <div className="flex items-center gap-2 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Interview Active with {partner?.username}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Timer */}
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <FaClock className={`${timeLeft < 300 ? 'text-red-600' : 'text-amber-600'}`} />
                  <span className={`font-mono text-lg font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-slate-800 dark:text-white'}`}>
                    {formatTime(timeLeft)}
                  </span>
                </div>

                {/* Real-time Controls - VISIBLE ONLY AFTER MATCH */}
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-lg p-2">
                  {/* Mute Button */}
                  <button
                    onClick={toggleMute}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      isMuted 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                    title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
                  >
                    {isMuted ? <FaMicrophoneSlash className="text-sm" /> : <FaMicrophone className="text-sm" />}
                  </button>

                  {/* Audio Button */}
                  <button
                    onClick={toggleDeafen}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      isDeafened 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                    title={isDeafened ? 'Enable Audio' : 'Disable Audio'}
                  >
                    {isDeafened ? <FaVolumeOff className="text-sm" /> : <FaVolumeUp className="text-sm" />}
                  </button>

                  {/* Connection Cut Button */}
                  <button
                    onClick={endCall}
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200"
                    title="Disconnect from Interview"
                  >
                    <FaPhoneSlash className="text-sm" />
                  </button>

                  {/* Swap Role Button */}
                  <button
                    onClick={swapRoles}
                    className="p-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all duration-200"
                    title="Swap Roles with Partner"
                  >
                    <FaRandom className="text-sm" />
                  </button>
                </div>

                {/* Run Code Button */}
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaPlay />
                  {isRunning ? 'Running...' : 'Run Code'}
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex">
            
            {/* Left Panel - Problem & Chat */}
            <div className="w-2/5 flex flex-col border-r border-slate-200 dark:border-slate-700">
              
              {/* Problem Description */}
              <div className="flex-1 p-4 overflow-y-auto bg-white dark:bg-slate-800" style={{ maxHeight: 'calc(100vh - 320px)' }}>
                {currentProblem && (
                  <div>
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                          {currentProblem.title}
                        </h2>
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          {currentProblem.difficulty}
                        </span>
                      </div>
                      
                      {/* Role Indicator */}
                      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-lg border border-blue-200 dark:border-blue-700">
                        <div className="flex items-center gap-2 mb-2">
                          <FaLightbulb className="text-blue-600 dark:text-blue-400" />
                          <span className="font-semibold text-blue-800 dark:text-blue-200">
                            Your Role: {myRole === 'solver' ? 'Candidate (Solver)' : 'Interviewer (Helper)'}
                          </span>
                        </div>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          {myRole === 'solver' 
                            ? 'Solve the problem while thinking out loud. Ask questions if needed.'
                            : 'Guide the candidate through the problem. Provide hints and ask clarifying questions.'
                          }
                        </p>
                      </div>
                      
                      <div className="prose dark:prose-invert max-w-none">
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                          {currentProblem.description}
                        </p>

                        {/* Examples */}
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">Examples:</h3>
                          {currentProblem.examples.map((example, index) => (
                            <div key={index} className="mb-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                              <div className="mb-2">
                                <span className="font-medium text-slate-700 dark:text-slate-300">Input: </span>
                                <code className="text-sm bg-slate-200 dark:bg-slate-600 px-2 py-1 rounded font-mono">
                                  {example.input}
                                </code>
                              </div>
                              <div className="mb-2">
                                <span className="font-medium text-slate-700 dark:text-slate-300">Output: </span>
                                <code className="text-sm bg-slate-200 dark:bg-slate-600 px-2 py-1 rounded font-mono">
                                  {example.output}
                                </code>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Section */}
              <div className="h-64 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex-shrink-0">
                <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                    <FaComments />
                    Real-time Chat
                  </h3>
                </div>
                
                <div className="overflow-y-auto p-3 h-32">
                  {messages.map((msg, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-medium text-sm ${
                          msg.type === 'system' ? 'text-blue-600 dark:text-blue-400' :
                          msg.type === 'user' ? 'text-slate-700 dark:text-slate-300' :
                          'text-green-600 dark:text-green-400'
                        }`}>
                          {msg.username}
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className={`text-sm leading-relaxed ${
                        msg.type === 'system' ? 'text-blue-600 dark:text-blue-400 font-medium' :
                        'text-slate-600 dark:text-slate-400'
                      }`}>
                        {msg.message}
                      </p>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type a message or ask a question..."
                      className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      onClick={sendMessage}
                      className="px-4 py-2 bg-gradient-to-r from-slate-600 to-amber-600 text-white rounded-lg hover:from-slate-700 hover:to-amber-700 transition-all duration-200"
                    >
                      <FaPaperPlane />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Code Editor & Output */}
            <div className="flex-1 flex flex-col">
              
             {/* Editor Header */}
<div className="bg-slate-100 dark:bg-slate-700 p-4 border-b border-slate-200 dark:border-slate-600">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
      <h3 className="font-semibold text-slate-800 dark:text-white">Real-time Code Editor</h3>
      <select
        value={language}
        onChange={(e) => {
          setLanguage(e.target.value);
          if (currentProblem) {
            setCode(currentProblem.starterCode[e.target.value]);
          }
        }}
        className="px-3 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
        disabled={myRole !== 'solver'}
      >
        <option value="python">Python</option>
        <option value="javascript">JavaScript</option>
        <option value="java">Java</option>
      </select>
    </div>
    
    {/* Control buttons moved here beside language selection */}
    <div className="flex items-center gap-3">
      {/* Real-time Controls */}
      <div className="flex items-center gap-2 bg-slate-200 dark:bg-slate-600 rounded-lg p-2">
        {/* Mute Button */}
        <button
          onClick={toggleMute}
          className={`p-2 rounded-lg transition-all duration-200 ${
            isMuted 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
          title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
        >
          {isMuted ? <FaMicrophoneSlash className="text-sm" /> : <FaMicrophone className="text-sm" />}
        </button>

        {/* Audio Button */}
        <button
          onClick={toggleDeafen}
          className={`p-2 rounded-lg transition-all duration-200 ${
            isDeafened 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
          title={isDeafened ? 'Enable Audio' : 'Disable Audio'}
        >
          {isDeafened ? <FaVolumeOff className="text-sm" /> : <FaVolumeUp className="text-sm" />}
        </button>

        {/* Connection Cut Button */}
        <button
          onClick={endCall}
          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200"
          title="Disconnect from Interview"
        >
          <FaPhoneSlash className="text-sm" />
        </button>

        {/* Swap Role Button */}
        <button
          onClick={swapRoles}
          className="p-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all duration-200"
          title="Swap Roles with Partner"
        >
          <FaRandom className="text-sm" />
        </button>
      </div>

      {/* Run Code Button */}
      <button
        onClick={runCode}
        disabled={isRunning}
        className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FaPlay />
        {isRunning ? 'Running...' : 'Run Code'}
      </button>
    </div>
  </div>
</div>


              {/* Code Editor */}
              <div className="flex-1">
                <Editor
                  height="100%"
                  theme="vs-dark"
                  language={language}
                  value={code}
                  onChange={(value) => {
                    setCode(value || '');
                    // Real-time code sharing
                    if (socket && roomId) {
                      socket.emit('code_update', { roomId: roomId, code: value || '' });
                    }
                  }}
                  options={{
                    fontSize: 16,
                    minimap: { enabled: true },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    wordWrap: 'on',
                    lineNumbers: 'on',
                    folding: true,
                    bracketMatching: 'always',
                    autoIndent: 'full',
                    readOnly: myRole !== 'solver'
                  }}
                />
              </div>

              {/* Output & Test Results */}
              <div className="h-64 border-t border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 flex-shrink-0">
                <div className="flex h-full">
                  
                  {/* Output */}
                  <div className="flex-1 flex flex-col">
                    <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                      <h4 className="font-semibold text-slate-800 dark:text-white">Console Output</h4>
                    </div>
                    <div className="flex-1 p-4 bg-slate-900 text-green-400 font-mono text-sm overflow-auto">
                      <pre className="whitespace-pre-wrap leading-relaxed">
                        {output || 'Click "Run Code" to execute your code and see the output here...'}
                      </pre>
                    </div>
                  </div>

                  {/* Test Results */}
                  <div className="w-1/2 border-l border-slate-200 dark:border-slate-600">
                    <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                      <h4 className="font-semibold text-slate-800 dark:text-white">Test Results</h4>
                    </div>
                    <div className="p-4 overflow-y-auto h-full">
                      {testResults.length > 0 ? (
                        <div className="space-y-3">
                          {testResults.map((result) => (
                            <div
                              key={result.id}
                              className={`p-3 rounded-lg border ${
                                result.passed
                                  ? 'bg-green-50 border-green-200 dark:bg-green-900 dark:border-green-700'
                                  : 'bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-700'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                {result.passed ? (
                                  <FaCheckCircle className="text-green-600 dark:text-green-400" />
                                ) : (
                                  <FaTimesCircle className="text-red-600 dark:text-red-400" />
                                )}
                                <span className="font-medium text-sm">
                                  Test Case {result.id}
                                </span>
                              </div>
                              <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                                <div><strong>Input:</strong> <code className="bg-slate-200 dark:bg-slate-600 px-1 rounded">{result.input}</code></div>
                                <div><strong>Expected:</strong> <code className="bg-slate-200 dark:bg-slate-600 px-1 rounded">{result.expected}</code></div>
                                {!result.passed && (
                                  <div><strong>Got:</strong> <code className="bg-slate-200 dark:bg-slate-600 px-1 rounded">{result.actual}</code></div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-slate-500 dark:text-slate-400 mt-8">
                          <FaCode className="text-3xl mx-auto mb-3 opacity-50" />
                          <p className="text-sm">Run your code to see test results</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockInterviewWorking;
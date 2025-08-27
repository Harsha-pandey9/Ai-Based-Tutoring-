import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { io } from 'socket.io-client';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import { FaChartLine, FaBook, FaVideo, FaAtom, FaTrophy, FaFire, FaCalendarAlt, FaUsers, FaRobot, FaLightbulb, FaGraduationCap, FaRocket } from 'react-icons/fa';
import { SOCKET_CONFIG, API_ENDPOINTS } from '../config/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

export default function ProgressTracker() {
  const { getToken } = useAuth();
  const [data, setData] = useState(null);
  const [progress, setProgress] = useState(0);
  const [recommendation, setRecommendation] = useState('');
  const [detailedData, setDetailedData] = useState({ logins: [], activities: {} });
  const [calendarValue, setCalendarValue] = useState(new Date());
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [socket, setSocket] = useState(null);
  const [animatedCounts, setAnimatedCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(SOCKET_CONFIG.URL, SOCKET_CONFIG.OPTIONS);
    setSocket(newSocket);

    // Listen for online users count
    newSocket.on('online_users_count', (count) => {
      setOnlineUsers(count);
    });

    const fetchProgress = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if backend is running
        try {
          const healthCheck = await fetch(API_ENDPOINTS.HEALTH, {
            method: 'GET',
            timeout: 5000
          });
          console.log('Backend health check:', healthCheck.ok);
        } catch (healthError) {
          console.error('Backend not accessible:', healthError);
          throw new Error('Backend server is not running. Please start the backend server.');
        }
        
        const token = await getToken();
        console.log('Fetching progress with token:', token ? 'Token exists' : 'No token');
        
        let res;
        
        if (!token) {
          console.log('No token, using test endpoint');
          // Use test endpoint if no authentication
          res = await fetch(API_ENDPOINTS.TEST_PROGRESS, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 10000
          });
        } else {
          // Use authenticated endpoint
          res = await fetch(API_ENDPOINTS.GET_PROGRESS, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            timeout: 10000
          });
        }
        
        console.log('Progress response status:', res.status);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error('Progress fetch error:', errorText);
          
          if (res.status === 401) {
            throw new Error('Authentication failed. Please sign in again.');
          } else if (res.status === 404) {
            throw new Error('User not found. Creating user profile...');
          } else if (res.status >= 500) {
            throw new Error('Server error. Please try again later.');
          } else {
            throw new Error(`API Error: ${res.status} - ${errorText}`);
          }
        }
        
        const fetchedData = await res.json();
        console.log('Fetched progress data:', fetchedData);
        
        setData(fetchedData);
        setProgress(fetchedData.overallProgress || 0);
        
        // Animate counts
        animateCounters(fetchedData);
        setLoading(false);
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error('Error fetching progress:', error);
        setError(error.message);
        
        // Set default data if fetch fails
        const defaultData = {
          pdfNotesRead: 0,
          lecturesWatched: 0,
          quantumRead: 0,
          overallProgress: 0,
          pdfCount: 0,
          videoCount: 0,
          quantumCount: 0,
          testCount: 0,
          aptitudeTestsTaken: 0,
          currentStreak: 0,
          totalDaysVisited: 0,
          totalLogins: 0,
          testsAttempted: 0,
          totalTests: 10,
          totalMarks: 0,
          maxMarks: 500,
          bestAptitudeScore: 0,
          avgAptitudeScore: 0,
          totalPdfsAvailable: 50,
          totalVideosAvailable: 30,
          totalQuantumAvailable: 40,
          recentActivities: [],
          streak: 0
        };
        setData(defaultData);
        animateCounters(defaultData);
        setLoading(false);
      }
    };

    const fetchDetailedProgress = async () => {
      try {
        const token = await getToken();
        const res = await fetch(API_ENDPOINTS.GET_DETAILED_PROGRESS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!res.ok) {
          console.error('Detailed progress fetch error:', res.status);
          throw new Error('Failed to fetch detailed progress');
        }
        
        const fetchedData = await res.json();
        console.log('Fetched detailed progress data:', fetchedData);
        setDetailedData(fetchedData);
      } catch (error) {
        console.error('Error fetching detailed progress:', error);
        // Set default detailed data
        setDetailedData({ logins: [], activities: {} });
      }
    };

    // Add a small delay to ensure auth is ready
    const initializeData = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Increased delay
      
      // Retry mechanism
      let retries = 3;
      while (retries > 0) {
        try {
          await fetchProgress();
          await fetchDetailedProgress();
          break; // Success, exit retry loop
        } catch (error) {
          retries--;
          if (retries > 0) {
            console.log(`Retrying... ${retries} attempts left`);
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }
      }
    };

    initializeData();
    
    const interval = setInterval(() => {
      fetchProgress();
      fetchDetailedProgress();
    }, 30000);

    return () => {
      clearInterval(interval);
      newSocket.disconnect();
    };
  }, [getToken]);

  const animateCounters = (newData) => {
    const counters = {
      pdfCount: newData.pdfCount || 0,
      videoCount: newData.videoCount || 0,
      quantumCount: newData.quantumCount || 0,
      testCount: newData.testCount || 0,
      currentStreak: newData.currentStreak || 0,
      totalDaysVisited: newData.totalDaysVisited || 0,
      aptitudeTestsTaken: newData.aptitudeTestsTaken || 0,
    };

    Object.keys(counters).forEach(key => {
      animateValue(0, counters[key], 1500, key);
    });
  };

  const animateValue = (start, end, duration, key) => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const current = Math.floor(progress * (end - start) + start);
      setAnimatedCounts(prev => ({ ...prev, [key]: current }));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  useEffect(() => {
    const fetchRecommendation = async () => {
      if (!data) return;
      try {
        const token = await getToken();
        const prompt = `Based on this student progress: PDF notes read: ${data.pdfCount} out of ${data.totalPdfsAvailable}, Videos watched: ${data.videoCount} out of ${data.totalVideosAvailable}, Quantum notes read: ${data.quantumCount} out of ${data.totalQuantumAvailable}, Tests attempted: ${data.testCount}, Aptitude tests: ${data.aptitudeTestsTaken}, Current streak: ${data.currentStreak} days, Total days visited: ${data.totalDaysVisited}. Provide personalized study recommendations.`;
        const res = await fetch(API_ENDPOINTS.CHAT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ prompt }),
        });
        if (!res.ok) throw new Error('Failed to fetch recommendation');
        const { response } = await res.json();
        setRecommendation(response);
      } catch (error) {
        console.error(error);
        setRecommendation('Unable to generate recommendation.');
      }
    };

    fetchRecommendation();
  }, [data]);

  const getStreakColor = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    
    if (detailedData.logins.includes(dateStr)) {
      if (dateStr === today) {
        return 'bg-green-600 text-white font-bold'; // Today's login
      }
      return 'bg-green-400 text-white'; // Past login
    }
    return null;
  };

  const StatCard = ({ title, value, icon, color, subtitle, progress }) => (
    <div className={`bg-gradient-to-br ${color} p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-white/70 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className="text-4xl opacity-80">{icon}</div>
      </div>
      {progress !== undefined && (
        <div className="mt-4">
          <div className="bg-white/20 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-white/80 text-xs mt-1">{progress}% Complete</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-2">
          📊 Learning Progress Dashboard
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400">
          Track your learning journey and stay motivated!
        </p>
      </div>

      {/* Real-time Online Users */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-3 bg-green-100 dark:bg-green-900 px-6 py-3 rounded-full shadow-lg">
          <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-800 dark:text-green-200 font-semibold text-lg">
            🌐 {onlineUsers} Users Online Now
          </span>
        </div>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your progress...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-red-500 text-2xl">⚠️</div>
              <div>
                <h3 className="text-red-800 dark:text-red-200 font-semibold">Error Loading Progress</h3>
                <p className="text-red-600 dark:text-red-300 text-sm mt-1">{error}</p>
                <p className="text-red-500 dark:text-red-400 text-xs mt-2">
                  Showing default values. Please refresh the page or try again later.
                </p>
              </div>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      )}

      {data && (
        <>
          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Current Streak"
              value={`${animatedCounts.currentStreak || 0} 🔥`}
              icon="📅"
              color="from-orange-500 to-red-500"
              subtitle="Days in a row"
            />
            <StatCard
              title="Days Visited"
              value={animatedCounts.totalDaysVisited || 0}
              icon="🗓️"
              color="from-blue-500 to-indigo-500"
              subtitle="Total site visits"
            />
            <StatCard
              title="Overall Progress"
              value={`${progress}%`}
              icon="📈"
              color="from-green-500 to-emerald-500"
              progress={progress}
            />
            <StatCard
              title="Total Logins"
              value={data.totalLogins || 0}
              icon="🔑"
              color="from-purple-500 to-pink-500"
              subtitle="All time"
            />
          </div>

          {/* Activity Counts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="PDF Notes Read"
              value={animatedCounts.pdfCount || 0}
              icon="📄"
              color="from-red-500 to-pink-500"
              subtitle={`Out of ${data.totalPdfsAvailable}`}
              progress={data.pdfNotesRead}
            />
            <StatCard
              title="Videos Watched"
              value={animatedCounts.videoCount || 0}
              icon="🎥"
              color="from-blue-500 to-cyan-500"
              subtitle={`Out of ${data.totalVideosAvailable}`}
              progress={data.lecturesWatched}
            />
            <StatCard
              title="Quantum Notes"
              value={animatedCounts.quantumCount || 0}
              icon="⚛️"
              color="from-teal-500 to-green-500"
              subtitle={`Out of ${data.totalQuantumAvailable}`}
              progress={data.quantumRead}
            />
            <StatCard
              title="Tests Taken"
              value={animatedCounts.testCount || 0}
              icon="📝"
              color="from-indigo-500 to-purple-500"
              subtitle={`Regular tests`}
            />
          </div>

          {/* Test Performance Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Aptitude Tests"
              value={animatedCounts.aptitudeTestsTaken || 0}
              icon="🧠"
              color="from-yellow-500 to-orange-500"
              subtitle="Completed"
            />
            <StatCard
              title="Best Score"
              value={data.bestAptitudeScore || 0}
              icon="🏆"
              color="from-amber-500 to-yellow-500"
              subtitle="Aptitude test"
            />
            <StatCard
              title="Total Marks"
              value={`${data.totalMarks}/${data.maxMarks}`}
              icon="⭐"
              color="from-emerald-500 to-teal-500"
              subtitle="All tests combined"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Daily Streak Calendar */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                🗓️ Daily Streak Calendar
              </h2>
              <div className="calendar-container">
                <Calendar
                  onChange={setCalendarValue}
                  value={calendarValue}
                  tileClassName={({ date }) => getStreakColor(date)}
                  className="w-full border-none"
                />
                <div className="mt-4 flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-600 rounded"></div>
                    <span>Today</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-400 rounded"></div>
                    <span>Login Day</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-300 rounded"></div>
                    <span>No Activity</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Breakdown Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                📊 Learning Progress Breakdown
              </h2>
              <Doughnut
                data={{
                  labels: ['PDF Notes', 'Video Lectures', 'Quantum Notes', 'Tests'],
                  datasets: [{
                    data: [
                      data.pdfNotesRead,
                      data.lecturesWatched,
                      data.quantumRead,
                      (data.testCount / data.totalTests) * 100
                    ],
                    backgroundColor: [
                      'rgba(239, 68, 68, 0.8)',
                      'rgba(59, 130, 246, 0.8)',
                      'rgba(16, 185, 129, 0.8)',
                      'rgba(139, 92, 246, 0.8)'
                    ],
                    borderWidth: 3,
                    borderColor: '#fff'
                  }]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                      callbacks: {
                        label: (context) => `${context.label}: ${context.parsed.toFixed(1)}%`
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Activity Trends Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
              📈 Activity Trends Over Time
            </h2>
            {Object.keys(detailedData.activities).length > 0 ? (
              <Line
                data={{
                  labels: Object.keys(detailedData.activities).sort(),
                  datasets: [
                    {
                      label: 'PDF Reads',
                      data: Object.keys(detailedData.activities).sort().map(date => detailedData.activities[date]?.pdf || 0),
                      borderColor: 'rgb(239, 68, 68)',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      tension: 0.4,
                      fill: true,
                      pointRadius: 6,
                      pointHoverRadius: 8
                    },
                    {
                      label: 'Videos Watched',
                      data: Object.keys(detailedData.activities).sort().map(date => detailedData.activities[date]?.video || 0),
                      borderColor: 'rgb(59, 130, 246)',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      tension: 0.4,
                      fill: true,
                      pointRadius: 6,
                      pointHoverRadius: 8
                    },
                    {
                      label: 'Quantum Reads',
                      data: Object.keys(detailedData.activities).sort().map(date => detailedData.activities[date]?.quantum || 0),
                      borderColor: 'rgb(16, 185, 129)',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      tension: 0.4,
                      fill: true,
                      pointRadius: 6,
                      pointHoverRadius: 8
                    },
                    {
                      label: 'Tests',
                      data: Object.keys(detailedData.activities).sort().map(date => detailedData.activities[date]?.test || 0),
                      borderColor: 'rgb(139, 92, 246)',
                      backgroundColor: 'rgba(139, 92, 246, 0.1)',
                      tension: 0.4,
                      fill: true,
                      pointRadius: 6,
                      pointHoverRadius: 8
                    },
                  ]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Daily Learning Activities' }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: { color: 'rgba(0,0,0,0.1)' }
                    },
                    x: {
                      grid: { color: 'rgba(0,0,0,0.1)' }
                    }
                  },
                  interaction: {
                    intersect: false,
                    mode: 'index'
                  }
                }}
              />
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-gray-500 text-lg">No activity data available yet.</p>
                <p className="text-gray-400">Start learning to see your progress trends!</p>
              </div>
            )}
          </div>

          {/* AI Recommendations */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200 flex items-center gap-3">
              🤖 AI Study Recommendations
            </h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-inner">
              <div className="flex items-start gap-4">
                <div className="text-3xl">💡</div>
                <div className="flex-1">
                  <p className="text-gray-800 dark:text-gray-300 leading-relaxed text-lg">
                    {recommendation || (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                        Generating personalized recommendations...
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
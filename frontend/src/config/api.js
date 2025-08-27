// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Chat endpoints
  CHAT: `${API_BASE_URL}/api/chat`,
  EXECUTE: `${API_BASE_URL}/api/execute`,
  
  // User endpoints
  RECORD_LOGIN: `${API_BASE_URL}/api/record_login`,
  RECORD_ACTIVITY: `${API_BASE_URL}/api/record_activity`,
  
  // Progress endpoints
  GET_PROGRESS: `${API_BASE_URL}/api/get_progress`,
  GET_DETAILED_PROGRESS: `${API_BASE_URL}/api/get_detailed_progress`,
  TEST_PROGRESS: `${API_BASE_URL}/api/test_progress`,
  
  // Aptitude endpoints
  SUBMIT_APTITUDE_SCORE: `${API_BASE_URL}/api/submit_aptitude_score`,
  GET_APTITUDE_LEADERBOARD: `${API_BASE_URL}/api/get_aptitude_leaderboard`,
  
  // Test endpoints
  GET_TEST_HISTORY: `${API_BASE_URL}/api/get_test_history`,
  RECORD_TEST: `${API_BASE_URL}/api/record_test`,
  
  // Stats endpoint
  STATS: `${API_BASE_URL}/api/stats`,
  
  // Health check
  HEALTH: `${API_BASE_URL}/`,
};

export const SOCKET_CONFIG = {
  URL: SOCKET_URL,
  OPTIONS: {
    transports: ['websocket', 'polling'],
    timeout: 20000,
    forceNew: true
  }
};

export default API_ENDPOINTS;
import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { FaClock, FaCheckCircle, FaTimesCircle, FaTrophy, FaUsers, FaMedal } from 'react-icons/fa';
import { categories, difficulties, questions } from '../aptitudeQuestions';
import { API_ENDPOINTS } from '../config/api';

export default function Aptitude() {
  const { getToken } = useAuth();
  const [currentStep, setCurrentStep] = useState('category'); // 'category', 'subcategory', 'difficulty', 'test', 'result'
  

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [testStarted, setTestStarted] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    let timer;
    if (testStarted && timeLeft > 0 && !showResult) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            calculateScore();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [testStarted, timeLeft, showResult]);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.GET_APTITUDE_LEADERBOARD);
      if (!res.ok) {
        throw new Error(`Failed to fetch leaderboard: ${res.status}`);
      }
      const data = await res.json();
      setLeaderboard(data);
    } catch (error) {
      console.error('Leaderboard error:', error);
      // Set empty leaderboard on error
      setLeaderboard([]);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentStep('subcategory');
  };

  const handleSubcategorySelect = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setCurrentStep('difficulty');
  };

  const handleDifficultySelect = (difficulty) => {
    setSelectedDifficulty(difficulty);
    startQuiz(difficulty);
  };

  const startQuiz = (difficulty) => {
    const filtered = questions.filter(q => 
      q.subcategory === selectedSubcategory && q.difficulty === difficulty
    );
    const shuffled = filtered.sort(() => 0.5 - Math.random()).slice(0, 10);
    setQuizQuestions(shuffled);
    setUserAnswers(new Array(shuffled.length).fill(null));
    setCurrentQuestionIndex(0);
    setShowResult(false);
    setScore(0);
    setTimeLeft(600); // Reset timer
    setTestStarted(true);
    setCurrentStep('test');
  };

  const handleAnswer = (optionIndex) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setUserAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateScore();
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = async () => {
    let newScore = 0;
    userAnswers.forEach((ans, i) => {
      if (ans === quizQuestions[i].correct) newScore += 1;
    });
    setScore(newScore);
    setShowResult(true);
    setTestStarted(false);
    setCurrentStep('result');
    
    try {
      const token = await getToken();
      const res = await fetch(API_ENDPOINTS.SUBMIT_APTITUDE_SCORE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ score: newScore }),
      });
      if (!res.ok) {
        throw new Error(`Failed to submit score: ${res.status}`);
      }
      const { rank } = await res.json();
      setUserRank(rank);
      fetchLeaderboard();
    } catch (error) {
      console.error('Score submission error:', error);
      // Continue with local score display even if submission fails
    }
  };

  const resetTest = () => {
    setCurrentStep('category');
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSelectedDifficulty(null);
    setQuizQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setShowResult(false);
    setScore(0);
    setTestStarted(false);
    setTimeLeft(600);
  };

  const getScoreColor = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return 'Excellent! Outstanding performance!';
    if (percentage >= 80) return 'Great job! Well done!';
    if (percentage >= 70) return 'Good work! Keep it up!';
    if (percentage >= 60) return 'Not bad! Room for improvement.';
    return 'Keep practicing! You can do better!';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Timer and Question Info - Only show during test */}
        {testStarted && (
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-4">
              <div className="bg-red-100 dark:bg-red-900 px-4 py-2 rounded-lg">
                <span className={`text-red-600 dark:text-red-400 font-semibold ${timeLeft <= 60 ? 'timer-pulse' : ''}`}>
                  Time Left: {formatTime(timeLeft)}
                </span>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-lg">
                <span className="text-blue-600 dark:text-blue-400 font-semibold">
                  Question {currentQuestionIndex + 1} of {quizQuestions.length}
                </span>
              </div>
            </div>
          </div>
        )}
        {/* Progress Bar */}
        {currentStep !== 'category' && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Progress</span>
              <button
                onClick={resetTest}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Start Over
              </button>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: currentStep === 'subcategory' ? '25%' : 
                         currentStep === 'difficulty' ? '50%' : 
                         currentStep === 'test' ? '75%' : '100%'
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Category Selection */}
        {currentStep === 'category' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4">Choose Your Test Category</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Select a category to begin your aptitude test. Each test contains 10 questions with a 10-minute time limit.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map((category, index) => (
                <div
                  key={index}
                  onClick={() => handleCategorySelect(category)}
                  className="aptitude-card group cursor-pointer bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg card-hover border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 btn-hover-effect"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {category.name}
                    </h3>
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                      <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {category.subcategories.length} subcategories available
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {category.subcategories.slice(0, 3).map((sub, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-sm">
                        {sub.length > 20 ? sub.substring(0, 20) + '...' : sub}
                      </span>
                    ))}
                    {category.subcategories.length > 3 && (
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-sm">
                        +{category.subcategories.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subcategory Selection */}
        {currentStep === 'subcategory' && selectedCategory && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">{selectedCategory.name}</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Choose a specific topic to focus your test on
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedCategory.subcategories.map((subcategory, index) => (
                <div
                  key={index}
                  onClick={() => handleSubcategorySelect(subcategory)}
                  className="cursor-pointer bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md card-hover border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 btn-hover-effect"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    {subcategory}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Click to select this topic
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Difficulty Selection */}
        {currentStep === 'difficulty' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Select Difficulty Level</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                Topic: <span className="font-semibold text-blue-600 dark:text-blue-400">{selectedSubcategory}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Choose your preferred difficulty level to start the test
              </p>
            </div>
            
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
                {difficulties.map((difficulty, index) => {
                  const colors = {
                    easy: 'from-green-400 to-green-600',
                    medium: 'from-yellow-400 to-orange-500',
                    hard: 'from-red-400 to-red-600'
                  };
                  const descriptions = {
                    easy: 'Perfect for beginners and quick practice',
                    medium: 'Balanced difficulty for regular practice',
                    hard: 'Challenging questions for advanced preparation'
                  };
                  
                  return (
                    <div
                      key={index}
                      onClick={() => handleDifficultySelect(difficulty)}
                      className="cursor-pointer bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg card-hover border border-gray-200 dark:border-gray-700 btn-hover-effect"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <div className={`w-16 h-16 bg-gradient-to-r ${colors[difficulty]} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <span className="text-white font-bold text-xl">
                          {difficulty.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-center mb-2 capitalize">
                        {difficulty}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-center text-sm">
                        {descriptions[difficulty]}
                      </p>
                      <div className="mt-4 text-center">
                        <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold">
                          Start Test
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Test Interface */}
        {currentStep === 'test' && quizQuestions.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 question-slide-in">
              {/* Question Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg font-semibold">
                    {selectedSubcategory}
                  </span>
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-lg text-sm capitalize">
                    {selectedDifficulty}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Progress</div>
                  <div className="text-lg font-semibold">
                    {currentQuestionIndex + 1} / {quizQuestions.length}
                  </div>
                </div>
              </div>

              {/* Progress Bar for Questions */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-8">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full progress-bar"
                  style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
                ></div>
              </div>

              {/* Question */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-6 leading-relaxed">
                  {quizQuestions[currentQuestionIndex].question}
                </h3>
                
                <div className="space-y-3">
                  {quizQuestions[currentQuestionIndex].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      className={`w-full p-4 rounded-xl text-left transition-all duration-200 border-2 ${
                        userAnswers[currentQuestionIndex] === idx
                          ? 'bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-700 dark:text-blue-300'
                          : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 text-sm font-semibold ${
                          userAnswers[currentQuestionIndex] === idx
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <button
                  onClick={previousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                
                <div className="flex space-x-2">
                  {quizQuestions.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-3 h-3 rounded-full ${
                        idx === currentQuestionIndex
                          ? 'bg-blue-500'
                          : userAnswers[idx] !== null
                          ? 'bg-green-500'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    ></div>
                  ))}
                </div>

                <button
                  onClick={nextQuestion}
                  disabled={userAnswers[currentQuestionIndex] === null}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {currentQuestionIndex < quizQuestions.length - 1 ? 'Next' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {currentStep === 'result' && showResult && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center aptitude-card">
              <div className="mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold mb-2">Test Completed!</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {getScoreMessage(score, quizQuestions.length)}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {selectedSubcategory}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">Topic</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <div className={`text-3xl font-bold ${getScoreColor(score, quizQuestions.length)}`}>
                    {score} / {quizQuestions.length}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">Score</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {Math.round((score / quizQuestions.length) * 100)}%
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">Accuracy</div>
                </div>
              </div>

              {userRank && (
                <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800 rounded-xl p-4 mb-6">
                  <p className="text-yellow-800 dark:text-yellow-200 font-semibold">
                    🏆 Your Rank: #{userRank}
                  </p>
                </div>
              )}

              <div className="flex justify-center space-x-4">
                <button
                  onClick={resetTest}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors btn-hover-effect"
                >
                  Take Another Test
                </button>
                <button
                  onClick={() => setCurrentStep('category')}
                  className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors btn-hover-effect"
                >
                  Change Category
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        {(currentStep === 'category' || currentStep === 'result') && (
          <div className="mt-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">🏆 Leaderboard</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Top performers in aptitude tests
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden custom-scrollbar">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4">
                <h4 className="text-white font-semibold text-center">Top Scorers</h4>
              </div>
              <div className="p-6">
                {leaderboard.length > 0 ? (
                  <div className="space-y-3">
                    {leaderboard.slice(0, 10).map((entry, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                            index === 0 ? 'bg-yellow-400 text-yellow-900 animate-pulse' :
                            index === 1 ? 'bg-gray-400 text-gray-900' :
                            index === 2 ? 'bg-orange-400 text-orange-900' :
                            'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                          }`}>
                            {index + 1}
                          </div>
                          <span className="font-medium">{entry.username}</span>
                        </div>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {entry.score} pts
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No scores yet. Be the first to take a test!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
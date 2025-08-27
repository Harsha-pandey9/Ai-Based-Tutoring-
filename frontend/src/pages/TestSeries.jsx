import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { FaClock, FaCheckCircle, FaTimesCircle, FaTrophy, FaChartLine, FaBook, FaGraduationCap, FaRocket, FaLightbulb, FaUsers } from 'react-icons/fa';
import { API_ENDPOINTS } from '../config/api';

// Sample previous year question papers data
const questionPapers = {
  "B.Tech": {
    "Computer Science": {
      "2023": [
        {
          question: "What is the time complexity of binary search algorithm?",
          options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
          correct: 1,
          marks: 4
        },
        {
          question: "Which data structure uses LIFO principle?",
          options: ["Queue", "Stack", "Array", "Linked List"],
          correct: 1,
          marks: 4
        },
        {
          question: "What does SQL stand for?",
          options: ["Structured Query Language", "Simple Query Language", "Standard Query Language", "System Query Language"],
          correct: 0,
          marks: 4
        },
        {
          question: "Which sorting algorithm has the best average case time complexity?",
          options: ["Bubble Sort", "Selection Sort", "Merge Sort", "Insertion Sort"],
          correct: 2,
          marks: 4
        },
        {
          question: "What is the purpose of a constructor in OOP?",
          options: ["To destroy objects", "To initialize objects", "To copy objects", "To compare objects"],
          correct: 1,
          marks: 4
        }
      ],
      "2022": [
        {
          question: "Which protocol is used for secure web communication?",
          options: ["HTTP", "HTTPS", "FTP", "SMTP"],
          correct: 1,
          marks: 4
        },
        {
          question: "What is the maximum value of a signed 8-bit integer?",
          options: ["127", "128", "255", "256"],
          correct: 0,
          marks: 4
        },
        {
          question: "Which of the following is not a programming paradigm?",
          options: ["Object-Oriented", "Functional", "Procedural", "Algorithmic"],
          correct: 3,
          marks: 4
        },
        {
          question: "What does API stand for?",
          options: ["Application Programming Interface", "Advanced Programming Interface", "Automated Programming Interface", "Application Process Interface"],
          correct: 0,
          marks: 4
        },
        {
          question: "Which database model uses tables to store data?",
          options: ["Hierarchical", "Network", "Relational", "Object-oriented"],
          correct: 2,
          marks: 4
        }
      ],
      "2021": [
        {
          question: "What is the space complexity of merge sort?",
          options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
          correct: 2,
          marks: 4
        },
        {
          question: "Which layer of OSI model handles routing?",
          options: ["Physical", "Data Link", "Network", "Transport"],
          correct: 2,
          marks: 4
        },
        {
          question: "What is polymorphism in OOP?",
          options: ["Multiple inheritance", "Method overloading", "Data hiding", "One interface, multiple implementations"],
          correct: 3,
          marks: 4
        },
        {
          question: "Which algorithm is used for finding shortest path in a graph?",
          options: ["DFS", "BFS", "Dijkstra's", "Kruskal's"],
          correct: 2,
          marks: 4
        },
        {
          question: "What is the primary key in a database?",
          options: ["A unique identifier", "A foreign key", "An index", "A constraint"],
          correct: 0,
          marks: 4
        }
      ]
    },
    "Mathematics": {
      "2023": [
        {
          question: "What is the derivative of sin(x)?",
          options: ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"],
          correct: 0,
          marks: 4
        },
        {
          question: "What is the integral of 1/x?",
          options: ["ln(x)", "x²/2", "1/x²", "e^x"],
          correct: 0,
          marks: 4
        },
        {
          question: "What is the value of π (pi) approximately?",
          options: ["3.14", "3.141", "3.1416", "3.14159"],
          correct: 3,
          marks: 4
        },
        {
          question: "What is the determinant of a 2x2 identity matrix?",
          options: ["0", "1", "2", "-1"],
          correct: 1,
          marks: 4
        },
        {
          question: "What is the limit of (sin x)/x as x approaches 0?",
          options: ["0", "1", "∞", "undefined"],
          correct: 1,
          marks: 4
        }
      ],
      "2022": [
        {
          question: "What is the second derivative of x³?",
          options: ["3x²", "6x", "x²", "3x"],
          correct: 1,
          marks: 4
        },
        {
          question: "What is the area under the curve y = x² from 0 to 1?",
          options: ["1/2", "1/3", "1/4", "1"],
          correct: 1,
          marks: 4
        },
        {
          question: "What is the rank of a 3x3 zero matrix?",
          options: ["0", "1", "2", "3"],
          correct: 0,
          marks: 4
        },
        {
          question: "What is the sum of angles in a triangle?",
          options: ["90°", "180°", "270°", "360°"],
          correct: 1,
          marks: 4
        },
        {
          question: "What is the value of e (Euler's number) approximately?",
          options: ["2.718", "2.71", "2.7", "3.14"],
          correct: 0,
          marks: 4
        }
      ]
    },
    "Physics": {
      "2023": [
        {
          question: "What is the speed of light in vacuum?",
          options: ["3 × 10⁸ m/s", "3 × 10⁶ m/s", "3 × 10¹⁰ m/s", "3 × 10⁴ m/s"],
          correct: 0,
          marks: 4
        },
        {
          question: "What is Newton's second law of motion?",
          options: ["F = ma", "F = mv", "F = ma²", "F = m/a"],
          correct: 0,
          marks: 4
        },
        {
          question: "What is the unit of electric current?",
          options: ["Volt", "Ampere", "Ohm", "Watt"],
          correct: 1,
          marks: 4
        },
        {
          question: "What is the acceleration due to gravity on Earth?",
          options: ["9.8 m/s²", "10 m/s²", "9.6 m/s²", "8.9 m/s²"],
          correct: 0,
          marks: 4
        },
        {
          question: "What is the formula for kinetic energy?",
          options: ["½mv²", "mv²", "½mv", "m²v"],
          correct: 0,
          marks: 4
        }
      ]
    }
  },
  "M.Tech": {
    "Computer Science": {
      "2023": [
        {
          question: "What is the worst-case time complexity of QuickSort?",
          options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
          correct: 1,
          marks: 5
        },
        {
          question: "Which consensus algorithm is used in Bitcoin?",
          options: ["Proof of Stake", "Proof of Work", "PBFT", "Raft"],
          correct: 1,
          marks: 5
        },
        {
          question: "What is the purpose of MapReduce?",
          options: ["Data visualization", "Distributed computing", "Database indexing", "Network routing"],
          correct: 1,
          marks: 5
        },
        {
          question: "Which machine learning algorithm is best for classification?",
          options: ["Linear Regression", "K-means", "SVM", "PCA"],
          correct: 2,
          marks: 5
        }
      ]
    }
  },
  "B.Sc": {
    "Mathematics": {
      "2023": [
        {
          question: "What is the derivative of e^x?",
          options: ["e^x", "xe^x", "e^(x-1)", "ln(x)"],
          correct: 0,
          marks: 3
        },
        {
          question: "What is the sum of first n natural numbers?",
          options: ["n(n+1)/2", "n(n-1)/2", "n²", "n(n+1)"],
          correct: 0,
          marks: 3
        },
        {
          question: "What is the value of cos(90°)?",
          options: ["0", "1", "-1", "√2/2"],
          correct: 0,
          marks: 3
        }
      ]
    }
  }
};

export default function TestSeries() {
  const { getToken } = useAuth();
  const [currentStep, setCurrentStep] = useState('selection'); // 'selection', 'paper-selection', 'test', 'result'
  const [formData, setFormData] = useState({ year: '', course: '', subject: '', paperYear: '' });
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [availablePaperYears, setAvailablePaperYears] = useState([]);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalMarks, setTotalMarks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10800); // 3 hours = 10800 seconds
  const [testStarted, setTestStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [testHistory, setTestHistory] = useState([]);

  useEffect(() => {
    fetchTestHistory();
  }, []);

  useEffect(() => {
    let timer;
    if (testStarted && timeLeft > 0 && !showResult) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [testStarted, timeLeft, showResult]);

  const fetchTestHistory = async () => {
    try {
      const token = await getToken();
      const res = await fetch(API_ENDPOINTS.GET_TEST_HISTORY, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTestHistory(data);
      }
    } catch (error) {
      console.error('Failed to fetch test history:', error);
    }
  };

  const recordTest = async (testData) => {
    try {
      const token = await getToken();
      await fetch(API_ENDPOINTS.RECORD_TEST, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(testData),
      });
      fetchTestHistory();
    } catch (error) {
      console.error('Failed to record test:', error);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'course') {
      const subjects = questionPapers[value] ? Object.keys(questionPapers[value]) : [];
      setAvailableSubjects(subjects);
      setFormData(prev => ({ ...prev, subject: '', paperYear: '' }));
      setAvailablePaperYears([]);
    }

    if (name === 'subject' && formData.course) {
      const paperYears = questionPapers[formData.course][value] ? Object.keys(questionPapers[formData.course][value]) : [];
      setAvailablePaperYears(paperYears);
      setFormData(prev => ({ ...prev, paperYear: '' }));
    }
  };

  const handleProceedToTest = () => {
    if (formData.course && formData.subject && formData.paperYear) {
      setCurrentStep('paper-selection');
    }
  };

  const startTest = () => {
    const questions = questionPapers[formData.course][formData.subject][formData.paperYear];
    setCurrentQuestions(questions);
    setUserAnswers(new Array(questions.length).fill(null));
    setCurrentQuestionIndex(0);
    setTotalMarks(questions.reduce((sum, q) => sum + q.marks, 0));
    setTimeLeft(10800); // Reset to 3 hours
    setTestStarted(true);
    setCurrentStep('test');
  };

  const handleAnswer = (optionIndex) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setUserAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitTest = () => {
    let newScore = 0;
    let obtainedMarks = 0;

    userAnswers.forEach((answer, index) => {
      if (answer === currentQuestions[index].correct) {
        newScore++;
        obtainedMarks += currentQuestions[index].marks;
      }
    });

    setScore(newScore);
    setTestStarted(false);
    setShowResult(true);
    setCurrentStep('result');

    // Record test data
    const testData = {
      course: formData.course,
      subject: formData.subject,
      year: formData.year,
      paperYear: formData.paperYear,
      score: newScore,
      totalQuestions: currentQuestions.length,
      obtainedMarks,
      totalMarks,
      percentage: Math.round((obtainedMarks / totalMarks) * 100),
      timeTaken: 10800 - timeLeft,
      date: new Date().toISOString()
    };

    recordTest(testData);
  };

  const resetTest = () => {
    setCurrentStep('selection');
    setFormData({ year: '', course: '', subject: '', paperYear: '' });
    setAvailableSubjects([]);
    setAvailablePaperYears([]);
    setCurrentQuestions([]);
    setUserAnswers([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTotalMarks(0);
    setTimeLeft(10800);
    setTestStarted(false);
    setShowResult(false);
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    return 'F';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Timer - Only show during test */}
        {testStarted && (
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-4">
              <div className={`px-6 py-3 rounded-lg font-semibold text-lg ${
                timeLeft <= 600 ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 animate-pulse' : 
                'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
              }`}>
                Time Remaining: {formatTime(timeLeft)}
              </div>
              <div className="bg-green-100 dark:bg-green-900 px-4 py-2 rounded-lg">
                <span className="text-green-600 dark:text-green-400 font-semibold">
                  Question {currentQuestionIndex + 1} of {currentQuestions.length}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Course and Subject Selection */}
        {currentStep === 'selection' && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Previous Year Question Papers</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Select your course, subject, and year to access previous year question papers. Each test has a 3-hour time limit.
              </p>
            </div>

            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Academic Year</label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Academic Year</option>
                    <option value="1st">1st Year</option>
                    <option value="2nd">2nd Year</option>
                    <option value="3rd">3rd Year</option>
                    <option value="4th">4th Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Course</label>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Course</option>
                    <option value="B.Tech">B.Tech (Bachelor of Technology)</option>
                    <option value="M.Tech">M.Tech (Master of Technology)</option>
                    <option value="B.Sc">B.Sc (Bachelor of Science)</option>
                    <option value="M.Sc">M.Sc (Master of Science)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={!formData.course}
                  >
                    <option value="">Select Subject</option>
                    {availableSubjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Question Paper Year</label>
                  <select
                    name="paperYear"
                    value={formData.paperYear}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={!formData.subject}
                  >
                    <option value="">Select Paper Year</option>
                    {availablePaperYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleProceedToTest}
                  disabled={!formData.year || !formData.course || !formData.subject || !formData.paperYear}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  Proceed to Test
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Paper Selection Confirmation */}
        {currentStep === 'paper-selection' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Test Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                    <div className="text-sm text-blue-600 dark:text-blue-400">Course</div>
                    <div className="font-semibold">{formData.course}</div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                    <div className="text-sm text-green-600 dark:text-green-400">Subject</div>
                    <div className="font-semibold">{formData.subject}</div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
                    <div className="text-sm text-purple-600 dark:text-purple-400">Paper Year</div>
                    <div className="font-semibold">{formData.paperYear}</div>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900 p-4 rounded-lg">
                    <div className="text-sm text-orange-600 dark:text-orange-400">Duration</div>
                    <div className="font-semibold">3 Hours</div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Instructions:</h3>
                <ul className="text-yellow-700 dark:text-yellow-300 space-y-1">
                  <li>• Total time allowed: 3 hours</li>
                  <li>• You can navigate between questions using Previous/Next buttons</li>
                  <li>• Test will auto-submit when time expires</li>
                  <li>• Make sure you have a stable internet connection</li>
                  <li>• Click "Submit Test" when you're done</li>
                </ul>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setCurrentStep('selection')}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Back to Selection
                </button>
                <button
                  onClick={startTest}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  Start Test
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Test Interface */}
        {currentStep === 'test' && currentQuestions.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              {/* Question Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {userAnswers.filter(a => a !== null).length} of {currentQuestions.length} answered
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Question */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    Question {currentQuestionIndex + 1}
                  </h3>
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-semibold">
                    {currentQuestions[currentQuestionIndex].marks} marks
                  </span>
                </div>
                
                <p className="text-xl mb-6 leading-relaxed">
                  {currentQuestions[currentQuestionIndex].question}
                </p>
                
                <div className="space-y-3">
                  {currentQuestions[currentQuestionIndex].options.map((option, idx) => (
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
                  {currentQuestions.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`w-8 h-8 rounded-full text-sm font-semibold transition-colors ${
                        idx === currentQuestionIndex
                          ? 'bg-blue-500 text-white'
                          : userAnswers[idx] !== null
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-400 dark:hover:bg-gray-500'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                {currentQuestionIndex < currentQuestions.length - 1 ? (
                  <button
                    onClick={nextQuestion}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitTest}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    Submit Test
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {currentStep === 'result' && showResult && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
              <div className="mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold mb-2">Test Completed!</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {formData.course} - {formData.subject} ({formData.paperYear})
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-50 dark:bg-blue-900 rounded-xl p-6">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {score}
                  </div>
                  <div className="text-blue-600 dark:text-blue-400 text-sm">Correct Answers</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900 rounded-xl p-6">
                  <div className={`text-3xl font-bold ${getScoreColor(Math.round((score / currentQuestions.length) * 100))}`}>
                    {Math.round((score / currentQuestions.length) * 100)}%
                  </div>
                  <div className="text-green-600 dark:text-green-400 text-sm">Percentage</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900 rounded-xl p-6">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {getGrade(Math.round((score / currentQuestions.length) * 100))}
                  </div>
                  <div className="text-purple-600 dark:text-purple-400 text-sm">Grade</div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900 rounded-xl p-6">
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                    {formatTime(10800 - timeLeft)}
                  </div>
                  <div className="text-orange-600 dark:text-orange-400 text-sm">Time Taken</div>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={resetTest}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Take Another Test
                </button>
                <button
                  onClick={() => setCurrentStep('selection')}
                  className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Back to Selection
                </button>
              </div>
            </div>

            {/* Test History */}
            {testHistory.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold mb-6 text-center">Your Test History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3">Date</th>
                        <th className="text-left py-3">Course</th>
                        <th className="text-left py-3">Subject</th>
                        <th className="text-left py-3">Year</th>
                        <th className="text-left py-3">Score</th>
                        <th className="text-left py-3">Percentage</th>
                        <th className="text-left py-3">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testHistory.slice(0, 5).map((test, index) => (
                        <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                          <td className="py-3">{new Date(test.date).toLocaleDateString()}</td>
                          <td className="py-3">{test.course}</td>
                          <td className="py-3">{test.subject}</td>
                          <td className="py-3">{test.paperYear}</td>
                          <td className="py-3">{test.score}/{test.totalQuestions}</td>
                          <td className={`py-3 font-semibold ${getScoreColor(test.percentage)}`}>
                            {test.percentage}%
                          </td>
                          <td className="py-3 font-semibold">{getGrade(test.percentage)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
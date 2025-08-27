import { Link } from "react-router-dom";
import {
  FaBookOpen,
  FaFilePdf,
  FaVideo,
  FaGamepad,
  FaTasks,
  FaBrain,
  FaInfoCircle,
  FaRocket,
  FaUsers,
  FaClock,
  FaRobot,
  FaGraduationCap,
  FaChartLine,
  FaStar,
  FaLightbulb,
  FaCode,
  FaMicrophone,
  FaEdit,
} from "react-icons/fa";
import { useEffect } from "react";
import { useAuth, useUser } from '@clerk/clerk-react';
import { API_ENDPOINTS } from '../config/api';

export default function Home() {
  const { isSignedIn } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    const recordLogin = async () => {
      if (isSignedIn) {
        try {
          const token = await getToken();
          await fetch(API_ENDPOINTS.RECORD_LOGIN, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (error) {
          console.error('Failed to record login:', error);
        }
      }
    };
    recordLogin();
  }, [isSignedIn, getToken]);
  const sections = [
    {
      name: "Quantum Series",
      description: "Quick revision notes and chapter-wise breakdowns with AI-powered insights for comprehensive learning.",
      icon: <FaBrain className="text-amber-600 dark:text-amber-400" />,
      path: "/quantumseries",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      name: "PDF Notes",
      description: "Downloadable AI-generated study notes in PDF format with structured content and visual aids.",
      icon: <FaFilePdf className="text-red-700 dark:text-red-400" />,
      path: "/pdfnotes",
      gradient: "from-red-600 to-rose-500",
    },
    {
      name: "Video Lectures",
      description: "AI-curated video lessons for immersive visual learning experience with expert instructors.",
      icon: <FaVideo className="text-blue-700 dark:text-blue-300" />,
      path: "/videolec",
      gradient: "from-blue-600 to-indigo-500",
    },
    {
      name: "Smart Games",
      description: "AI-powered educational games designed to enhance cognitive abilities and problem-solving skills.",
      icon: <FaGamepad className="text-emerald-600 dark:text-emerald-400" />,
      path: "/games",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      name: "AI Test Series",
      description: "Intelligent mock tests with personalized feedback, detailed analytics, and performance tracking.",
      icon: <FaTasks className="text-orange-600 dark:text-orange-400" />,
      path: "/test-series",
      gradient: "from-orange-500 to-amber-500",
    },
    {
      name: "Progress Tracker",
      description: "AI-driven analytics to monitor your learning journey, set goals, and track achievements.",
      icon: <FaChartLine className="text-violet-600 dark:text-violet-400" />,
      path: "/progress",
      gradient: "from-violet-500 to-purple-500",
    },
  ];

  const aiFeatures = [
    {
      icon: <FaRobot className="text-5xl text-blue-700" />,
      title: "AI Personal Tutor",
      description: "24/7 personalized AI assistance tailored to your learning style and pace with intelligent recommendations",
    },
    {
      icon: <FaLightbulb className="text-5xl text-amber-600" />,
      title: "Smart Learning Insights",
      description: "Advanced AI-powered learning analytics providing deep insights into your performance and study patterns",
    },
    {
      icon: <FaCode className="text-5xl text-emerald-600" />,
      title: "Intelligent Code Assistant",
      description: "AI-powered coding help with real-time debugging, code optimization, and best practice suggestions",
    },
    {
      icon: <FaMicrophone className="text-5xl text-violet-600" />,
      title: "Voice-Powered Learning",
      description: "Interactive voice-based learning with advanced AI speech recognition and natural language processing",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-amber-50 dark:from-slate-900 dark:via-stone-900 dark:to-amber-900 text-slate-800 dark:text-slate-100">
      
      {/* Hero Section with Classic Design */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-800 via-stone-800 to-amber-800 dark:from-slate-900 dark:via-stone-900 dark:to-amber-900">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-24 h-24 bg-amber-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-32 right-20 w-20 h-20 bg-blue-400 rounded-full opacity-25 animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-emerald-400 rounded-full opacity-20 animate-ping"></div>
          <div className="absolute bottom-32 right-1/3 w-18 h-18 bg-violet-400 rounded-full opacity-25 animate-pulse"></div>
        </div>
        
        <div className="relative z-10 py-24 px-4 sm:px-10 lg:px-20 text-center text-white">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10">
              <div className="relative mx-auto w-48 h-48 flex items-center justify-center">
                {/* Main Logo Circle */}
                <div className="w-40 h-40 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-full shadow-2xl flex items-center justify-center border-4 border-white/30 animate-pulse">
                  <div className="text-center">
                    <div className="text-4xl font-black text-white mb-1">A</div>
                    <div className="text-xs font-bold text-white/90 tracking-wider">ALPHA</div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute top-2 right-2 w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full shadow-lg flex items-center justify-center animate-bounce">
                  <span className="text-white font-bold text-lg">X</span>
                </div>
                
                <div className="absolute bottom-2 left-2 w-8 h-8 bg-gradient-to-r from-green-400 to-teal-500 rounded-full shadow-lg animate-ping opacity-75"></div>
                
                <div className="absolute top-1/2 left-0 w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full shadow-lg animate-pulse"></div>
                
                <div className="absolute top-1/2 right-0 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg animate-pulse"></div>
              </div>
            </div>
            <h1 className="text-6xl sm:text-8xl font-extrabold mb-8 bg-gradient-to-r from-amber-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
              ALPHA-X AI
            </h1>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-amber-200">
              The Future of Intelligent Learning
            </h2>
            <p className="text-xl sm:text-2xl mb-10 text-slate-200 max-w-4xl mx-auto leading-relaxed">
              Experience the next generation of AI-powered education with personalized learning paths, intelligent tutoring systems, and adaptive assessments designed for academic excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link 
                to="/chat" 
                className="px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-900 font-bold text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
              >
                <FaRobot className="text-xl" /> Start AI Learning Journey
              </Link>
              <Link 
                to="/about" 
                className="px-10 py-5 bg-white/20 backdrop-blur-sm text-white font-semibold text-lg rounded-full border-2 border-white/40 hover:bg-white/30 transition-all duration-300"
              >
                Discover More Features
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-24 px-4 sm:px-10 lg:px-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-700 to-amber-700 bg-clip-text text-transparent">
              AI-Powered Learning Features
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed">
              Discover how cutting-edge artificial intelligence transforms your educational experience with personalized learning, intelligent feedback, and adaptive content delivery.
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto rounded-full mt-8"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {aiFeatures.map((feature, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-slate-50 to-stone-50 dark:from-slate-900 dark:to-stone-900 p-10 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3">
                  <div className="text-center mb-6">
                    {feature.icon}
                  </div>
                  <h4 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white text-center">
                    {feature.title}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-center leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-24 px-4 sm:px-10 lg:px-20 bg-gradient-to-r from-slate-100 via-stone-100 to-amber-100 dark:from-slate-800 dark:via-stone-800 dark:to-amber-800">
        <h2 className="text-5xl sm:text-6xl font-bold text-center mb-8 bg-gradient-to-r from-slate-700 to-amber-700 bg-clip-text text-transparent">
          Comprehensive Learning Modules
        </h2>
        <p className="text-xl text-center mb-16 text-slate-600 dark:text-slate-300 max-w-4xl mx-auto">
          Explore our extensive collection of AI-enhanced learning modules designed to accelerate your academic and professional growth.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {sections.map((section, index) => (
            <Link
              to={section.path}
              key={index}
              className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${section.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-500`}></div>
              <div className="relative p-10">
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-8 bg-gradient-to-r from-slate-100 to-amber-100 dark:from-slate-700 dark:to-amber-700 rounded-3xl shadow-inner">
                  <div className="text-4xl">{section.icon}</div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white text-center">{section.name}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-center mb-8 leading-relaxed">{section.description}</p>
                <div className="text-center">
                  <button className="px-8 py-4 bg-gradient-to-r from-slate-700 to-amber-700 text-white font-semibold rounded-full hover:from-slate-800 hover:to-amber-800 transition-all duration-300 transform group-hover:scale-105 shadow-lg">
                    Explore Module
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-24 px-4 sm:px-10 lg:px-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-700 to-blue-700 bg-clip-text text-transparent">
              Learning Impact & Success
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Join thousands of successful learners who have transformed their careers with our AI-powered education platform.
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 mx-auto rounded-full mt-8"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative p-10 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="mb-6">
                  <img 
                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&h=100&fit=crop&crop=center" 
                    alt="Active Students" 
                    className="w-20 h-20 mx-auto rounded-full shadow-lg border-4 border-blue-200"
                  />
                </div>
                <FaUsers className="text-5xl text-blue-700 dark:text-blue-300 mb-4 mx-auto" />
                <h4 className="text-4xl font-bold text-blue-800 dark:text-blue-300 mb-3">25,000+</h4>
                <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">Active AI Learners</p>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative p-10 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900 dark:to-teal-900 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="mb-6">
                  <img 
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop&crop=center" 
                    alt="AI Interactions" 
                    className="w-20 h-20 mx-auto rounded-full shadow-lg border-4 border-emerald-200"
                  />
                </div>
                <FaBrain className="text-5xl text-emerald-700 dark:text-emerald-300 mb-4 mx-auto" />
                <h4 className="text-4xl font-bold text-emerald-800 dark:text-emerald-300 mb-3">1M+</h4>
                <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">AI Interactions</p>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative p-10 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900 dark:to-purple-900 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="mb-6">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=center" 
                    alt="Learning Hours" 
                    className="w-20 h-20 mx-auto rounded-full shadow-lg border-4 border-violet-200"
                  />
                </div>
                <FaClock className="text-5xl text-violet-700 dark:text-violet-300 mb-4 mx-auto" />
                <h4 className="text-4xl font-bold text-violet-800 dark:text-violet-300 mb-3">500K+</h4>
                <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">Learning Hours</p>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative p-10 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900 dark:to-orange-900 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="mb-6">
                  <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=100&h=100&fit=crop&crop=center" 
                    alt="Success Rate" 
                    className="w-20 h-20 mx-auto rounded-full shadow-lg border-4 border-amber-200"
                  />
                </div>
                <FaStar className="text-5xl text-amber-700 dark:text-amber-300 mb-4 mx-auto" />
                <h4 className="text-4xl font-bold text-amber-800 dark:text-amber-300 mb-3">98%</h4>
                <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Courses Section */}
      <section className="bg-gradient-to-br from-slate-50 to-stone-50 dark:from-slate-900 dark:to-stone-900 pt-24 pb-12 px-6 md:px-10 lg:px-20" id="courses">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-700 to-emerald-700 bg-clip-text text-transparent">
              Professional Course Catalog
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed">
              Master in-demand programming languages and technologies with our AI-enhanced tutorials, interactive coding exercises, and industry-focused learning paths.
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 mx-auto rounded-full mt-8"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[
              { 
                title: "HTML5", 
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg", 
                video: "https://www.youtube.com/embed/UB1O30fR-EE",
                description: "Structure modern web content with semantic markup",
                color: "from-orange-600 to-red-600"
              },
              { 
                title: "CSS3", 
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg", 
                video: "https://www.youtube.com/embed/yfoY53QXEnI",
                description: "Advanced styling and responsive design techniques",
                color: "from-blue-600 to-indigo-600"
              },
              { 
                title: "JavaScript", 
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", 
                video: "https://www.youtube.com/embed/W6NZfCO5SIk",
                description: "Interactive programming and modern ES6+ features",
                color: "from-yellow-500 to-orange-500"
              },
              { 
                title: "Java", 
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg", 
                video: "https://www.youtube.com/embed/grEKMHGYyns",
                description: "Enterprise-grade application development",
                color: "from-red-600 to-orange-700"
              },
              { 
                title: "Python", 
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", 
                video: "https://www.youtube.com/embed/rfscVS0vtbw",
                description: "AI, Machine Learning, and Data Science mastery",
                color: "from-blue-600 to-emerald-600"
              },
              { 
                title: "SQL", 
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg", 
                video: "https://www.youtube.com/embed/7S_tz1z_5bA",
                description: "Advanced database management and optimization",
                color: "from-blue-600 to-violet-600"
              },
              { 
                title: "MongoDB", 
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg", 
                video: "https://www.youtube.com/embed/-56x56UppqQ",
                description: "NoSQL database design and implementation",
                color: "from-emerald-600 to-teal-600"
              },
              { 
                title: "React", 
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", 
                video: "https://www.youtube.com/embed/bMknfKXIFA8",
                description: "Modern UI development with component architecture",
                color: "from-cyan-600 to-blue-600"
              },
              { 
                title: "Node.js", 
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", 
                video: "https://www.youtube.com/embed/TlB_eWDSMt4",
                description: "Scalable backend development and API design",
                color: "from-emerald-700 to-lime-600"
              },
              { 
                title: "C++", 
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg", 
                video: "https://www.youtube.com/embed/vLnPwxZdW4Y",
                description: "System programming and performance optimization",
                color: "from-blue-700 to-violet-700"
              },
              { 
                title: "TypeScript", 
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", 
                video: "https://www.youtube.com/embed/zQnBQ4tB3ZA",
                description: "Type-safe JavaScript for large-scale applications",
                color: "from-blue-600 to-indigo-700"
              },
              { 
                title: "Git & GitHub", 
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg", 
                video: "https://www.youtube.com/embed/RGOj5yH7evk",
                description: "Professional version control and collaboration",
                color: "from-orange-600 to-red-600"
              },
            ].map((course, i) => (
              <div key={i} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${course.color} opacity-0 group-hover:opacity-15 rounded-3xl transition-opacity duration-500`}></div>
                <a
                  href={course.video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:border-amber-500 dark:hover:border-amber-400"
                >
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 p-5 bg-gradient-to-br from-slate-50 to-stone-50 dark:from-slate-800 dark:to-stone-800 rounded-3xl shadow-inner">
                      <img src={course.logo} alt={course.title} className="w-full h-full object-contain" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">{course.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">{course.description}</p>
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-700 to-amber-700 text-white text-sm font-semibold rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <FaVideo className="text-xs" />
                      Watch Course
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 px-4 sm:px-10 lg:px-20 bg-gradient-to-r from-slate-800 via-stone-800 to-amber-800 dark:from-slate-900 dark:via-stone-900 dark:to-amber-900 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-10">
            <img 
              src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=120&h=120&fit=crop&crop=center" 
              alt="Future of Learning" 
              className="w-28 h-28 mx-auto rounded-full shadow-2xl border-4 border-amber-300/50"
            />
          </div>
          <h2 className="text-5xl sm:text-6xl font-bold mb-8">
            Transform Your Learning Experience
          </h2>
          <p className="text-xl mb-12 text-slate-200 max-w-4xl mx-auto leading-relaxed">
            Join thousands of ambitious learners who are already experiencing the future of education with our AI-powered learning platform. Get personalized guidance, intelligent feedback, and accelerated skill development.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              to="/chat" 
              className="px-12 py-5 bg-white text-slate-800 font-bold text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
            >
              <FaRobot className="text-xl" /> Start Your AI Learning Journey
            </Link>
            <Link 
              to="/progress" 
              className="px-10 py-5 bg-white/20 backdrop-blur-sm text-white font-semibold text-lg rounded-full border-2 border-white/40 hover:bg-white/30 transition-all duration-300"
            >
              Track Your Progress
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
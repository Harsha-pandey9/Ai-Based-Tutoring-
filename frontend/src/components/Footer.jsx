import { Link } from "react-router-dom";
import {
  FaGithub,
  FaYoutube,
  FaFacebook,
  FaLinkedin,
  FaInstagram,
  FaCode,
  FaBrain,
  FaChartLine,
  FaGamepad,
  FaRocket,
  FaGraduationCap,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Coding Playground", path: "/coding-playground" },
    { name: "Mock Interview", path: "/mock-interview" },
    { name: "Test Series", path: "/test-series" },
    { name: "Progress Tracker", path: "/progress" }
  ];

  const learningResources = [
    { name: "Video Lectures", path: "/videolec", icon: <FaCode className="text-sm" /> },
    { name: "PDF Notes", path: "/pdfnotes", icon: <FaBrain className="text-sm" /> },
    { name: "Quantum Series", path: "/quantumseries", icon: <FaRocket className="text-sm" /> },
    { name: "Educational Games", path: "/games", icon: <FaGamepad className="text-sm" /> },
    { name: "Aptitude Tests", path: "/aptitude", icon: <FaChartLine className="text-sm" /> }
  ];

  const socialLinks = [
    { name: "GitHub", url: "https://github.com", icon: <FaGithub />, color: "hover:text-gray-400" },
    { name: "LinkedIn", url: "https://linkedin.com", icon: <FaLinkedin />, color: "hover:text-blue-400" },
    { name: "Twitter", url: "https://twitter.com", icon: <FaXTwitter />, color: "hover:text-blue-300" },
    { name: "YouTube", url: "https://youtube.com", icon: <FaYoutube />, color: "hover:text-red-400" },
    { name: "Instagram", url: "https://instagram.com", icon: <FaInstagram />, color: "hover:text-pink-400" }
  ];

  return (
    <footer className="bg-gradient-to-r from-slate-900 via-stone-900 to-amber-900 dark:from-black dark:via-slate-900 dark:to-stone-900 text-slate-300 transition-colors duration-300">
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <Link to="/" className="group flex items-center mb-4">
                <h2 className="text-3xl font-black text-transparent bg-gradient-to-r from-amber-300 via-orange-300 to-red-300 bg-clip-text">
                  ALPHA-X
                </h2>
              </Link>
              <p className="text-slate-400 leading-relaxed mb-6">
                Empowering the next generation of learners with AI-powered education, personalized learning paths, and cutting-edge technology.
              </p>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <FaEnvelope className="text-amber-400" />
                <span>contact@alpha-x.ai</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <FaPhone className="text-amber-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <FaMapMarkerAlt className="text-amber-400" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <FaRocket className="text-amber-400" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="text-slate-400 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learning Resources */}
          <div>
            <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <FaGraduationCap className="text-amber-400" />
              Learning Hub
            </h4>
            <ul className="space-y-3">
              {learningResources.map((resource, index) => (
                <li key={index}>
                  <Link 
                    to={resource.path} 
                    className="text-slate-400 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center gap-3 group"
                  >
                    <span className="text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {resource.icon}
                    </span>
                    {resource.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h4 className="text-xl font-bold text-white mb-6">Stay Connected</h4>
            
            {/* Social Links */}
            <div className="flex gap-4 mb-8">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-all duration-200 transform hover:scale-110 ${social.color}`}
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Newsletter Signup */}
            <div>
              <h5 className="text-lg font-semibold text-white mb-3">Newsletter</h5>
              <p className="text-slate-400 text-sm mb-4">
                Get the latest updates on new courses and features.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-200 font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Copyright */}
            <div className="text-slate-400 text-sm">
              © {currentYear} ALPHA-X. All rights reserved. Built with{" "}
              <span className="text-red-400">❤️</span> for the future of learning.
            </div>

            {/* Legal Links */}
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className="text-slate-400 hover:text-white transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-slate-400 hover:text-white transition-colors duration-200">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-slate-400 hover:text-white transition-colors duration-200">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
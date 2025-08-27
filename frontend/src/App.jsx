import { Routes, Route } from "react-router-dom";
import { SignIn } from "@clerk/clerk-react";
import { Suspense, lazy } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import FloatingChatButton from "./components/FloatingChatButton";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";
import DebugInfo from "./components/DebugInfo";
import Aptitude from "./pages/Aptitude";
import CodingPlayground from "./pages/CodingPlayground";
import TestPage from "./pages/TestPage";

// Lazy-loaded Pages
const Home = lazy(() => import("./pages/Home"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const Games = lazy(() => import("./pages/Games"));
const About = lazy(() => import("./pages/About"));
const ProgressTracker = lazy(() => import("./pages/ProgressTracker"));
const TestSeries = lazy(() => import("./pages/TestSeries"));
const QuantumSeries = lazy(() => import("./pages/QuantumNotes"));
const PdfNotes = lazy(() => import("./pages/PdfNotes"));
const VideoLectures = lazy(() => import("./pages/VideoLectures"));
const MockInterview = lazy(() => import("./pages/MockInterview"));
const MockInterviewDebug = lazy(() => import("./pages/MockInterviewDebug"));
const MockInterviewWorking = lazy(() => import("./pages/MockInterviewWorking"));
const InterviewTest = lazy(() => import("./components/InterviewTest"));

// Lazy-loaded Game Components
const Minesweeper = lazy(() => import("./components/Minesweeper"));
const Pong = lazy(() => import("./components/Pong"));
const WhacAMole = lazy(() => import("./components/WhacAMole"));

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 p-0 bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner message="Loading page..." />}>
          <Routes>
            <Route path="/test" element={<TestPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<SignIn routing="path" path="/login" />} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
            <Route path="/games" element={<ProtectedRoute><Games /></ProtectedRoute>} />
            <Route path="/games/minesweeper" element={<ProtectedRoute><Minesweeper /></ProtectedRoute>} />
            <Route path="/games/pong" element={<ProtectedRoute><Pong /></ProtectedRoute>} />
            <Route path="/games/whac-a-mole" element={<ProtectedRoute><WhacAMole /></ProtectedRoute>} />
            <Route path="/progress" element={<ProtectedRoute><ProgressTracker /></ProtectedRoute>} />
            <Route path="/test-series" element={<ProtectedRoute><TestSeries /></ProtectedRoute>} />
            <Route path="/quantumseries" element={<ProtectedRoute><QuantumSeries /></ProtectedRoute>} />
            <Route path="/pdfnotes" element={<ProtectedRoute><PdfNotes /></ProtectedRoute>} />
            <Route path="/videolec" element={<ProtectedRoute><VideoLectures /></ProtectedRoute>} />
            <Route path="/mock-interview" element={<ProtectedRoute><MockInterviewWorking /></ProtectedRoute>} />
            <Route path="/mock-interview-debug" element={<ProtectedRoute><MockInterviewDebug /></ProtectedRoute>} />
            <Route path="/interview-test" element={<ProtectedRoute><InterviewTest /></ProtectedRoute>} />
            <Route path="/aptitude" element={<ProtectedRoute><Aptitude /></ProtectedRoute>} />
            <Route path="/coding-playground" element={<ProtectedRoute><CodingPlayground /></ProtectedRoute>} />
          </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer className=" rounded-0 m-0" />
      <FloatingChatButton />
      <DebugInfo />
    </div>
  );
}
import { Routes, Route } from "react-router-dom";
import { SignIn } from "@clerk/clerk-react";
import { Suspense, lazy } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import FloatingChatButton from "./components/FloatingChatButton";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";
import LazyComponentWrapper from "./components/LazyComponentWrapper";
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
        <Routes>
          <Route path="/test" element={<TestPage />} />
          <Route path="/about" element={
            <LazyComponentWrapper componentName="About">
              <About />
            </LazyComponentWrapper>
          } />
          <Route path="/login" element={<SignIn routing="path" path="/login" />} />
          <Route path="/" element={
            <ProtectedRoute>
              <LazyComponentWrapper componentName="Home">
                <Home />
              </LazyComponentWrapper>
            </ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute>
              <LazyComponentWrapper componentName="Chat">
                <ChatPage />
              </LazyComponentWrapper>
            </ProtectedRoute>
          } />
          <Route path="/games" element={
            <ProtectedRoute>
              <LazyComponentWrapper componentName="Games">
                <Games />
              </LazyComponentWrapper>
            </ProtectedRoute>
          } />
          <Route path="/games/minesweeper" element={
            <ProtectedRoute>
              <LazyComponentWrapper componentName="Minesweeper">
                <Minesweeper />
              </LazyComponentWrapper>
            </ProtectedRoute>
          } />
          <Route path="/games/pong" element={
            <ProtectedRoute>
              <LazyComponentWrapper componentName="Pong">
                <Pong />
              </LazyComponentWrapper>
            </ProtectedRoute>
          } />
          <Route path="/games/whac-a-mole" element={
            <ProtectedRoute>
              <LazyComponentWrapper componentName="Whac-a-Mole">
                <WhacAMole />
              </LazyComponentWrapper>
            </ProtectedRoute>
          } />
          <Route path="/progress" element={
            <ProtectedRoute>
              <LazyComponentWrapper componentName="Progress Tracker">
                <ProgressTracker />
              </LazyComponentWrapper>
            </ProtectedRoute>
          } />
          <Route path="/test-series" element={
            <ProtectedRoute>
              <LazyComponentWrapper componentName="Test Series">
                <TestSeries />
              </LazyComponentWrapper>
            </ProtectedRoute>
          } />
          <Route path="/quantumseries" element={
            <ProtectedRoute>
              <LazyComponentWrapper componentName="Quantum Notes">
                <QuantumSeries />
              </LazyComponentWrapper>
            </ProtectedRoute>
          } />
          <Route path="/pdfnotes" element={
            <ProtectedRoute>
              <LazyComponentWrapper componentName="PDF Notes">
                <PdfNotes />
              </LazyComponentWrapper>
            </ProtectedRoute>
          } />
          <Route path="/videolec" element={
            <ProtectedRoute>
              <LazyComponentWrapper componentName="Video Lectures">
                <VideoLectures />
              </LazyComponentWrapper>
            </ProtectedRoute>
          } />
          <Route path="/mock-interview" element={
            <ProtectedRoute>
              <LazyComponentWrapper componentName="Mock Interview">
                <MockInterviewWorking />
              </LazyComponentWrapper>
            </ProtectedRoute>
          } />
          <Route path="/mock-interview-debug" element={
            <ProtectedRoute>
              <LazyComponentWrapper componentName="Mock Interview Debug">
                <MockInterviewDebug />
              </LazyComponentWrapper>
            </ProtectedRoute>
          } />
          <Route path="/interview-test" element={
            <ProtectedRoute>
              <LazyComponentWrapper componentName="Interview Test">
                <InterviewTest />
              </LazyComponentWrapper>
            </ProtectedRoute>
          } />
          <Route path="/aptitude" element={
            <ProtectedRoute>
              <LazyComponentWrapper componentName="Aptitude Test">
                <Aptitude />
              </LazyComponentWrapper>
            </ProtectedRoute>
          } />
          <Route path="/coding-playground" element={
            <ProtectedRoute>
              <LazyComponentWrapper componentName="Coding Playground">
                <CodingPlayground />
              </LazyComponentWrapper>
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer className=" rounded-0 m-0" />
      <FloatingChatButton />
      <DebugInfo />
    </div>
  );
}
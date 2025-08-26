import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";
import { FaUserCircle, FaPaperPlane, FaCode, FaCopy, FaPlay, FaStop, FaTrash, FaDownload, FaLightbulb } from "react-icons/fa";
import { BsRobot, BsMarkdown } from "react-icons/bs";
import { MdRefresh } from "react-icons/md";

const Chat = ({ onClose }) => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your AI Learning Assistant. I'm here to help you with your studies, coding questions, academic challenges, and more. How can I assist you today?"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!prompt.trim()) return;

    const userMessage = { role: "user", content: prompt };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setPrompt("");
    setLoading(true);

    try {
      // Send conversation history for context
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          prompt,
          history: messages.slice(-10) // Send last 10 messages for context
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.response },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "I apologize, but I encountered an error. Please try again or rephrase your question." },
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm having trouble connecting right now. Please check your internet connection and try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-stone-50 dark:from-slate-900 dark:to-stone-900">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-700 to-amber-700 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center shadow-lg">
            <BsRobot className="text-xl text-slate-800" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Alpha-X AI Assistant</h3>
            <p className="text-sm text-amber-200">Your Personal Learning Companion</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white hover:bg-red-500 hover:text-white p-2 rounded-full transition-all duration-200 w-8 h-8 flex items-center justify-center"
          >
            ✕
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-slate-50 to-stone-100 dark:from-slate-800 dark:to-stone-900">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-4 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" && (
              <div className="flex items-start gap-3 max-w-4xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg flex-shrink-0">
                  <BsRobot className="text-lg text-white" />
                </div>
                <div className="px-6 py-4 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-600 max-w-3xl">
                  <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                </div>
              </div>
            )}
            {msg.role === "user" && (
              <div className="flex items-start gap-3 max-w-4xl">
                <div className="px-6 py-4 bg-gradient-to-r from-slate-600 to-amber-600 text-white rounded-2xl shadow-lg max-w-3xl">
                  <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg flex-shrink-0">
                  <FaUserCircle className="text-lg text-white" />
                </div>
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
              <BsRobot className="text-lg text-white" />
            </div>
            <div className="px-6 py-4 bg-white dark:bg-slate-700 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-end space-x-4">
          <div className="flex-1">
            <textarea
              rows="1"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your studies, coding, or academic topics..."
              className="w-full resize-none rounded-2xl border border-slate-300 dark:border-slate-600 px-6 py-4 text-base bg-slate-50 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 min-h-[56px] max-h-32"
              style={{ 
                height: 'auto',
                minHeight: '56px'
              }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
              }}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={loading || !prompt.trim()}
            className="px-6 py-4 text-white bg-gradient-to-r from-slate-600 to-amber-600 hover:from-slate-700 hover:to-amber-700 rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 font-semibold min-w-[120px] justify-center"
          >
            <FaPaperPlane className="text-sm" />
            Send
          </button>
        </div>
        <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 text-center">
          Press Enter to send • Shift + Enter for new line
        </div>
      </div>
    </div>
  );
};

export default Chat;
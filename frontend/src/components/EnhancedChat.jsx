import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";
import { FaUserCircle, FaPaperPlane, FaCode, FaCopy, FaPlay, FaTrash, FaDownload, FaLightbulb, FaStop } from "react-icons/fa";
import { BsRobot, BsMarkdown } from "react-icons/bs";
import { MdRefresh, MdCheck } from "react-icons/md";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

const EnhancedChat = ({ onClose }) => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([
    {
      id: Date.now(),
      role: "assistant",
      content: `# Welcome to Alpha-X AI Assistant! 🎓

I'm your advanced AI learning companion with ChatGPT-like capabilities. Here's what I can help you with:

## 🚀 **My Capabilities:**

### 💻 **Programming & Development**
- Write, debug, and explain code in **Python, JavaScript, Java, C++, C#** and more
- **Execute code directly** in the chat with real-time results
- Provide step-by-step coding tutorials and best practices
- Help with algorithms, data structures, and software design

### 📚 **Academic Support**
- **Mathematics**: Algebra, Calculus, Statistics, Discrete Math
- **Sciences**: Physics, Chemistry, Biology, Engineering
- **Writing**: Essays, research papers, citations, proofreading
- **Study strategies** and exam preparation

### 🎯 **Interactive Features**
- **Code execution** with syntax highlighting
- **Copy code** with one click
- **Download conversations** as text files
- **Clear chat** history when needed
- **Markdown formatting** for better readability

### 💡 **Smart Assistance**
- Context-aware responses that remember our conversation
- Detailed explanations with examples
- Multiple solution approaches
- Real-world applications and use cases

---

**Try asking me:**
- "Write a Python function to sort a list"
- "Explain quantum physics concepts"
- "Help me with calculus derivatives"
- "Debug this JavaScript code"
- "Create a study plan for my exam"

What would you like to learn or work on today? 🌟`,
      timestamp: new Date().toISOString()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [executingCode, setExecutingCode] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const { getToken } = useAuth();
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 128) + 'px';
    }
  }, [prompt]);

  const sendMessage = async () => {
    if (!prompt.trim() || loading) return;

    const userMessage = { 
      id: Date.now(),
      role: "user", 
      content: prompt,
      timestamp: new Date().toISOString()
    };
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setPrompt("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          prompt,
          history: messages.slice(-10).map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          { 
            id: Date.now(),
            role: "assistant", 
            content: data.response,
            timestamp: new Date().toISOString()
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { 
            id: Date.now(),
            role: "assistant", 
            content: "I apologize, but I encountered an error. Please try again or rephrase your question.",
            timestamp: new Date().toISOString()
          },
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { 
          id: Date.now(),
          role: "assistant", 
          content: "I'm having trouble connecting right now. Please check your internet connection and try again.",
          timestamp: new Date().toISOString()
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const executeCode = async (code, language) => {
    setExecutingCode(true);
    try {
      const response = await fetch("http://localhost:5000/api/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, language }),
      });

      const data = await response.json();
      
      // Add execution result as a new message
      const resultMessage = {
        id: Date.now(),
        role: "assistant",
        content: `## Code Execution Result\n\n**Language:** ${language}\n\n**Output:**\n\`\`\`\n${data.output || 'No output'}\`\`\`\n\n${data.error ? `**Error:**\n\`\`\`\n${data.error}\`\`\`` : ''}${data.execution_time ? `\n**Execution Time:** ${data.execution_time.toFixed(3)}s` : ''}`,
        timestamp: new Date().toISOString(),
        isExecutionResult: true
      };
      
      setMessages(prev => [...prev, resultMessage]);
    } catch (error) {
      console.error("Code execution error:", error);
      const errorMessage = {
        id: Date.now(),
        role: "assistant",
        content: `## Code Execution Error\n\n\`\`\`\nFailed to execute code: ${error.message}\`\`\``,
        timestamp: new Date().toISOString(),
        isExecutionResult: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setExecutingCode(false);
    }
  };

  const copyToClipboard = async (text, messageId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        role: "assistant",
        content: "Chat cleared! How can I help you today?",
        timestamp: new Date().toISOString()
      }
    ]);
  };

  const downloadChat = () => {
    const chatContent = messages.map(msg => 
      `[${new Date(msg.timestamp).toLocaleString()}] ${msg.role.toUpperCase()}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alpha-x-chat-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderMessage = (msg) => {
    // Parse markdown-like content
    const content = msg.content;
    const parts = [];
    let currentIndex = 0;

    // Find code blocks
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > currentIndex) {
        parts.push({
          type: 'text',
          content: content.slice(currentIndex, match.index)
        });
      }

      // Add code block
      parts.push({
        type: 'code',
        language: match[1] || 'text',
        content: match[2].trim()
      });

      currentIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (currentIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.slice(currentIndex)
      });
    }

    // If no code blocks found, treat as single text part
    if (parts.length === 0) {
      parts.push({
        type: 'text',
        content: content
      });
    }

    return (
      <div className="space-y-4">
        {parts.map((part, index) => {
          if (part.type === 'code') {
            return (
              <div key={index} className="relative group">
                <div className="flex items-center justify-between bg-slate-800 text-white px-4 py-2 rounded-t-lg">
                  <span className="text-sm font-medium">{part.language}</span>
                  <div className="flex items-center gap-2">
                    {['python', 'javascript', 'java', 'cpp', 'c'].includes(part.language.toLowerCase()) && (
                      <button
                        onClick={() => executeCode(part.content, part.language.toLowerCase())}
                        disabled={executingCode}
                        className="flex items-center gap-1 px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-xs transition-colors disabled:opacity-50"
                        title="Execute Code"
                      >
                        {executingCode ? <FaStop className="text-xs" /> : <FaPlay className="text-xs" />}
                        {executingCode ? 'Running...' : 'Run'}
                      </button>
                    )}
                    <button
                      onClick={() => copyToClipboard(part.content, `${msg.id}-${index}`)}
                      className="flex items-center gap-1 px-2 py-1 bg-slate-600 hover:bg-slate-700 rounded text-xs transition-colors"
                      title="Copy Code"
                    >
                      {copiedMessageId === `${msg.id}-${index}` ? (
                        <>
                          <MdCheck className="text-xs" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <FaCopy className="text-xs" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <SyntaxHighlighter
                  language={part.language}
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                    fontSize: '14px'
                  }}
                >
                  {part.content}
                </SyntaxHighlighter>
              </div>
            );
          } else {
            // Render text with basic markdown formatting
            let textContent = part.content;
            
            // Convert markdown headers
            textContent = textContent.replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2 text-slate-800 dark:text-slate-200">$1</h3>');
            textContent = textContent.replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-6 mb-3 text-slate-800 dark:text-slate-200">$1</h2>');
            textContent = textContent.replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-6 mb-4 text-slate-800 dark:text-slate-200">$1</h1>');
            
            // Convert bold text
            textContent = textContent.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900 dark:text-slate-100">$1</strong>');
            
            // Convert inline code
            textContent = textContent.replace(/`([^`]+)`/g, '<code class="bg-slate-200 dark:bg-slate-600 px-1 py-0.5 rounded text-sm font-mono">$1</code>');
            
            // Convert bullet points
            textContent = textContent.replace(/^- (.*$)/gm, '<li class="ml-4 mb-1">• $1</li>');
            
            // Convert line breaks
            textContent = textContent.replace(/\n/g, '<br>');

            return (
              <div 
                key={index} 
                className="prose prose-slate dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: textContent }}
              />
            );
          }
        })}
      </div>
    );
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
            <p className="text-sm text-amber-200">ChatGPT-like Learning Companion</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            className="text-white hover:bg-slate-600 p-2 rounded-full transition-all duration-200"
            title="Clear Chat"
          >
            <FaTrash className="text-sm" />
          </button>
          <button
            onClick={downloadChat}
            className="text-white hover:bg-slate-600 p-2 rounded-full transition-all duration-200"
            title="Download Chat"
          >
            <FaDownload className="text-sm" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white hover:bg-red-500 p-2 rounded-full transition-all duration-200"
              title="Close Chat"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-slate-50 to-stone-100 dark:from-slate-800 dark:to-stone-900">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-4 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" && (
              <div className="flex items-start gap-3 max-w-5xl w-full">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg flex-shrink-0 ${
                  msg.isExecutionResult 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                }`}>
                  {msg.isExecutionResult ? <FaCode className="text-lg text-white" /> : <BsRobot className="text-lg text-white" />}
                </div>
                <div className="px-6 py-4 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-600 flex-1 min-w-0">
                  {renderMessage(msg)}
                  <div className="flex items-center justify-between mt-4 pt-2 border-t border-slate-200 dark:border-slate-600">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                    <button
                      onClick={() => copyToClipboard(msg.content, msg.id)}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                    >
                      {copiedMessageId === msg.id ? (
                        <>
                          <MdCheck className="text-xs" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <FaCopy className="text-xs" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
            {msg.role === "user" && (
              <div className="flex items-start gap-3 max-w-4xl">
                <div className="px-6 py-4 bg-gradient-to-r from-slate-600 to-amber-600 text-white rounded-2xl shadow-lg max-w-3xl">
                  <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                  <div className="mt-2 pt-2 border-t border-slate-500">
                    <span className="text-xs text-slate-200">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
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
              ref={textareaRef}
              rows="1"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about programming, math, science, or any academic topic..."
              className="w-full resize-none rounded-2xl border border-slate-300 dark:border-slate-600 px-6 py-4 text-base bg-slate-50 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 min-h-[56px] max-h-32"
              style={{ 
                height: 'auto',
                minHeight: '56px'
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
          Press Enter to send • Shift + Enter for new line • Code execution available for Python, JavaScript, Java, C++, C
        </div>
      </div>
    </div>
  );
};

export default EnhancedChat;
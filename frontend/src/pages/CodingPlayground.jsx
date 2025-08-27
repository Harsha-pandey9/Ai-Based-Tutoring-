import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { useAuth } from '@clerk/clerk-react';
import { 
  FaPlay, 
  FaStop, 
  FaCopy, 
  FaDownload, 
  FaCode, 
  FaTerminal, 
  FaLightbulb, 
  FaRocket,
  FaSave,
  FaUpload,
  FaCog,
  FaExpand,
  FaCompress,
  FaClock
} from 'react-icons/fa';
import { BsCodeSlash } from 'react-icons/bs';
import { API_ENDPOINTS } from '../config/api';

const CodingPlayground = () => {
  const { getToken } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [theme, setTheme] = useState('vs-dark');
  const [fontSize, setFontSize] = useState(16);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [executionTime, setExecutionTime] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  // Language configurations with simple Hello World starter code
  const languages = {
    python: {
      name: 'Python',
      extension: '.py',
      starterCode: `print("Hello, World!")`,
      icon: '🐍'
    },
    javascript: {
      name: 'JavaScript',
      extension: '.js',
      starterCode: `console.log("Hello, World!");`,
      icon: '🟨'
    },
    java: {
      name: 'Java',
      extension: '.java',
      starterCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
      icon: '☕'
    },
    cpp: {
      name: 'C++',
      extension: '.cpp',
      starterCode: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
      icon: '⚡'
    },
    c: {
      name: 'C',
      extension: '.c',
      starterCode: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
      icon: '🔧'
    }
  };

  // Set starter code when language changes
  useEffect(() => {
    if (languages[selectedLanguage]) {
      setCode(languages[selectedLanguage].starterCode);
      setOutput('');
    }
  }, [selectedLanguage]);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Configure editor options
    editor.updateOptions({
      fontSize: fontSize,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      wordWrap: 'on',
      lineNumbers: 'on',
      folding: true,
      bracketMatching: 'always',
      autoIndent: 'full',
      formatOnPaste: true,
      formatOnType: true
    });

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      runCode();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      saveCode();
    });
  };

  const runCode = async () => {
    if (!code.trim()) {
      setOutput('Error: No code to execute');
      return;
    }

    setIsRunning(true);
    setOutput('Running code...');
    const startTime = Date.now();

    try {
      const response = await fetch(API_ENDPOINTS.EXECUTE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: code,
          language: selectedLanguage
        })
      });

      const result = await response.json();
      const endTime = Date.now();
      setExecutionTime((endTime - startTime) / 1000);

      if (result.success) {
        let outputText = '';
        if (result.output) {
          outputText += `${result.output}`;
        }
        if (result.error && result.error.trim()) {
          outputText += `\n\nWarnings:\n${result.error}`;
        }
        outputText += `\n\n✅ Execution completed in ${result.execution_time.toFixed(3)}s`;
        setOutput(outputText || 'Code executed successfully (no output)');
      } else {
        setOutput(`❌ Error:\n${result.error}\n\n${result.output ? `Output:\n${result.output}` : ''}`);
      }
    } catch (error) {
      setOutput(`🌐 Network Error: ${error.message}\n\nMake sure the backend server is running and accessible`);
    } finally {
      setIsRunning(false);
    }
  };

  const saveCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code${languages[selectedLanguage].extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadCode = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCode(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const clearOutput = () => {
    setOutput('');
  };

  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'min-h-screen'} bg-gradient-to-br from-slate-50 via-stone-50 to-amber-50 dark:from-slate-900 dark:via-stone-900 dark:to-amber-900 transition-colors duration-300`}>
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-700 to-amber-700 dark:from-slate-300 dark:to-amber-300 bg-clip-text text-transparent flex items-center gap-2">
                <FaCode /> Code Playground
              </h1>
              
              {/* Language Selector */}
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-6 py-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-200 font-medium text-lg transition-colors duration-300 focus:ring-2 focus:ring-amber-500"
              >
                {Object.entries(languages).map(([key, lang]) => (
                  <option key={key} value={key}>
                    {lang.icon} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-3">
              <button
                onClick={runCode}
                disabled={isRunning}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-lg font-medium text-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
              >
                {isRunning ? <FaStop /> : <FaPlay />}
                {isRunning ? 'Running...' : 'Run Code'}
              </button>

              <button
                onClick={saveCode}
                className="px-4 py-3 bg-slate-600 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg transition-all duration-200 shadow-lg"
                title="Save Code (Ctrl+S)"
              >
                <FaSave className="text-lg" />
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={loadCode}
                accept=".py,.js,.java,.cpp,.c,.txt"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-3 bg-slate-600 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg transition-all duration-200 shadow-lg"
                title="Load Code File"
              >
                <FaUpload className="text-lg" />
              </button>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className="px-4 py-3 bg-slate-600 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg transition-all duration-200 shadow-lg"
                title="Settings"
              >
                <FaCog className="text-lg" />
              </button>

              <button
                onClick={toggleFullscreen}
                className="px-4 py-3 bg-slate-600 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg transition-all duration-200 shadow-lg"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <FaCompress className="text-lg" /> : <FaExpand className="text-lg" />}
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="mt-4 p-6 bg-slate-100 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 transition-colors duration-300">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Editor Theme:</label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-sm transition-colors duration-300"
                  >
                    <option value="vs-dark">Dark Theme</option>
                    <option value="light">Light Theme</option>
                    <option value="hc-black">High Contrast</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Font Size:</label>
                  <input
                    type="range"
                    min="12"
                    max="28"
                    value={fontSize}
                    onChange={(e) => {
                      setFontSize(parseInt(e.target.value));
                      if (editorRef.current) {
                        editorRef.current.updateOptions({ fontSize: parseInt(e.target.value) });
                      }
                    }}
                    className="w-24"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400 w-12">{fontSize}px</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content - Much Larger */}
        <div className="flex-1 flex overflow-hidden">
          {/* Code Editor - Takes up 70% of the width */}
          <div className="flex-1 flex flex-col" style={{ width: '70%' }}>
            <div className="bg-slate-200 dark:bg-slate-700 px-6 py-3 border-b border-slate-300 dark:border-slate-600 transition-colors duration-300">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-slate-700 dark:text-slate-300">
                  {languages[selectedLanguage].name} Editor
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Press Ctrl+Enter to run • Ctrl+S to save
                </span>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <Editor
                height="100%"
                theme={theme}
                language={selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage}
                value={code}
                onChange={(value) => setCode(value || '')}
                onMount={handleEditorDidMount}
                options={{
                  fontSize: fontSize,
                  minimap: { enabled: true },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  wordWrap: 'on',
                  lineNumbers: 'on',
                  folding: true,
                  bracketMatching: 'always',
                  autoIndent: 'full',
                  formatOnPaste: true,
                  formatOnType: true,
                  suggestOnTriggerCharacters: true,
                  quickSuggestions: true,
                  parameterHints: { enabled: true },
                  hover: { enabled: true },
                  tabSize: 4,
                  insertSpaces: true
                }}
              />
            </div>
          </div>

          {/* Output Panel - Takes up 30% of the width */}
          <div className="flex flex-col border-l border-slate-300 dark:border-slate-600 transition-colors duration-300" style={{ width: '30%' }}>
            <div className="bg-slate-200 dark:bg-slate-700 px-6 py-3 border-b border-slate-300 dark:border-slate-600 transition-colors duration-300">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <FaTerminal /> Output Console
                </span>
                <div className="flex items-center gap-3">
                  {executionTime > 0 && (
                    <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <FaClock /> {executionTime.toFixed(3)}s
                    </span>
                  )}
                  <button
                    onClick={clearOutput}
                    className="text-sm px-3 py-1 bg-slate-600 hover:bg-slate-700 text-white rounded transition-all duration-200"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-slate-900 dark:bg-black text-green-400 dark:text-green-300 p-6 font-mono text-base overflow-auto transition-colors duration-300">
              <pre className="whitespace-pre-wrap leading-relaxed">
                {output || '🚀 Ready to run your code!\n\nClick the "Run Code" button or press Ctrl+Enter to execute your program.\n\nOutput will appear here...'}
              </pre>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-slate-800 dark:bg-slate-900 text-slate-300 dark:text-slate-400 px-6 py-3 text-base flex items-center justify-between transition-colors duration-300">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <span className="font-semibold">Language:</span> {languages[selectedLanguage].name}
            </span>
            <span className="flex items-center gap-2">
              <span className="font-semibold">Theme:</span> {theme === 'vs-dark' ? 'Dark' : theme === 'light' ? 'Light' : 'High Contrast'}
            </span>
            <span className="flex items-center gap-2">
              <span className="font-semibold">Font:</span> {fontSize}px
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span>Lines: {code.split('\n').length}</span>
            <span>Characters: {code.length}</span>
            {isRunning && (
              <span className="flex items-center gap-2 text-emerald-400">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                Executing...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingPlayground;
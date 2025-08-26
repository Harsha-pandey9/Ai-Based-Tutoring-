import EnhancedChat from "../components/EnhancedChat";

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-amber-50 dark:from-slate-900 dark:via-stone-900 dark:to-amber-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-700 to-amber-700 bg-clip-text text-transparent">
            Alpha-X AI Assistant
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto">
            Experience ChatGPT-like functionality with code execution, syntax highlighting, and advanced learning support. 
            Your ultimate AI companion for programming, academics, and problem-solving.
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700 dark:text-green-300">Code Execution Ready</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-full">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">AI Powered</span>
            </div>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-slate-500 to-amber-500 mx-auto rounded-full mt-6"></div>
        </div>

        {/* Chat Container */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="h-[80vh]">
            <EnhancedChat />
          </div>
        </div>
      </div>
    </div>
  );
}
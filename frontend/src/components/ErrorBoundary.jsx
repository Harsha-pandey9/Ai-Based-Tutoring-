import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                We encountered an error while loading this page. Please try refreshing or go back to the home page.
              </p>
              
              {/* Error details for debugging */}
              {this.state.error && (
                <details className="text-left bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
                  <summary className="cursor-pointer font-semibold text-red-600 dark:text-red-400 mb-2">
                    Error Details (Click to expand)
                  </summary>
                  <div className="mt-4 space-y-4">
                    <div>
                      <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2">Error Message:</h4>
                      <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-auto bg-red-50 dark:bg-red-900 p-3 rounded">
                        {this.state.error && this.state.error.toString()}
                      </pre>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2">Component Stack:</h4>
                      <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-auto bg-red-50 dark:bg-red-900 p-3 rounded">
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2">Stack Trace:</h4>
                      <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-auto bg-red-50 dark:bg-red-900 p-3 rounded max-h-64">
                        {this.state.error && this.state.error.stack}
                      </pre>
                    </div>
                  </div>
                </details>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  Refresh Page
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  Go to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
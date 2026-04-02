import React from 'react';
import { AlertTriangle, Home, Mail } from 'lucide-react';
import Button from '../ui/Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    // In production, you could send this to error tracking service
    // e.g., Sentry, LogRocket, etc.
    if (process.env.VITE_SENTRY_DSN) {
      // Sentry.captureException(error, { contexts: { react: errorInfo } });
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    
    // Optionally redirect to home
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-dark-navy via-dark-navy/95 to-accent/5 flex items-center justify-center px-4">
          <div className="max-w-md w-full">
            {/* Error Icon */}
            <div className="flex justify-center mb-8">
              <div className="p-4 rounded-full bg-red-500/20 border border-red-500/30">
                <AlertTriangle size={48} className="text-red-500" />
              </div>
            </div>

            {/* Error Message */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-3">Oops!</h1>
              <p className="text-light-bg/80 mb-4">
                Something went wrong. Our team has been notified.
              </p>

              {/* Error Details (Development Only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4 p-4 bg-dark-navy/50 rounded-lg border border-red-500/20 text-left">
                  <summary className="cursor-pointer font-semibold text-red-400 mb-2">
                    Error Details
                  </summary>
                  <pre className="text-xs text-light-bg/70 overflow-auto max-h-32">
                    {this.state.error.toString()}
                    {'\n\n'}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                variant="primary"
                size="lg"
                className="w-full justify-center"
                onClick={this.handleReset}
              >
                <Home size={20} className="mr-2" />
                Go Back Home
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full justify-center"
                onClick={() => (window.location.href = '/contact')}
              >
                <Mail size={20} className="mr-2" />
                Contact Support
              </Button>
            </div>

            {/* Footer Message */}
            <p className="text-center text-light-bg/60 text-sm mt-8">
              Error ID: {this.state.error?.message?.substring(0, 8) || 'unknown'}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

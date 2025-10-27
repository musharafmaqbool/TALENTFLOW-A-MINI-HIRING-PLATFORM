import { Component } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from './ui/Button';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
          <div className="max-w-md w-full glass rounded-2xl shadow-large p-8 text-center animate-scale-in">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-medium">
              <AlertCircle className="text-white" size={32} />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Oops! Something went wrong
            </h1>
            
            <p className="text-gray-600 mb-6">
              Don't worry, this happens sometimes. Try refreshing the page or going back to the home page.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 mb-2">
                  Show error details
                </summary>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-xs text-red-800 overflow-auto max-h-48">
                  <div className="font-bold mb-2">{this.state.error.toString()}</div>
                  <pre className="whitespace-pre-wrap">
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </div>
              </details>
            )}

            <div className="flex gap-3 justify-center">
              <Button onClick={this.handleReload} variant="primary" size="md">
                <RefreshCw size={18} className="mr-2" />
                Reload Page
              </Button>
              <Button onClick={this.handleReset} variant="secondary" size="md">
                <Home size={18} className="mr-2" />
                Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}


import { Component, ReactNode, ErrorInfo } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';
import { logger } from '../../lib/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Uncaught Exception in React Component Tree', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 text-white font-sans">
          <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto ring-8 ring-rose-500/5">
              <AlertOctagon className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-white">Application Exception Caught</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                An unexpected system error occurred in the AttendX AI workspace component tree.
              </p>
            </div>

            {this.state.error && (
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-left font-mono text-xs text-rose-400 overflow-x-auto max-h-40">
                <p className="font-bold">{this.state.error.toString()}</p>
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 text-xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reload AttendX Workspace</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

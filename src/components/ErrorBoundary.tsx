import * as React from 'react';
import { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorInfo: any | null;
}

class ErrorBoundary extends (React.Component as any) {
  constructor(props: any) {
    super(props);
    this.state = {
      hasError: false,
      errorInfo: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    try {
      const info = JSON.parse(error.message);
      return { hasError: true, errorInfo: info };
    } catch {
      return { hasError: true, errorInfo: { error: error.message } };
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-6 font-sans">
          <div className="max-w-2xl w-full bg-zinc-900 border border-red-500/30 rounded-[32px] p-8 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold text-red-500 tracking-tighter uppercase">Application Error</h2>
              <p className="text-white/50 text-sm">문제가 발생했습니다. 아래 정보를 확인해 주세요.</p>
            </div>

            <div className="bg-black/50 rounded-2xl p-6 overflow-auto max-h-[400px] border border-white/5">
              <pre className="text-xs font-mono text-red-400/80 leading-relaxed">
                {JSON.stringify(this.state.errorInfo, null, 2)}
              </pre>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-xs text-white/30 italic">
                * 권한 오류(Missing or insufficient permissions)가 발생한 경우, 관리자 계정(juon77911@gmail.com)으로 로그인했는지 확인해 주세요.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="w-full py-4 rounded-xl bg-white text-black font-bold hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                페이지 새로고침
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

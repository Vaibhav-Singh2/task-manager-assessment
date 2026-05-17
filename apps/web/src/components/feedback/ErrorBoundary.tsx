import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertBanner } from '@/components/feedback/AlertBanner';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    void error;
    void errorInfo;
    // Intentionally silent in UI; can be wired to telemetry later.
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <main className="mx-auto mt-8 max-w-2xl px-4">
          <AlertBanner message="Something went wrong. Please refresh and try again." />
        </main>
      );
    }

    return this.props.children;
  }
}

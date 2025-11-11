"use client";

import React, { Component, type ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  /** Compact mode for inline errors (e.g., tabs). Displays error in a card instead of full page. */
  compact?: boolean;
  /** Title to display in compact mode (e.g., "Core Stats Tab") */
  title?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error in development environment
    const context = this.props.compact && this.props.title ? ` in ${this.props.title}` : "";
    console.error(`Error Boundary caught an error${context}:`, error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Compact mode for inline errors (tabs, etc.)
      if (this.props.compact) {
        return (
          <Card className="border-destructive/30 bg-destructive/10">
            <CardHeader>
              <CardTitle className="text-destructive">
                {this.props.title ? `Error in ${this.props.title}` : "Error"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-foreground/80">
                Something went wrong while rendering this component. The error has been logged.
              </p>
              {this.state.error && (
                <div className="bg-white p-3 rounded border border-destructive/20">
                  <p className="text-xs font-mono text-destructive">{this.state.error.message}</p>
                </div>
              )}
              <Button
                onClick={this.handleRetry}
                variant="outline"
                size="sm"
                className="border-destructive/30 text-destructive hover:bg-destructive/10"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        );
      }

      // Full-page error display
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertTriangle className="h-12 w-12 text-destructive" />
              </div>
              <CardTitle className="text-destructive">Something went wrong</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-center">
                An unexpected error occurred while rendering this component.
              </p>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="bg-muted p-3 rounded text-sm">
                  <summary className="cursor-pointer font-medium text-foreground mb-2">
                    Error Details (Development)
                  </summary>
                  <pre className="whitespace-pre-wrap text-xs text-destructive">
                    {this.state.error.message}
                  </pre>
                  {this.state.errorInfo && (
                    <pre className="whitespace-pre-wrap text-xs text-muted-foreground mt-2">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </details>
              )}

              <div className="flex gap-2 justify-center">
                <Button
                  onClick={this.handleRetry}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
                <Button onClick={this.handleReload} size="sm">
                  Reload Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional component wrapper for easier use
export const ErrorBoundaryWrapper: React.FC<{
  children: ReactNode;
  fallback?: ReactNode;
  compact?: boolean;
  title?: string;
}> = ({ children, fallback, compact, title }) => {
  return (
    <ErrorBoundary fallback={fallback} compact={compact} title={title}>
      {children}
    </ErrorBoundary>
  );
};

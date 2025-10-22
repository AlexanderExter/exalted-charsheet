"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { logError } from "@/lib/logger";

interface Props {
  children: ReactNode;
  tabName: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class TabErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logError(`Error in ${this.props.tabName} tab:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="border-destructive/30 bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive">Error in {this.props.tabName} Tab</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-foreground/80">
              Something went wrong while rendering this tab. The error has been logged.
            </p>
            {this.state.error && (
              <div className="bg-white p-3 rounded border border-destructive/20">
                <p className="text-xs font-mono text-destructive">{this.state.error.message}</p>
              </div>
            )}
            <Button
              onClick={() => this.setState({ hasError: false, error: null })}
              variant="outline"
              className="border-destructive/30 text-destructive hover:bg-destructive/10"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

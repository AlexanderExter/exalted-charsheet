"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default function SiteHeader() {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            <Link href="/">Exalted: Essence Character Manager</Link>
          </h1>
          <Link
            href="/content/rules.md"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Rule Reference
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { ErrorBoundaryWrapper } from "@/components/ErrorBoundary";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "Exalted: Essence Character Manager",
  description:
    "A comprehensive digital character sheet manager for the Exalted: Essence tabletop RPG system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ErrorBoundaryWrapper>
          <TooltipProvider>
            <SiteHeader />
            {children}
            <SiteFooter />
            <Toaster richColors />
          </TooltipProvider>
        </ErrorBoundaryWrapper>
      </body>
    </html>
  );
}

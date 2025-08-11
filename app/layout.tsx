import type { Metadata } from "next";
import "./globals.css";
import { ErrorBoundaryWrapper } from "@/components/ErrorBoundary";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { Toaster } from "sonner";


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
          <SiteHeader />
          {children}
          <SiteFooter />
          <Toaster richColors />
        </ErrorBoundaryWrapper>
      </body>
    </html>
  );
}

import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { CharacterProvider } from "@/hooks/useCharacterContext"
import { ErrorBoundaryWrapper } from "@/components/ErrorBoundary"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Exalted: Essence Character Manager",
  description:
    "A comprehensive digital character sheet manager for the Exalted: Essence tabletop RPG system",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ErrorBoundaryWrapper>
          <CharacterProvider>{children}</CharacterProvider>
        </ErrorBoundaryWrapper>
      </body>
    </html>
  )
}

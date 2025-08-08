"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import ReactMarkdown from "react-markdown"

const SiteFooter = () => {
  const [showAboutModal, setShowAboutModal] = useState(false)
  const [showLegalModal, setShowLegalModal] = useState(false)
  const [aboutContent, setAboutContent] = useState("")
  const [legalContent, setLegalContent] = useState("")

  useEffect(() => {
    const loadMarkdownContent = async () => {
      try {
        const aboutResponse = await fetch("/content/about.md")
        const aboutText = await aboutResponse.text()
        setAboutContent(aboutText)

        const legalResponse = await fetch("/content/legal.md")
        const legalText = await legalResponse.text()
        setLegalContent(legalText)
      } catch (error) {
        setAboutContent("# About\n\nInformation about this application.")
        setLegalContent("# Legal\n\nLegal information and disclaimers.")
      }
    }

    loadMarkdownContent()
  }, [])

  return (
    <>
      <footer className="bg-gray-50 border-t border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-gray-600">
          <div>© 2024 Exalted Character Manager</div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowAboutModal(true)}
              className="hover:text-gray-800 underline"
            >
              About
            </button>
            <button
              onClick={() => setShowLegalModal(true)}
              className="hover:text-gray-800 underline"
            >
              Legal
            </button>
          </div>
        </div>
      </footer>

      {showAboutModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-y-auto m-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">About</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAboutModal(false)}
              >
                ×
              </Button>
            </div>
            <div className="prose prose-sm max-w-none text-gray-700">
              <ReactMarkdown>{aboutContent}</ReactMarkdown>
            </div>
            <div className="mt-6 pt-4 border-t">
              <Button onClick={() => setShowAboutModal(false)} className="w-full">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {showLegalModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-y-auto m-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Legal Information</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLegalModal(false)}
              >
                ×
              </Button>
            </div>
            <div className="prose prose-sm max-w-none text-gray-700">
              <ReactMarkdown>{legalContent}</ReactMarkdown>
            </div>
            <div className="mt-6 pt-4 border-t">
              <Button onClick={() => setShowLegalModal(false)} className="w-full">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SiteFooter


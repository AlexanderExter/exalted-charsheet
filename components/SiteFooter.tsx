"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SiteFooter() {
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [aboutContent, setAboutContent] = useState("");
  const [legalContent, setLegalContent] = useState("");

  useEffect(() => {
    const loadMarkdownContent = async () => {
      try {
        const aboutResponse = await fetch("/content/about.md");
        const aboutText = await aboutResponse.text();
        setAboutContent(aboutText);

        const legalResponse = await fetch("/content/legal.md");
        const legalText = await legalResponse.text();
        setLegalContent(legalText);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load footer content.");
        setAboutContent(
          "# About\n\nInformation about this application could not be loaded."
        );
        setLegalContent(
          "# Legal\n\nLegal information could not be loaded."
        );

      }
    };

    loadMarkdownContent();
  }, []);

  return (
    <>
      <footer className="border-t bg-background mt-8">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Exalted Community. All rights reserved.</p>
          <div className="mt-2 flex justify-center gap-4">
            <button onClick={() => setShowAboutModal(true)} className="hover:underline">
              About
            </button>
            <button onClick={() => setShowLegalModal(true)} className="hover:underline">
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
              <Button variant="outline" size="sm" onClick={() => setShowAboutModal(false)}>
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
              <Button variant="outline" size="sm" onClick={() => setShowLegalModal(false)}>
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
  );
}

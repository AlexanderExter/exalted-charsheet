"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

import { Button } from "@/components/ui/button";

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
        setAboutContent("# About\n\nInformation about this application.");
        setLegalContent("# Legal\n\nLegal information and disclaimers.");
      }
    };

    loadMarkdownContent();
  }, []);

  return (
    <>
      <footer className="border-t bg-background mt-8">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <h3 className="font-semibold mb-2">Resources</h3>
              <div className="flex justify-center gap-2">
                <Button asChild size="sm">
                  <a
                    href="https://www.drivethrurpg.com/browse.php?keywords=Exalted&affiliate_id="
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Buy Exalted Books
                  </a>
                </Button>
                <Button asChild size="sm">
                  <a
                    href="https://discord.gg/exalted"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Official Discord
                  </a>
                </Button>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">About</h3>
              <div className="flex justify-center">
                <button onClick={() => setShowAboutModal(true)} className="hover:underline">
                  About
                </button>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Legal</h3>
              <div className="flex justify-center">
                <button onClick={() => setShowLegalModal(true)} className="hover:underline">
                  Legal
                </button>
              </div>
            </div>
          </div>
          <p className="mt-6">&copy; {new Date().getFullYear()} Exalted Community. All rights reserved.</p>
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

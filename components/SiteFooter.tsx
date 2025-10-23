"use client";

import { useEffect, useState, lazy, Suspense } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { logError } from "@/lib/logger";

// Dynamic import - only loads when modals are opened
const ReactMarkdown = lazy(() => import("react-markdown"));

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
        logError(error);
        toast.error("Failed to load footer content.");
        setAboutContent("# About\n\nInformation about this application could not be loaded.");
        setLegalContent("# Legal\n\nLegal information could not be loaded.");
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
                  <a href="https://discord.gg/exalted" target="_blank" rel="noopener noreferrer">
                    Official Discord
                  </a>
                </Button>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">About</h3>
              <div className="flex justify-center">
                <Button
                  variant="link"
                  onClick={() => setShowAboutModal(true)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  About
                </Button>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Legal</h3>
              <div className="flex justify-center">
                <Button
                  variant="link"
                  onClick={() => setShowLegalModal(true)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Legal
                </Button>
              </div>
            </div>
          </div>
          <p className="mt-6">
            &copy; {new Date().getFullYear()} Exalted Community. All rights reserved.
          </p>
        </div>
      </footer>

      <Dialog open={showAboutModal} onOpenChange={setShowAboutModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>About</DialogTitle>
          </DialogHeader>
          <div className="prose prose-sm max-w-none text-foreground">
            <Suspense fallback={<div className="text-center py-8 text-muted-foreground">Loading...</div>}>
              <ReactMarkdown>{aboutContent}</ReactMarkdown>
            </Suspense>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowAboutModal(false)} className="w-full sm:w-auto">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showLegalModal} onOpenChange={setShowLegalModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Legal Information</DialogTitle>
          </DialogHeader>
          <div className="prose prose-sm max-w-none text-foreground">
            <Suspense fallback={<div className="text-center py-8 text-muted-foreground">Loading...</div>}>
              <ReactMarkdown>{legalContent}</ReactMarkdown>
            </Suspense>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowLegalModal(false)} className="w-full sm:w-auto">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

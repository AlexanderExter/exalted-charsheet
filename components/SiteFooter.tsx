"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

function AboutContent() {
  return (
    <>
      <h1 className="text-2xl font-bold">Exalted: Essence Character Manager</h1>
      <h2 className="text-xl font-semibold mt-6">Overview</h2>
      <p>
        This is a digital character manager built specifically for{" "}
        <strong>Exalted: Essence</strong>. It offers a streamlined, user-friendly way to create and
        manage your characters.
      </p>
      <Separator className="my-4" />
      <h2 className="text-xl font-semibold">Technology</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <strong>Next.js 16</strong>
        </li>
        <li>
          <strong>React 19</strong>
        </li>
        <li>
          <strong>TypeScript</strong>
        </li>
        <li>
          <strong>Dexie (IndexedDB)</strong> for persistent storage
        </li>
        <li>
          <strong>shadcn/ui + Radix UI</strong> components
        </li>
        <li>
          <strong>Tailwind CSS 4</strong> styling
        </li>
        <li>
          <strong>Lucide React</strong> icons
        </li>
        <li>All code generated with the help of AI</li>
      </ul>
      <Separator className="my-4" />
      <h2 className="text-xl font-semibold">Buy Exalted Books</h2>
      <p>
        Purchase official Exalted books through{" "}
        <a
          href="https://www.drivethrurpg.com/browse/pub/10479/Onyx-Path-Publishing"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline"
        >
          DriveThruRPG
        </a>
        .
      </p>
      <h2 className="text-xl font-semibold mt-4">Official Discord</h2>
      <p>
        Join the community on the{" "}
        <a
          href="https://discord.gg/theonyxpath"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline"
        >
          Onyx Path Official Discord
        </a>
        .
      </p>
      <Separator className="my-4" />
      <h2 className="text-xl font-semibold">About the Creator</h2>
      <p>
        I come from a Product Management background, not engineering. This app was coded entirely
        with the help of Claude Code and v0, so you may encounter varying levels of code quality and
        implementation.
      </p>
      <p className="mt-2">
        Your feedback, suggestions, and bug reports are very welcome!
        <br />
        Contact:{" "}
        <a href="mailto:exteralexander@gmail.com" className="text-primary underline">
          exteralexander@gmail.com
        </a>
      </p>
      <Separator className="my-4" />
      <p className="italic">Happy gaming, and may your dice always explode!</p>
    </>
  );
}

function LegalContent() {
  return (
    <>
      <h1 className="text-2xl font-bold">Legal Information &amp; Disclaimers</h1>
      <Separator className="my-4" />
      <h2 className="text-xl font-semibold">1. Intellectual Property</h2>
      <p>
        This unofficial fan tool is not affiliated with Onyx Path Publishing.
        <br />
        <strong>Exalted</strong> and <strong>Exalted: Essence</strong> are trademarks of Onyx Path
        Publishing.
        <br />
        Publicly available rules are implemented for personal use only.
      </p>
      <Separator className="my-4" />
      <h2 className="text-xl font-semibold">2. Usage Terms</h2>
      <p>
        The app is free for personal, non-commercial use. Sharing character files with your group is
        fine. Commercial use, redistribution, and claiming ownership of the game IP are prohibited.
      </p>
      <Separator className="my-4" />
      <h2 className="text-xl font-semibold">3. Data Privacy &amp; Security</h2>
      <p>
        All data lives in your browser&apos;s Local Storage and is never sent to a server.
        <br />
        Export regularly; you are responsible for your own backups.
      </p>
      <Separator className="my-4" />
      <h2 className="text-xl font-semibold">4. Software License</h2>
      <p>
        Open source components retain their respective licenses. This app&apos;s code is released
        under the MIT License for personal use with attribution.
      </p>
      <Separator className="my-4" />
      <h2 className="text-xl font-semibold">5. Disclaimers</h2>
      <p>
        Provided &quot;as is&quot; without warranty.
        <br />
        Developed with AI assistance.
      </p>
      <Separator className="my-4" />
      <h2 className="text-xl font-semibold">6. Updates &amp; Changes</h2>
      <p>Features and terms may change. Check the changelog and this page for updates.</p>
      <Separator className="my-4" />
      <h2 className="text-xl font-semibold">7. Contact &amp; Support</h2>
      <p>
        Community maintained; responses are best effort via the{" "}
        <a
          href="https://discord.gg/theonyxpath"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline"
        >
          Official Discord
        </a>
        .
      </p>
      <Separator className="my-4" />
      <p className="text-sm text-muted-foreground">
        <strong>Last Updated:</strong> July 2025
      </p>
      <p className="italic text-sm mt-2">
        By using this application, you acknowledge that you have read, understood, and agree to
        these terms and disclaimers.
      </p>
    </>
  );
}

export default function SiteFooter() {
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);

  return (
    <>
      <footer className="border-t bg-background mt-8">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <div className="grid gap-6 grid-cols-3">
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
                    href="https://discord.gg/theonyxpath"
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
          <div className="space-y-2 text-foreground">
            <AboutContent />
          </div>
          <DialogFooter>
            <Button onClick={() => setShowAboutModal(false)} className="w-auto">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showLegalModal} onOpenChange={setShowLegalModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <div className="space-y-2 text-foreground">
            <LegalContent />
          </div>
          <DialogFooter>
            <Button onClick={() => setShowLegalModal(false)} className="w-auto">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

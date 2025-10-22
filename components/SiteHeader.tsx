"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between relative">
        <h1 className="text-xl font-semibold">
          <Link href="/">Exalted: Essence Character Manager</Link>
        </h1>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Toggle navigation menu"
          onClick={() => setIsOpen(prev => !prev)}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <nav
          className={`${
            isOpen ? "block" : "hidden"
          } absolute top-full left-0 w-full bg-background md:static md:block md:w-auto`}
        >
          <ul className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <li>
              <Link
                href="https://www.drivethrurpg.com/en/product/427275/exalted-essence"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 hover:underline"
              >
                Buy Exalted Books.
              </Link>
            </li>
            <li>
              <Link
                href="https://discord.gg/bmRGuJ97pW="
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 hover:underline"
              >
                Official Discord.
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCharacterStore } from "@/hooks/useCharacterStore";
import { CharacterProvider } from "@/hooks/CharacterContext";
import CharacterToolbar from "@/components/CharacterToolbar";
import CharacterTabs from "@/components/CharacterTabs";
import { exportCharacter, importCharacters } from "@/lib/character-storage";
import type { Character } from "@/lib/character-types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CharacterPage() {
  const params = useParams();
  const router = useRouter();
  const characterId = params.id as string;

  const characters = useCharacterStore(state => state.characters);
  const updateCharacter = useCharacterStore(state => state.updateCharacter);
  const loadCharacters = useCharacterStore(state => state.loadCharacters);
  const isSaving = useCharacterStore(state => state.isSaving);
  const lastSaved = useCharacterStore(state => state.lastSaved);

  const [activeTab, setActiveTab] = useState("core");
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCharacter = async () => {
      await loadCharacters();
      const foundCharacter = characters.find(c => c.id === characterId);
      setCharacter(foundCharacter || null);
      setLoading(false);
    };
    loadCharacter();
  }, [characterId, characters, loadCharacters]);

  const handleUpdateCharacter = (updates: Partial<Character>) => {
    if (character) {
      updateCharacter(character.id, updates);
      setCharacter({ ...character, ...updates });
    }
  };

  const handleExport = async (char: Character) => {
    try {
      await exportCharacter(char);
    } catch (err) {
      console.error(err);
      toast.error("Failed to export character. Please try again.");
    }
  };

  const handleImport = async (file: File) => {
    try {
      const imported = await importCharacters(file);
      await loadCharacters();
      toast.success(`Successfully imported ${imported.length} character(s)`);
    } catch (err) {
      console.error(err);
      toast.error(
        "Failed to import character(s). Please ensure the file is a valid character export."
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-muted-foreground">Loading character...</div>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-lg text-muted-foreground">Character not found</div>
          <Button asChild>
            <Link href="/">Return to Character Selection</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Exalted: Essence Character Manager</h1>
          <div className="text-sm text-muted-foreground">
            <span>
              Managing: <strong>{character.name}</strong>
            </span>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <CharacterToolbar
            character={character}
            isSaving={isSaving}
            lastSaved={lastSaved}
            onExport={handleExport}
            onImport={handleImport}
            onSwitch={() => router.push("/")}
          />
          <CharacterProvider character={character} updateCharacter={handleUpdateCharacter}>
            <CharacterTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </CharacterProvider>
        </div>
      </main>
    </div>
  );
}

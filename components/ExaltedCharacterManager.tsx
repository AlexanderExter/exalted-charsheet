"use client";

import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import CharacterSelect from "@/components/CharacterSelect";
import SideCharacterSelect from "@/components/SideCharacterSelect";
import SideCharacterEditor from "@/components/SideCharacterEditor";
import CharacterToolbar from "@/components/CharacterToolbar";
import CharacterTabs from "@/components/CharacterTabs";
import { CharacterProvider } from "@/hooks/CharacterContext";
import { useCharacterStore } from "@/hooks/useCharacterStore";
import type { Character, SideCharacter } from "@/lib/character-types";
import { importCharacters, exportCharacter } from "@/lib/character-storage";
import { createDefaultSideCharacter } from "@/lib/side-character-defaults";
import {
  getAllSideCharacters,
  saveSideCharacter,
  deleteSideCharacter,
} from "@/lib/db";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

const ExaltedCharacterManager = () => {
  const searchParams = useSearchParams();
  const characterIdFromUrl = searchParams.get('character');

  // Zustand selectors - only subscribe to what we need
  const characters = useCharacterStore(state => state.characters);
  const currentCharacter = useCharacterStore(state => state.currentCharacter);
  const addCharacter = useCharacterStore(state => state.addCharacter);
  const updateCurrentCharacter = useCharacterStore(state => state.updateCurrentCharacter);
  const deleteCharacter = useCharacterStore(state => state.deleteCharacter);
  const setCurrentCharacter = useCharacterStore(state => state.setCurrentCharacter);
  const loadCharacters = useCharacterStore(state => state.loadCharacters);

  const [showCharacterSelect, setShowCharacterSelect] = useState(!currentCharacter);
  const [activeTab, setActiveTab] = useState("core");
  const [selectionView, setSelectionView] = useState<"characters" | "side-characters">("characters");

  // Handle character ID from URL parameter
  useEffect(() => {
    if (characterIdFromUrl && characters.length > 0) {
      const char = characters.find(c => c.id === characterIdFromUrl);
      if (char) {
        setCurrentCharacter(characterIdFromUrl);
        setShowCharacterSelect(false);
      }
    }
  }, [characterIdFromUrl, characters, setCurrentCharacter]);

  // Side character state
  const [sideCharacters, setSideCharacters] = useState<SideCharacter[]>([]);
  const [currentSideCharacter, setCurrentSideCharacter] = useState<SideCharacter | null>(null);
  const [showSideCharacterSelect, setShowSideCharacterSelect] = useState(true);

  const isSaving = useCharacterStore(state => state.isSaving);
  const lastSaved = useCharacterStore(state => state.lastSaved);

  const fileInputRef = useRef<HTMLInputElement>(null!);

  // Load side characters on mount
  useEffect(() => {
    const loadSideChars = async () => {
      const sideChars = await getAllSideCharacters();
      setSideCharacters(sideChars);
    };
    loadSideChars();
  }, []);

  const createCharacter = (name: string) => {
    if (!name.trim()) return;
    addCharacter(name.trim());
    setShowCharacterSelect(false);
  };

  const selectCharacter = (id: string) => {
    setCurrentCharacter(id);
    setShowCharacterSelect(false);
  };

  const updateCharacter = (updates: Partial<Character>) => {
    updateCurrentCharacter(updates);
  };

  const handleExport = async (character: Character) => {
    try {
      await exportCharacter(character);
    } catch (err) {
      console.error(err);
      toast.error("Failed to export character. Please try again.");
    }
  };

  const handleImport = async (file: File) => {
    try {
      const imported = await importCharacters(file);
      await loadCharacters();
      if (imported.length === 1) {
        selectCharacter(imported[0].id);
      }
      toast.success(`Successfully imported ${imported.length} character(s)`);
    } catch (err) {
      console.error(err);
      toast.error(
        "Failed to import character(s). Please ensure the file is a valid character export."
      );
    }
  };

  // Side character handlers
  const createSideCharacter = async (name: string) => {
    const newSideChar = createDefaultSideCharacter(name);
    await saveSideCharacter(newSideChar);
    setSideCharacters([...sideCharacters, newSideChar]);
    setCurrentSideCharacter(newSideChar);
    setShowSideCharacterSelect(false);
    toast.success(`Created side character: ${name}`);
  };

  const selectSideCharacter = (id: string) => {
    const sideChar = sideCharacters.find(sc => sc.id === id);
    if (sideChar) {
      setCurrentSideCharacter(sideChar);
      setShowSideCharacterSelect(false);
    }
  };

  const updateSideCharacter = async (updates: Partial<SideCharacter>) => {
    if (!currentSideCharacter) return;
    const updated = { ...currentSideCharacter, ...updates };
    await saveSideCharacter(updated);
    setSideCharacters(sideCharacters.map(sc => (sc.id === updated.id ? updated : sc)));
    setCurrentSideCharacter(updated);
  };

  const handleDeleteSideCharacter = async (id: string) => {
    await deleteSideCharacter(id);
    setSideCharacters(sideCharacters.filter(sc => sc.id !== id));
    if (currentSideCharacter?.id === id) {
      setCurrentSideCharacter(null);
      setShowSideCharacterSelect(true);
    }
    toast.success("Side character deleted");
  };

  // Show selection screens
  if (showCharacterSelect || !currentCharacter) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <Tabs value={selectionView} onValueChange={(v: any) => setSelectionView(v)}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="characters">Characters</TabsTrigger>
            <TabsTrigger value="side-characters">Side Characters</TabsTrigger>
          </TabsList>

          <TabsContent value="characters">
            <CharacterSelect
              characters={characters}
              onCreateCharacter={createCharacter}
              onSelectCharacter={selectCharacter}
              onDeleteCharacter={deleteCharacter}
              onExportCharacter={handleExport}
              importCharacter={async e => {
                const file = e.target.files?.[0];
                if (file) await handleImport(file);
                e.target.value = "";
              }}
              isSaving={isSaving}
              lastSaved={lastSaved}
              fileInputRef={fileInputRef}
            />
          </TabsContent>

          <TabsContent value="side-characters">
            <SideCharacterSelect
              sideCharacters={sideCharacters}
              onCreateSideCharacter={createSideCharacter}
              onSelectSideCharacter={selectSideCharacter}
              onDeleteSideCharacter={handleDeleteSideCharacter}
            />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Show side character editor
  if (selectionView === "side-characters" && currentSideCharacter && !showSideCharacterSelect) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <SideCharacterEditor
          sideCharacter={currentSideCharacter}
          onUpdate={updateSideCharacter}
          onBack={() => {
            setCurrentSideCharacter(null);
            setShowSideCharacterSelect(true);
          }}
        />
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
              Managing: <strong>{currentCharacter.name}</strong>
            </span>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <CharacterToolbar
            character={currentCharacter}
            isSaving={isSaving}
            lastSaved={lastSaved}
            onExport={handleExport}
            onImport={handleImport}
            onSwitch={() => setShowCharacterSelect(true)}
          />
          <CharacterProvider character={currentCharacter} updateCharacter={updateCharacter}>
            <CharacterTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </CharacterProvider>
        </div>
      </main>
    </div>
  );
};

export default ExaltedCharacterManager;

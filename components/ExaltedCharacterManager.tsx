"use client";

import { useRef, useState } from "react";
import CharacterSelect from "@/components/CharacterSelect";
import CharacterToolbar from "@/components/CharacterToolbar";
import CharacterTabs from "@/components/CharacterTabs";
import { CharacterProvider } from "@/hooks/CharacterContext";
import { useAutoSave } from "@/hooks/useAutoSave";
import { useCharacterManagement } from "@/hooks/useCharacterManagement";
import type { Character } from "@/lib/character-types";
import { importCharacters, exportCharacter } from "@/lib/character-storage";
import { toast } from "sonner";

const ExaltedCharacterManager = () => {
  const {
    characters,
    currentCharacter,
    showCharacterSelect,
    setShowCharacterSelect,
    createCharacter,
    selectCharacter,
    updateCharacter,
    deleteCharacter,
    loadCharacters,
  } = useCharacterManagement();

  const [activeTab, setActiveTab] = useState("core");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isSaving, lastSaved } = useAutoSave(characters);

  const handleExport = async (character: Character) => {
    try {
      await exportCharacter(character);
    } catch {
      toast.error("Failed to export character. Please try again.");
    }
  };

  const handleImport = async (file: File) => {
    try {
      const imported = await importCharacters(file);
      loadCharacters([...characters, ...imported]);
      if (imported.length === 1) {
        selectCharacter(imported[0].id);
      }
      toast.success(`Successfully imported ${imported.length} character(s)`);
    } catch {
      toast.error(
        "Failed to import character(s). Please ensure the file is a valid character export."
      );
    }
  };

  if (showCharacterSelect || !currentCharacter) {
    return (
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
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Exalted: Essence Character Manager</h1>
          <div className="text-sm text-gray-600">
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

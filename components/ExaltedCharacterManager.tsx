"use client";

import { useRef, useState } from "react";
import CharacterSelect from "@/components/CharacterSelect";
import CharacterToolbar from "@/components/CharacterToolbar";
import CharacterTabs from "@/components/CharacterTabs";
import { useAutoSave } from "@/hooks/useAutoSave";
import { useCharacterCalculations } from "@/hooks/useCharacterCalculations";
import { useCharacterManagement } from "@/hooks/useCharacterManagement";
import type {
  Character,
  AttributeType,
  AbilityType,
} from "@/lib/character-types";
import { calculateStatTotal } from "@/lib/exalted-utils";
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
  const [globalAbilityAttribute, setGlobalAbilityAttribute] =
    useState<AttributeType | "none">("none");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isSaving, lastSaved } = useAutoSave(characters, "exalted-characters");
  const calculations = useCharacterCalculations(currentCharacter);

  const calculateAbilityTotal = (abilityKey: AbilityType) => {
    const ability = currentCharacter?.abilities?.[abilityKey];
    if (!ability) return 0;
    const abilityTotal = calculateStatTotal(ability);
    if (!globalAbilityAttribute || globalAbilityAttribute === "none") return abilityTotal;
    const attribute = currentCharacter?.attributes?.[globalAbilityAttribute];
    if (!attribute) return abilityTotal;
    return abilityTotal + calculateStatTotal(attribute);
  };

  const calculateDicePool = () => {
    if (
      !currentCharacter?.dicePool ||
      !currentCharacter?.attributes ||
      !currentCharacter?.abilities
    ) {
      return {
        basePool: 0,
        extraDice: 0,
        totalPool: 0,
        cappedBonusDice: 0,
        actionPhrase: "Roll 0, TN 7 Double 10s",
      };
    }
    const {
      attribute,
      ability,
      targetNumber,
      doublesThreshold,
      extraSuccessBonus,
      extraSuccessNonBonus,
    } = currentCharacter.dicePool;
    const attributeTotal = calculateStatTotal(
      currentCharacter.attributes[attribute] || { base: 0, added: 0, bonus: 0 },
    );
    const abilityTotal = calculateStatTotal(
      currentCharacter.abilities[ability] || { base: 0, added: 0, bonus: 0 },
    );
    const basePool = attributeTotal + abilityTotal;
    const { extraDiceBonus, extraDiceNonBonus, isStunted } = currentCharacter.dicePool;
    const cappedBonusDice = Math.min(extraDiceBonus || 0, 10);
    const stuntDice = isStunted ? 2 : 0;
    const totalExtraDice = cappedBonusDice + (extraDiceNonBonus || 0) + stuntDice;
    const totalPool = basePool + totalExtraDice;
    const totalExtraSuccess = (extraSuccessBonus || 0) + (extraSuccessNonBonus || 0);
    let actionPhrase = `Roll ${totalPool}`;
    if (totalExtraSuccess > 0) {
      const successText = totalExtraSuccess === 1 ? "success" : "successes";
      actionPhrase += `, ${totalExtraSuccess} ${successText}`;
    }
    actionPhrase += `, TN ${targetNumber}`;
    if (doublesThreshold < 10) {
      actionPhrase += ` Double ${doublesThreshold}s`;
    } else {
      actionPhrase += ` Double 10s`;
    }
    return {
      basePool,
      extraDice: totalExtraDice,
      totalPool,
      cappedBonusDice,
      actionPhrase,
    };
  };

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
        "Failed to import character(s). Please ensure the file is a valid character export.",
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
          <CharacterTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            character={currentCharacter}
            updateCharacter={updateCharacter}
            calculations={calculations}
            calculateAbilityTotal={calculateAbilityTotal}
            calculateDicePool={calculateDicePool}
            globalAbilityAttribute={globalAbilityAttribute}
            setGlobalAbilityAttribute={setGlobalAbilityAttribute}
            resolve={calculations.resolve}
          />
        </div>
      </main>
    </div>
  );
};

export default ExaltedCharacterManager;

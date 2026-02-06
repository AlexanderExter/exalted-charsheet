import React, { createContext, useContext, useState, useMemo } from "react";
import type { Character, AttributeType, AbilityType } from "@/lib/character-types";
import { calculateStatTotal } from "@/lib/exalted-utils";
import {
  useCharacterCalculations,
  type CharacterCalculations,
} from "@/hooks/useCharacterCalculations";

interface CharacterContextValue {
  character: Character;
  updateCharacter: (updates: Partial<Character>) => void;
  calculations: CharacterCalculations;
  calculateAbilityTotal: (abilityKey: AbilityType) => number;
  globalAbilityAttribute: AttributeType | "none";
  setGlobalAbilityAttribute: (attr: AttributeType | "none") => void;
}

const CharacterContext = createContext<CharacterContextValue | undefined>(undefined);

interface CharacterProviderProps {
  character: Character;
  updateCharacter: (updates: Partial<Character>) => void;
  children: React.ReactNode;
}

export function CharacterProvider({
  character,
  updateCharacter,
  children,
}: CharacterProviderProps) {
  const [globalAbilityAttribute, setGlobalAbilityAttribute] = useState<AttributeType | "none">(
    "none"
  );

  const calculations = useCharacterCalculations(character);

  const value = useMemo(
    () => ({
      character,
      updateCharacter,
      calculations,
      calculateAbilityTotal: (abilityKey: AbilityType) => {
        const ability = character.abilities[abilityKey];
        const abilityTotal = calculateStatTotal(ability);
        if (globalAbilityAttribute === "none") {
          return abilityTotal;
        }
        const attribute = character.attributes[globalAbilityAttribute];
        return abilityTotal + calculateStatTotal(attribute);
      },
      globalAbilityAttribute,
      setGlobalAbilityAttribute,
    }),
    [character, updateCharacter, calculations, globalAbilityAttribute]
  );

  return <CharacterContext.Provider value={value}>{children}</CharacterContext.Provider>;
}

export function useCharacterContext() {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error("useCharacterContext must be used within a CharacterProvider");
  }
  return context;
}

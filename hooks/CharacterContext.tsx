import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import type { Character, AttributeType, AbilityType } from "@/lib/character-types";
import { calculateStatTotal } from "@/lib/exalted-utils";
import { calculateDicePool as calculateDicePoolUtil } from "@/lib/exalted-utils/dice";
import { useCharacterCalculations, type CharacterCalculations } from "@/hooks/useCharacterCalculations";

type DicePoolResult = ReturnType<typeof calculateDicePoolUtil>;

interface CharacterContextValue {
  character: Character;
  updateCharacter: (updates: Partial<Character>) => void;
  calculations: CharacterCalculations;
  calculateAbilityTotal: (abilityKey: AbilityType) => number;
  calculateDicePool: () => DicePoolResult;
  globalAbilityAttribute: AttributeType | "none";
  setGlobalAbilityAttribute: (attr: AttributeType | "none") => void;
}

const CharacterContext = createContext<CharacterContextValue | undefined>(undefined);

interface CharacterProviderProps {
  character: Character;
  updateCharacter: (updates: Partial<Character>) => void;
  children: React.ReactNode;
}

export function CharacterProvider({ character, updateCharacter, children }: CharacterProviderProps) {
  const [globalAbilityAttribute, setGlobalAbilityAttribute] = useState<AttributeType | "none">("none");

  const calculations = useCharacterCalculations(character);

  const calculateAbilityTotal = useCallback(
    (abilityKey: AbilityType) => {
      const ability = character.abilities[abilityKey];
      const abilityTotal = calculateStatTotal(ability);
      if (globalAbilityAttribute === "none") return abilityTotal;
      const attribute = character.attributes[globalAbilityAttribute];
      return abilityTotal + calculateStatTotal(attribute);
    },
    [character, globalAbilityAttribute],
  );

  const calculateDicePool = useCallback((): DicePoolResult => {
    const {
      attribute,
      ability,
      targetNumber,
      doublesThreshold,
      extraDiceBonus = 0,
      extraDiceNonBonus = 0,
      extraSuccessBonus = 0,
      extraSuccessNonBonus = 0,
      isStunted,
    } = character.dicePool;

    const attributeTotal = calculateStatTotal(character.attributes[attribute]);
    const abilityTotal = calculateStatTotal(character.abilities[ability]);

    return calculateDicePoolUtil(
      attributeTotal,
      abilityTotal,
      targetNumber,
      doublesThreshold,
      extraDiceBonus,
      extraDiceNonBonus,
      extraSuccessBonus,
      extraSuccessNonBonus,
      isStunted,
    );
  }, [character]);

  const value = useMemo(
    () => ({
      character,
      updateCharacter,
      calculations,
      calculateAbilityTotal,
      calculateDicePool,
      globalAbilityAttribute,
      setGlobalAbilityAttribute,
    }),
    [
      character,
      updateCharacter,
      calculations,
      calculateAbilityTotal,
      calculateDicePool,
      globalAbilityAttribute,
    ],
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


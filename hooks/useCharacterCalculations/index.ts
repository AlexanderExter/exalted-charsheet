// Re-export all calculation hooks for convenience
export { useCombatCalculations, type CombatCalculations } from "./useCombatCalculations";
export { useHealthCalculations, type HealthCalculations } from "./useHealthCalculations";
export { useSocialCalculations, type SocialCalculations } from "./useSocialCalculations";
export { useDicePoolCalculation } from "./useDicePoolCalculation";

import { useMemo, useCallback, useRef, useEffect } from "react";
import type { Character, AttributeType, AbilityType } from "@/lib/character-types";
import { calculateStatTotal, getHighestAttributeValue } from "@/lib/exalted-utils";
import { useCombatCalculations, type CombatCalculations } from "./useCombatCalculations";
import { useHealthCalculations, type HealthCalculations } from "./useHealthCalculations";
import { useSocialCalculations, type SocialCalculations } from "./useSocialCalculations";
import { useDicePoolCalculation } from "./useDicePoolCalculation";
import type { DicePoolResult } from "@/lib/exalted-utils/dice";

export interface CharacterCalculations
  extends CombatCalculations,
    HealthCalculations,
    SocialCalculations {
  // Attribute/ability helpers
  highestAttribute: number;
  getAttributeTotal: (attributeKey: AttributeType) => number;
  getAbilityTotal: (abilityKey: AbilityType) => number;

  // Dice pool calculation
  dicePoolResult: DicePoolResult;
}

/**
 * Combined character calculations hook
 * Delegates to domain-specific hooks for better performance
 */
export const useCharacterCalculations = (character: Character | null): CharacterCalculations => {
  const combatCalcs = useCombatCalculations(character);
  const healthCalcs = useHealthCalculations(character);
  const socialCalcs = useSocialCalculations(character);
  const dicePoolResult = useDicePoolCalculation(character);

  // Use ref to track latest character without causing helper functions to recreate
  const characterRef = useRef(character);
  useEffect(() => {
    characterRef.current = character;
  });

  // Helper functions - use useCallback with stable refs
  // Access character via ref to avoid recreating on every character update
  const getAttributeTotal = useCallback((attributeKey: AttributeType): number => {
    if (!characterRef.current) return 0;
    const attribute = characterRef.current.attributes[attributeKey];
    return attribute ? calculateStatTotal(attribute) : 0;
  }, []);

  const getAbilityTotal = useCallback((abilityKey: AbilityType): number => {
    if (!characterRef.current) return 0;
    const ability = characterRef.current.abilities[abilityKey];
    return ability ? calculateStatTotal(ability) : 0;
  }, []);

  const highestAttribute = useMemo(() => {
    if (!character) return 1;
    return getHighestAttributeValue(character.attributes);
  }, [character?.attributes]);

  // Memoize the entire calculations object to prevent unnecessary re-renders
  return useMemo(
    () => ({
      ...combatCalcs,
      ...healthCalcs,
      ...socialCalcs,
      highestAttribute,
      getAttributeTotal,
      getAbilityTotal,
      dicePoolResult,
    }),
    [
      combatCalcs,
      healthCalcs,
      socialCalcs,
      highestAttribute,
      getAttributeTotal,
      getAbilityTotal,
      dicePoolResult,
    ]
  );
};

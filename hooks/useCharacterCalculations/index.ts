// Re-export all calculation hooks for convenience
export { useCombatCalculations, type CombatCalculations } from "./useCombatCalculations";
export { useHealthCalculations, type HealthCalculations } from "./useHealthCalculations";
export { useSocialCalculations, type SocialCalculations } from "./useSocialCalculations";
export { useDicePoolCalculation } from "./useDicePoolCalculation";

import { useMemo } from "react";
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

  // Helper functions
  const getAttributeTotal = useMemo(
    () =>
      (attributeKey: AttributeType): number => {
        if (!character) return 0;
        const attribute = character.attributes[attributeKey];
        return attribute ? calculateStatTotal(attribute) : 0;
      },
    [character?.attributes]
  );

  const getAbilityTotal = useMemo(
    () =>
      (abilityKey: AbilityType): number => {
        if (!character) return 0;
        const ability = character.abilities[abilityKey];
        return ability ? calculateStatTotal(ability) : 0;
      },
    [character?.abilities]
  );

  const highestAttribute = useMemo(() => {
    if (!character) return 1;
    return getHighestAttributeValue(character.attributes);
  }, [character?.attributes]);

  return {
    ...combatCalcs,
    ...healthCalcs,
    ...socialCalcs,
    highestAttribute,
    getAttributeTotal,
    getAbilityTotal,
    dicePoolResult,
  };
};

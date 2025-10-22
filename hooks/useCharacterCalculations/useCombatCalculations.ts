import { useMemo } from "react";
import type { Character } from "@/lib/character-types";
import {
  calculateEvasion,
  calculateParry,
  calculateDefense,
  calculateSoak,
  calculateHardness,
} from "@/lib/exalted-utils/static-values";

export interface CombatCalculations {
  defense: number;
  evasion: number;
  parry: number;
  soak: number;
  hardness: number;
}

export const useCombatCalculations = (character: Character | null): CombatCalculations => {
  return useMemo(() => {
    if (!character) {
      return {
        defense: 0,
        evasion: 0,
        parry: 0,
        soak: 1,
        hardness: 3,
      };
    }

    const evasion = calculateEvasion(
      character.abilities.athletics,
      character.attributes,
      character.staticValues.evasionModifier
    );

    const parry = calculateParry(
      character.abilities.closeCombat,
      character.attributes,
      character.staticValues.parryModifier
    );

    const defense = calculateDefense(evasion, parry, character.staticValues.defenseModifier);

    const soak = calculateSoak(
      character.abilities.physique,
      character.armor,
      character.staticValues.soakModifier
    );

    const hardness = calculateHardness(
      character.essence.rating,
      character.armor,
      character.staticValues.hardnessModifier
    );

    return {
      defense,
      evasion,
      parry,
      soak,
      hardness,
    };
  }, [
    character?.abilities.athletics,
    character?.abilities.closeCombat,
    character?.abilities.physique,
    character?.attributes,
    character?.armor,
    character?.essence.rating,
    character?.staticValues.evasionModifier,
    character?.staticValues.parryModifier,
    character?.staticValues.defenseModifier,
    character?.staticValues.soakModifier,
    character?.staticValues.hardnessModifier,
  ]);
};

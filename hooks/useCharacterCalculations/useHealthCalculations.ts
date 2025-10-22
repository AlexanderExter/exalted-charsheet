import { useMemo } from "react";
import type { Character } from "@/lib/character-types";
import { calculateHealthLevels, calculateHealthPenalty } from "@/lib/exalted-utils/health";

export interface HealthCalculations {
  healthLevels: {
    zero: number;
    minusOne: number;
    minusTwo: number;
    incap: number;
  };
  healthPenalty: number;
}

export const useHealthCalculations = (character: Character | null): HealthCalculations => {
  return useMemo(() => {
    if (!character) {
      return {
        healthLevels: { zero: 2, minusOne: 2, minusTwo: 2, incap: 1 },
        healthPenalty: 0,
      };
    }

    const healthLevels = calculateHealthLevels(
      character.health.baseline,
      character.health.oxBodyLevels,
      character.health.exaltType
    );

    const healthPenalty = calculateHealthPenalty(
      healthLevels,
      character.health.bashingDamage,
      character.health.lethalDamage,
      character.health.aggravatedDamage
    );

    return {
      healthLevels,
      healthPenalty,
    };
  }, [
    character?.health.baseline,
    character?.health.oxBodyLevels,
    character?.health.exaltType,
    character?.health.bashingDamage,
    character?.health.lethalDamage,
    character?.health.aggravatedDamage,
  ]);
};

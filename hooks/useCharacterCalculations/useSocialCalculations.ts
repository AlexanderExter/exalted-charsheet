import { useMemo } from "react";
import type { Character } from "@/lib/character-types";
import { calculateResolve } from "@/lib/exalted-utils/static-values";

export interface SocialCalculations {
  resolve: number;
}

export const useSocialCalculations = (character: Character | null): SocialCalculations => {
  return useMemo(() => {
    if (!character) {
      return {
        resolve: 2,
      };
    }

    const resolve = calculateResolve(
      character.abilities.integrity,
      character.staticValues.resolveModifier
    );

    return {
      resolve,
    };
  }, [character?.abilities.integrity, character?.staticValues.resolveModifier]);
};

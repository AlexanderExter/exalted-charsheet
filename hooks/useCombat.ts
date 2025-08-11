import { useCallback } from "react";
import { produce, type Draft } from "immer";
import type { Character, DramaticInjury } from "@/lib/character-types";
import type { CharacterCalculations } from "@/hooks/useCharacterCalculations";

interface UseCombatProps {
  character: Character | null;
  updateCharacter: (updates: Partial<Character>) => void;
  calculations: CharacterCalculations;
}

export function useCombat({ character, updateCharacter, calculations }: UseCombatProps) {
  const getHighestAttribute = useCallback(() => {
    if (!character?.attributes) return 0;
    return calculations.highestAttribute;
  }, [character?.attributes, calculations.highestAttribute]);

  const getTotalHealthLevels = useCallback(() => {
    return (
      calculations.healthLevels.zero +
      calculations.healthLevels.minusOne +
      calculations.healthLevels.minusTwo +
      calculations.healthLevels.incap
    );
  }, [calculations.healthLevels]);

  const addDramaticInjury = useCallback(() => {
    if (!character) return;

    const newInjury: DramaticInjury = {
      id: crypto.randomUUID(),
      description: "",
      isHealed: false,
    };

    const updatedHealth = produce(character.health, draft => {
      draft.dramaticInjuries.push(newInjury);
    });

    updateCharacter({
      health: updatedHealth,
    });
  }, [character, updateCharacter]);

  const updateDramaticInjury = useCallback(
    <K extends keyof DramaticInjury>(id: string, field: K, value: Draft<DramaticInjury>[K]) => {
      if (!character) return;

      const updatedHealth = produce(character.health, draft => {
        const injury = draft.dramaticInjuries.find(inj => inj.id === id) as
          | Draft<DramaticInjury>
          | undefined;
        if (injury) {
          injury[field] = value;
        }
      });

      updateCharacter({
        health: updatedHealth,
      });
    },
    [character, updateCharacter]
  );

  const deleteDramaticInjury = useCallback(
    (id: string) => {
      if (!character) return;

      const updatedHealth = produce(character.health, draft => {
        const index = draft.dramaticInjuries.findIndex(injury => injury.id === id);
        if (index !== -1) {
          draft.dramaticInjuries.splice(index, 1);
        }
      });

      updateCharacter({
        health: updatedHealth,
      });
    },
    [character, updateCharacter]
  );

  return {
    getHighestAttribute,
    getTotalHealthLevels,
    addDramaticInjury,
    updateDramaticInjury,
    deleteDramaticInjury,
  };
}

export type UseCombatReturn = ReturnType<typeof useCombat>;

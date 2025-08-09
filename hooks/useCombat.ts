import { useCallback } from "react";
import type { Character, DramaticInjury } from "@/lib/character-types";
import type { CharacterCalculations } from "@/hooks/useCharacterCalculations";
import { v4 as uuidv4 } from "uuid";

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
      id: uuidv4(),
      description: "",
      isHealed: false,
    };

    updateCharacter({
      health: {
        ...character.health,
        dramaticInjuries: [...(character.health?.dramaticInjuries || []), newInjury],
      },
    });
  }, [character, updateCharacter]);

  const updateDramaticInjury = useCallback(
    (id: string, field: keyof DramaticInjury, value: DramaticInjury[keyof DramaticInjury]) => {
      if (!character) return;

      updateCharacter({
        health: {
          ...character.health,
          dramaticInjuries: (character.health?.dramaticInjuries || []).map(injury =>
            injury.id === id ? { ...injury, [field]: value } : injury
          ),
        },
      });
    },
    [character, updateCharacter]
  );

  const deleteDramaticInjury = useCallback(
    (id: string) => {
      if (!character) return;

      updateCharacter({
        health: {
          ...character.health,
          dramaticInjuries: (character.health?.dramaticInjuries || []).filter(
            injury => injury.id !== id
          ),
        },
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

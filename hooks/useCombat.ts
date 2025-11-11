import type { Character, DramaticInjury } from "@/lib/character-types";
import type { CharacterCalculations } from "@/hooks/useCharacterCalculations";

interface UseCombatProps {
  character: Character | null;
  updateCharacter: (updates: Partial<Character>) => void;
  calculations: CharacterCalculations;
}

export function useCombat({ character, updateCharacter }: Omit<UseCombatProps, "calculations">) {
  const addDramaticInjury = () => {
    if (!character) return;

    const newInjury: DramaticInjury = {
      id: crypto.randomUUID(),
      description: "",
      isHealed: false,
    };

    updateCharacter({
      health: {
        ...character.health,
        dramaticInjuries: [...character.health.dramaticInjuries, newInjury],
      },
    });
  };

  const updateDramaticInjury = <K extends keyof DramaticInjury>(
    id: string,
    field: K,
    value: DramaticInjury[K]
  ) => {
    if (!character) return;

    updateCharacter({
      health: {
        ...character.health,
        dramaticInjuries: character.health.dramaticInjuries.map(inj =>
          inj.id === id ? { ...inj, [field]: value } : inj
        ),
      },
    });
  };

  const deleteDramaticInjury = (id: string) => {
    if (!character) return;

    updateCharacter({
      health: {
        ...character.health,
        dramaticInjuries: character.health.dramaticInjuries.filter(injury => injury.id !== id),
      },
    });
  };

  return {
    addDramaticInjury,
    updateDramaticInjury,
    deleteDramaticInjury,
  };
}

export type UseCombatReturn = ReturnType<typeof useCombat>;

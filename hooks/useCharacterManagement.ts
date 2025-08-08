import { useState, useCallback } from "react";
import { useCharacterStore } from "@/hooks/useCharacterStore";
import type { Character } from "@/lib/character-types";

export function useCharacterManagement() {
  const {
    characters,
    currentCharacter,
    addCharacter,
    updateCurrentCharacter,
    deleteCharacter,
    setCurrentCharacter,
    loadCharacters,
  } = useCharacterStore();

  const [showCharacterSelect, setShowCharacterSelect] = useState(true);

  const createCharacter = useCallback(
    (name: string) => {
      if (!name.trim()) return;
      addCharacter(name.trim());
      setShowCharacterSelect(false);
    },
    [addCharacter],
  );

  const selectCharacter = useCallback(
    (id: string) => {
      setCurrentCharacter(id);
      setShowCharacterSelect(false);
    },
    [setCurrentCharacter],
  );

  const updateCharacter = useCallback(
    (updates: Partial<Character>) => {
      updateCurrentCharacter(updates);
    },
    [updateCurrentCharacter],
  );

  return {
    characters,
    currentCharacter,
    showCharacterSelect,
    setShowCharacterSelect,
    createCharacter,
    selectCharacter,
    updateCharacter,
    deleteCharacter,
    loadCharacters,
  };
}

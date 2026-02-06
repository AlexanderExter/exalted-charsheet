"use client";

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { shallow } from "zustand/shallow";
import isEqual from "fast-deep-equal";
import { createNewCharacter } from "@/lib/character-defaults";
import { CharacterSchema, type Character } from "@/lib/character-types";
import {
  getAllCharacters,
  saveCharacter as saveCharacterToDB,
  deleteCharacter as deleteCharacterFromDB,
  getCurrentCharacterId,
  setCurrentCharacterId as setCurrentCharacterIdInDB,
} from "@/lib/db";

interface CharacterState {
  characters: Character[];
  currentCharacterId: string | null;
  currentCharacter: Character | null;
  isSaving: boolean;
  lastSaved: Date | null;
  addCharacter: (name: string) => void;
  updateCharacter: (id: string, updates: Partial<Character>) => void;
  updateCurrentCharacter: (updates: Partial<Character>) => void;
  deleteCharacter: (id: string) => void;
  setCurrentCharacter: (id: string) => void;
  loadCharacters: () => Promise<void>;
}

export const useCharacterStore = create<CharacterState>()(
  subscribeWithSelector((set, get) => ({
    characters: [],
    currentCharacterId: null,
    currentCharacter: null,
    isSaving: false,
    lastSaved: null,
    addCharacter: name => {
      const char = createNewCharacter(name);
      set(state => ({
        characters: [...state.characters, char],
        currentCharacterId: char.id,
        currentCharacter: char,
      }));
    },
    updateCharacter: (id, updates) => {
      set(state => {
        const updatedCharacters = state.characters.map(c =>
          c.id === id ? { ...c, ...updates } : c
        );
        const updatedChar = updatedCharacters.find(c => c.id === id) ?? null;
        return {
          characters: updatedCharacters,
          currentCharacter: state.currentCharacterId === id ? updatedChar : state.currentCharacter,
        };
      });
    },
    updateCurrentCharacter: updates => {
      const id = get().currentCharacterId;
      if (!id) return;
      get().updateCharacter(id, updates);
    },
    deleteCharacter: id => {
      set(state => {
        const filteredCharacters = state.characters.filter(c => c.id !== id);
        const newCurrentId =
          id === state.currentCharacterId ? filteredCharacters[0]?.id ?? null : state.currentCharacterId;
        const newCurrentChar = filteredCharacters.find(c => c.id === newCurrentId) ?? null;
        return {
          characters: filteredCharacters,
          currentCharacterId: newCurrentId,
          currentCharacter: newCurrentChar,
        };
      });
    },
    setCurrentCharacter: id => {
      set(state => ({
        currentCharacterId: id,
        currentCharacter: state.characters.find(c => c.id === id) ?? null,
      }));
    },
    loadCharacters: async () => {
      try {
        const [charsFromDB, currentId] = await Promise.all([
          getAllCharacters(),
          getCurrentCharacterId(),
        ]);
        const result = CharacterSchema.array().safeParse(charsFromDB);
        if (!result.success) {
          console.error("Stored character data failed validation:", result.error);
          console.error(
            "IndexedDB data may be from an incompatible schema version. " +
            "Clear browser data or export/reimport characters to resolve."
          );
          return;
        }
        const parsed = result.data as Character[];
        const currentChar = parsed.find(c => c.id === currentId) ?? parsed[0] ?? null;
        set({
          characters: parsed,
          currentCharacterId: currentChar?.id ?? null,
          currentCharacter: currentChar,
        });
      } catch (error) {
        console.error("Failed to load characters from IndexedDB:", error);
      }
    },
  }))
);

void useCharacterStore.getState().loadCharacters();

let lastSavePromise: Promise<void> = Promise.resolve();

useCharacterStore.subscribe(
  state => ({
    characters: state.characters,
    currentCharacterId: state.currentCharacterId,
  }),
  ({ characters, currentCharacterId }, prev) => {
    // Set saving state immediately
    useCharacterStore.setState({ isSaving: true });

    lastSavePromise = lastSavePromise
      .then(async () => {
        const prevChars = prev?.characters ?? [];
        const prevId = prev?.currentCharacterId;

        const prevMap = new Map(prevChars.map(c => [c.id, c]));
        const currMap = new Map(characters.map(c => [c.id, c]));

        const operations: Promise<void>[] = [];

        for (const char of characters) {
          const prevChar = prevMap.get(char.id);
          if (!prevChar || !isEqual(prevChar, char)) {
            operations.push(saveCharacterToDB(char));
          }
        }

        for (const prevChar of prevChars) {
          if (!currMap.has(prevChar.id)) {
            operations.push(deleteCharacterFromDB(prevChar.id));
          }
        }

        if (currentCharacterId !== prevId) {
          operations.push(setCurrentCharacterIdInDB(currentCharacterId));
        }

        await Promise.all(operations);

        // Update save state after completion
        useCharacterStore.setState({ isSaving: false, lastSaved: new Date() });
      })
      .catch(error => {
        // Always reset saving state on error
        console.error("Error saving character data:", error);
        useCharacterStore.setState({ isSaving: false });
      });
  },
  { equalityFn: shallow }
);

export const waitForCharacterStoreSave = () => lastSavePromise;

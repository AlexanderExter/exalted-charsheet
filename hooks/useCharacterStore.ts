"use client";

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
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
  addCharacter: (name: string) => void;
  updateCurrentCharacter: (updates: Partial<Character>) => void;
  deleteCharacter: (id: string) => void;
  setCurrentCharacter: (id: string) => void;
  loadCharacters: () => Promise<void>;
}

export const useCharacterStore = create<CharacterState>()(
  subscribeWithSelector(
    immer((set, get) => ({
      characters: [],
      currentCharacterId: null,
      currentCharacter: null,
      addCharacter: name => {
        const char = createNewCharacter(name);
        set(state => {
          state.characters.push(char);
          state.currentCharacterId = char.id;
          state.currentCharacter = char;
        });
      },
      updateCurrentCharacter: updates => {
        const id = get().currentCharacterId;
        if (!id) return;
        set(state => {
          const char = state.characters.find(c => c.id === id);
          if (!char) return;
          Object.assign(char, updates);
          state.currentCharacter = char;
        });
      },
      deleteCharacter: id => {
        let newCurrentId: string | null = null;
        set(state => {
          state.characters = state.characters.filter(c => c.id !== id);
          if (id === state.currentCharacterId) {
            newCurrentId = state.characters[0]?.id ?? null;
            state.currentCharacterId = newCurrentId;
            state.currentCharacter = state.characters[0] ?? null;
          } else {
            newCurrentId = state.currentCharacterId;
            state.currentCharacter =
              state.characters.find(c => c.id === state.currentCharacterId) ?? null;
          }
        });
      },
      setCurrentCharacter: id => {
        set(state => {
          state.currentCharacterId = id;
          state.currentCharacter = state.characters.find(c => c.id === id) ?? null;
        });
      },
      loadCharacters: async () => {
        const [charsFromDB, currentId] = await Promise.all([
          getAllCharacters(),
          getCurrentCharacterId(),
        ]);
        const parsed = CharacterSchema.array().parse(charsFromDB) as Character[];
        const currentChar = parsed.find(c => c.id === currentId) ?? parsed[0] ?? null;
        set(state => {
          state.characters = parsed;
          state.currentCharacterId = currentChar?.id ?? null;
          state.currentCharacter = currentChar;
        });
      },
    }))
  )
);

void useCharacterStore.getState().loadCharacters();

let lastSavePromise: Promise<void> = Promise.resolve();

useCharacterStore.subscribe(
  state => ({
    characters: state.characters,
    currentCharacterId: state.currentCharacterId,
  }),
  ({ characters, currentCharacterId }, prev) => {
    lastSavePromise = lastSavePromise.then(async () => {
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
    });
  }
);

export const waitForCharacterStoreSave = () => lastSavePromise;

export const subscribeToCharacterStore = <T>(
  selector: (state: CharacterState) => T,
  listener: (state: T, prev: T) => void
) => useCharacterStore.subscribe(selector, listener);

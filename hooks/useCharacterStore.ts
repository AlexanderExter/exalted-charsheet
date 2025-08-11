import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
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
        void saveCharacterToDB(char);
        void setCurrentCharacterIdInDB(char.id);
      },
      updateCurrentCharacter: updates => {
        const id = get().currentCharacterId;
        if (!id) return;
        let updated: Character | undefined;
        set(state => {
          const char = state.characters.find(c => c.id === id);
          if (!char) return;
          Object.assign(char, updates);
          state.currentCharacter = char;
          updated = char;
        });
        if (updated) void saveCharacterToDB(updated);
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
        void deleteCharacterFromDB(id);
        void setCurrentCharacterIdInDB(newCurrentId);
      },
      setCurrentCharacter: id => {
        set(state => {
          state.currentCharacterId = id;
          state.currentCharacter = state.characters.find(c => c.id === id) ?? null;
        });
        void setCurrentCharacterIdInDB(id);
      },
      loadCharacters: async () => {
        const [charsFromDB, currentId] = await Promise.all([
          getAllCharacters(),
          getCurrentCharacterId(),
        ]);
        const parsed = CharacterSchema.array().parse(charsFromDB) as Character[];
        const currentChar =
          parsed.find(c => c.id === currentId) ?? parsed[0] ?? null;
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

export const subscribeToCharacterStore = <T>(
  selector: (state: CharacterState) => T,
  listener: (state: T, prev: T) => void
) => useCharacterStore.subscribe(selector, listener);

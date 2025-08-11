import { create } from "zustand";
import {
  persist,
  subscribeWithSelector,
  createJSONStorage,
  type StateStorage,
} from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createNewCharacter } from "@/lib/character-defaults";
import { CharacterSchema, type Character } from "@/lib/character-types";
import { db } from "@/lib/db";

interface CharacterState {
  characters: Character[];
  currentCharacterId: string | null;
  currentCharacter: Character | null;
  addCharacter: (name: string) => void;
  updateCurrentCharacter: (updates: Partial<Character>) => void;
  deleteCharacter: (id: string) => void;
  setCurrentCharacter: (id: string) => void;
  loadCharacters: (characters: Character[]) => void;
}

const dexieStorage: StateStorage = {
  async getItem() {
    const characters = await db.characters.toArray();
    const meta = await db.metadata.get("currentCharacterId");
    if (characters.length === 0) return null;
    const currentCharacterId = meta?.value ?? null;
    const currentCharacter =
      characters.find(c => c.id === currentCharacterId) ?? null;
    return JSON.stringify({
      state: { characters, currentCharacterId, currentCharacter },
      version: 0,
    });
  },
  async setItem(_name, value) {
    const { state } = JSON.parse(value) as { state: CharacterState };
    const chars = CharacterSchema.array().parse(state.characters) as Character[];
    await db.transaction("rw", db.characters, db.metadata, async () => {
      await db.characters.clear();
      await db.characters.bulkPut(chars);
      await db.metadata.put({
        key: "currentCharacterId",
        value: state.currentCharacterId,
      });
    });
  },
  async removeItem() {
    await db.characters.clear();
    await db.metadata.clear();
  },
};

export const useCharacterStore = create<CharacterState>()(
  subscribeWithSelector(
    persist(
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
          set(state => {
            state.characters = state.characters.filter(c => c.id !== id);
            if (id === state.currentCharacterId) {
              state.currentCharacterId = state.characters[0]?.id ?? null;
              state.currentCharacter = state.characters[0] ?? null;
            } else {
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
        loadCharacters: characters => {
          const parsed = CharacterSchema.array().parse(characters) as Character[];
          set(state => {
            state.characters = parsed;
            state.currentCharacterId = parsed[0]?.id ?? null;
            state.currentCharacter = parsed[0] ?? null;
          });
        },
      })),
      {
        name: "exalted-characters",
        storage: createJSONStorage(() => dexieStorage),
        merge: (persistedState, currentState) => {
          try {
            const persisted = persistedState as Partial<CharacterState>;
            const parsed = CharacterSchema.array().parse(persisted.characters) as Character[];
            const currentCharacter =
              parsed.find(c => c.id === persisted.currentCharacterId) ?? parsed[0] ?? null;
            return {
              ...currentState,
              characters: parsed,
              currentCharacterId: currentCharacter?.id ?? null,
              currentCharacter,
            };
          } catch {
            return currentState;
          }
        },
      }
    )
  )
);

export const subscribeToCharacterStore = <T>(
  selector: (state: CharacterState) => T,
  listener: (state: T, prev: T) => void
) => useCharacterStore.subscribe(selector, listener);

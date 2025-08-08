import { create } from "zustand"
import { persist } from "zustand/middleware"
import { createNewCharacter } from "@/lib/character-defaults"
import type { Character } from "@/lib/character-types"

interface CharacterState {
  characters: Character[]
  currentCharacterId: string | null
  currentCharacter: Character | null
  addCharacter: (name: string) => void
  updateCurrentCharacter: (updates: Partial<Character>) => void
  deleteCharacter: (id: string) => void
  setCurrentCharacter: (id: string) => void
  loadCharacters: (characters: Character[]) => void
}

export const useCharacterStore = create<CharacterState>()(
  persist(
    (set, get) => ({
      characters: [],
      currentCharacterId: null,
      currentCharacter: null,
      addCharacter: name => {
        const char = createNewCharacter(name)
        set({
          characters: [...get().characters, char],
          currentCharacterId: char.id,
          currentCharacter: char,
        })
      },
      updateCurrentCharacter: updates => {
        const { currentCharacterId, characters, currentCharacter } = get()
        if (!currentCharacterId || !currentCharacter) return
        const updated = { ...currentCharacter, ...updates }
        set({
          currentCharacter: updated,
          characters: characters.map(c => (c.id === currentCharacterId ? updated : c)),
        })
      },
      deleteCharacter: id => {
        const remaining = get().characters.filter(c => c.id !== id)
        const newCurrentId =
          id === get().currentCharacterId ? remaining[0]?.id ?? null : get().currentCharacterId
        set({
          characters: remaining,
          currentCharacterId: newCurrentId,
          currentCharacter: remaining.find(c => c.id === newCurrentId) ?? null,
        })
      },
      setCurrentCharacter: id => {
        set({
          currentCharacterId: id,
          currentCharacter: get().characters.find(c => c.id === id) ?? null,
        })
      },
      loadCharacters: characters => {
        set({
          characters,
          currentCharacterId: characters[0]?.id ?? null,
          currentCharacter: characters[0] ?? null,
        })
      },
    }),
    { name: "exalted-characters" }
  )
)


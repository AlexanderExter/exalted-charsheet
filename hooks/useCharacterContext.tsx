"use client"

import React, { createContext, useContext, useReducer, type ReactNode } from "react"
import type { Character } from "@/lib/character-types"
import { createNewCharacter } from "@/lib/character-defaults"

// Action types for character state management
export type CharacterAction =
  | { type: "SET_CHARACTER"; payload: Character }
  | { type: "UPDATE_CHARACTER"; payload: Partial<Character> }
  | { type: "ADD_CHARACTER"; payload: Character }
  | { type: "DELETE_CHARACTER"; payload: string }
  | { type: "SET_CURRENT_CHARACTER_ID"; payload: string }
  | { type: "LOAD_CHARACTERS"; payload: Character[] }

export interface CharacterState {
  characters: Character[]
  currentCharacterId: string | null
  currentCharacter: Character | null
}

// Character reducer
const characterReducer = (state: CharacterState, action: CharacterAction): CharacterState => {
  switch (action.type) {
    case "SET_CHARACTER":
      return {
        ...state,
        currentCharacter: action.payload,
        currentCharacterId: action.payload.id,
      }

    case "UPDATE_CHARACTER":
      const updatedCharacter = state.currentCharacter
        ? { ...state.currentCharacter, ...action.payload }
        : null

      const updatedCharacters = state.characters.map(char =>
        char.id === state.currentCharacterId ? { ...char, ...action.payload } : char
      )

      return {
        ...state,
        currentCharacter: updatedCharacter,
        characters: updatedCharacters,
      }

    case "ADD_CHARACTER":
      return {
        ...state,
        characters: [...state.characters, action.payload],
        currentCharacterId: action.payload.id,
        currentCharacter: action.payload,
      }

    case "DELETE_CHARACTER":
      const filteredCharacters = state.characters.filter(char => char.id !== action.payload)
      const wasCurrentDeleted = state.currentCharacterId === action.payload
      const newCurrentId =
        wasCurrentDeleted && filteredCharacters.length > 0
          ? filteredCharacters[0].id
          : wasCurrentDeleted
            ? null
            : state.currentCharacterId

      return {
        ...state,
        characters: filteredCharacters,
        currentCharacterId: newCurrentId,
        currentCharacter: newCurrentId
          ? filteredCharacters.find(char => char.id === newCurrentId) || null
          : null,
      }

    case "SET_CURRENT_CHARACTER_ID":
      const selectedCharacter = state.characters.find(char => char.id === action.payload)
      return {
        ...state,
        currentCharacterId: action.payload,
        currentCharacter: selectedCharacter || null,
      }

    case "LOAD_CHARACTERS":
      const firstCharacter = action.payload.length > 0 ? action.payload[0] : null
      return {
        ...state,
        characters: action.payload,
        currentCharacterId: firstCharacter?.id || null,
        currentCharacter: firstCharacter,
      }

    default:
      return state
  }
}

// Context types
interface CharacterContextType {
  state: CharacterState
  dispatch: React.Dispatch<CharacterAction>
  // Convenience methods
  updateCurrentCharacter: (updates: Partial<Character>) => void
  addNewCharacter: (name?: string) => void
  deleteCharacter: (id: string) => void
  setCurrentCharacter: (id: string) => void
  loadCharacters: (characters: Character[]) => void
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined)

// Initial state
const initialState: CharacterState = {
  characters: [],
  currentCharacterId: null,
  currentCharacter: null,
}

// Provider component
export const CharacterProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(characterReducer, initialState)

  // Convenience methods
  const updateCurrentCharacter = (updates: Partial<Character>) => {
    dispatch({ type: "UPDATE_CHARACTER", payload: updates })
  }

  const addNewCharacter = (name?: string) => {
    const newCharacter = createNewCharacter(name)
    dispatch({ type: "ADD_CHARACTER", payload: newCharacter })
  }

  const deleteCharacter = (id: string) => {
    dispatch({ type: "DELETE_CHARACTER", payload: id })
  }

  const setCurrentCharacter = (id: string) => {
    dispatch({ type: "SET_CURRENT_CHARACTER_ID", payload: id })
  }

  const loadCharacters = (characters: Character[]) => {
    dispatch({ type: "LOAD_CHARACTERS", payload: characters })
  }

  const contextValue: CharacterContextType = {
    state,
    dispatch,
    updateCurrentCharacter,
    addNewCharacter,
    deleteCharacter,
    setCurrentCharacter,
    loadCharacters,
  }

  return <CharacterContext.Provider value={contextValue}>{children}</CharacterContext.Provider>
}

// Hook to use the character context
export const useCharacterContext = () => {
  const context = useContext(CharacterContext)
  if (context === undefined) {
    throw new Error("useCharacterContext must be used within a CharacterProvider")
  }
  return context
}

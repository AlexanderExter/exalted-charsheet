import React, { useState } from "react"
import { EssencePanel } from "./EssencePanel"
import { basicCharacter } from "./combatStories.helpers"
import type { Character } from "@/lib/character-types"

const meta = { title: "Components/EssencePanel", component: EssencePanel }
export default meta

export const Basic = () => {
  const [character, setCharacter] = useState<Character>(basicCharacter)

  return (
    <EssencePanel
      character={character}
      updateCharacter={updates => setCharacter(prev => ({ ...prev, ...updates }))}
    />
  )
}


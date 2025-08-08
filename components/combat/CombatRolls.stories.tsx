import React, { useState } from "react"
import { CombatRolls } from "./CombatRolls"
import { basicCharacter } from "./combatStories.helpers"
import type { Character } from "@/lib/character-types"

const meta = { title: "Components/CombatRolls", component: CombatRolls }
export default meta

export const Basic = () => {
  const [character, setCharacter] = useState<Character>(basicCharacter)

  return (
    <CombatRolls
      character={character}
      updateCharacter={updates => setCharacter(prev => ({ ...prev, ...updates }))}
      getHighestAttribute={() => 3}
    />
  )
}


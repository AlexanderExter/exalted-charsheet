// Combat Tab Component - Essence, health, static values, and combat mechanics

import React from "react"
import { CombatRolls } from "@/components/combat/CombatRolls"
import { StaticValuesPanel } from "@/components/combat/StaticValuesPanel"
import { HealthTracker } from "@/components/combat/HealthTracker"
import type { Character } from "@/lib/character-types"
import type { CharacterCalculations } from "@/hooks/useCharacterCalculations"
import { useCombat } from "@/hooks/useCombat"
import { EssencePanel } from "@/components/character-tabs/common/EssencePanel"
import { NoCharacterCard } from "@/components/character-tabs/common/NoCharacterCard"
import { createDefaultEssence } from "@/lib/character-defaults"

interface CombatTabProps {
  character: Character | null
  updateCharacter: (updates: Partial<Character>) => void
  calculations: CharacterCalculations
}

export const CombatTab: React.FC<CombatTabProps> = React.memo(
  ({ character, updateCharacter, calculations }) => {
    const {
      getHighestAttribute,
      getTotalHealthLevels,
      addDramaticInjury,
      updateDramaticInjury,
      deleteDramaticInjury,
    } = useCombat({ character, updateCharacter, calculations })

    if (!character) {
      return <NoCharacterCard />
    }

    return (
      <div className="space-y-6">
        <EssencePanel
          essence={character.essence || createDefaultEssence()}
          onChange={essence => updateCharacter({ essence })}
        />

        <CombatRolls
          character={character}
          updateCharacter={updateCharacter}
          getHighestAttribute={getHighestAttribute}
        />

        <StaticValuesPanel
          character={character}
          updateCharacter={updateCharacter}
          calculations={calculations}
        />

        <HealthTracker
          character={character}
          updateCharacter={updateCharacter}
          calculations={calculations}
          getTotalHealthLevels={getTotalHealthLevels}
          addDramaticInjury={addDramaticInjury}
          updateDramaticInjury={updateDramaticInjury}
          deleteDramaticInjury={deleteDramaticInjury}
        />
      </div>
    )
  },
)

CombatTab.displayName = "CombatTab"

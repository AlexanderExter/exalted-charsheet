// Combat Tab Component - Essence, health, static values, and combat mechanics

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { EssencePanel } from "@/components/combat/EssencePanel"
import { CombatRolls } from "@/components/combat/CombatRolls"
import { StaticValuesPanel } from "@/components/combat/StaticValuesPanel"
import { HealthTracker } from "@/components/combat/HealthTracker"
import type { Character } from "@/lib/character-types"
import type { CharacterCalculations } from "@/hooks/useCharacterCalculations"
import { useCombat } from "@/hooks/useCombat"

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
      return (
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-500 italic">No character selected.</p>
            </CardContent>
          </Card>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <EssencePanel character={character} updateCharacter={updateCharacter} />

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

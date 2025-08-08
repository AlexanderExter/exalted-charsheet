import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import type { Character } from "@/lib/character-types"
import type { CharacterCalculations } from "@/hooks/useCharacterCalculations"
import { EssenceSection } from "./EssenceSection"
import { DicePoolSection } from "./DicePoolSection"
import { StaticValuesSection } from "./StaticValuesSection"
import { HealthSection } from "./HealthSection"

interface CombatTabProps {
  character: Character | null
  updateCharacter: (updates: Partial<Character>) => void
  calculations: CharacterCalculations
  calculateSoak: () => number
  calculateHardness: () => number
}

export const CombatTab: React.FC<CombatTabProps> = ({
  character,
  updateCharacter,
  calculations,
  calculateSoak,
  calculateHardness,
}) => {
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
      <EssenceSection character={character} updateCharacter={updateCharacter} />
      <DicePoolSection
        character={character}
        updateCharacter={updateCharacter}
        calculations={calculations}
      />
      <StaticValuesSection
        character={character}
        updateCharacter={updateCharacter}
        calculations={calculations}
        calculateSoak={calculateSoak}
        calculateHardness={calculateHardness}
      />
      <HealthSection
        character={character}
        updateCharacter={updateCharacter}
        calculations={calculations}
      />
    </div>
  )
}

CombatTab.displayName = "CombatTab"

export default CombatTab

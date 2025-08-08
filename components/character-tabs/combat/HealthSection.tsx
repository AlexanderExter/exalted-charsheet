import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Character, DramaticInjury } from "@/lib/character-types"
import type { CharacterCalculations } from "@/hooks/useCharacterCalculations"
import { v4 as uuidv4 } from "uuid"

interface HealthSectionProps {
  character: Character
  updateCharacter: (updates: Partial<Character>) => void
  calculations: CharacterCalculations
}

export const HealthSection: React.FC<HealthSectionProps> = ({
  character,
  updateCharacter,
  calculations,
}) => {
  const addDramaticInjury = () => {
    const newInjury: DramaticInjury = { id: uuidv4(), description: "", isHealed: false }
    updateCharacter({
      health: {
        ...character.health,
        dramaticInjuries: [...(character.health?.dramaticInjuries || []), newInjury],
      },
    })
  }

  const updateDramaticInjury = (
    id: string,
    field: keyof DramaticInjury,
    value: DramaticInjury[keyof DramaticInjury],
  ) => {
    updateCharacter({
      health: {
        ...character.health,
        dramaticInjuries: (character.health?.dramaticInjuries || []).map(injury =>
          injury.id === id ? { ...injury, [field]: value } : injury,
        ),
      },
    })
  }

  const deleteDramaticInjury = (id: string) => {
    updateCharacter({
      health: {
        ...character.health,
        dramaticInjuries: (character.health?.dramaticInjuries || []).filter(injury => injury.id !== id),
      },
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Track</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">Total Levels</div>
            <div className="text-lg font-bold">
              {calculations.healthLevels.zero +
                calculations.healthLevels.minusOne +
                calculations.healthLevels.minusTwo +
                calculations.healthLevels.incap}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Penalty</div>
            <div className="text-lg font-bold">{calculations.healthPenalty}</div>
          </div>
        </div>

        <div className="space-y-2">
          {(character.health?.dramaticInjuries || []).map(injury => (
            <div key={injury.id} className="flex items-start gap-2">
              <Textarea
                value={injury.description}
                onChange={e => updateDramaticInjury(injury.id, "description", e.target.value)}
                className="flex-1"
              />
              <Label className="flex items-center gap-1 text-xs">
                <Input
                  type="checkbox"
                  checked={injury.isHealed}
                  onChange={e => updateDramaticInjury(injury.id, "isHealed", e.target.checked)}
                />
                Healed
              </Label>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteDramaticInjury(injury.id)}
              >
                ×
              </Button>
            </div>
          ))}
        </div>
        <Button onClick={addDramaticInjury} variant="outline" size="sm">
          Add Dramatic Injury
        </Button>
      </CardContent>
    </Card>
  )
}

HealthSection.displayName = "HealthSection"

export default HealthSection

import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { Character } from "@/lib/character-types"
import type { CharacterCalculations } from "@/hooks/useCharacterCalculations"

interface StaticValuesSectionProps {
  character: Character
  updateCharacter: (updates: Partial<Character>) => void
  calculations: CharacterCalculations
  calculateSoak: () => number
  calculateHardness: () => number
}

export const StaticValuesSection: React.FC<StaticValuesSectionProps> = ({
  character,
  updateCharacter,
  calculations,
  calculateSoak,
  calculateHardness,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Static Values</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2 text-center">
              <div className="text-2xl font-bold text-red-600">{calculations.defense}</div>
              <div className="text-sm font-medium text-gray-700">Defense</div>
              <div className="flex items-center justify-center gap-1">
                <Label className="text-xs text-gray-600">Mod:</Label>
                <Input
                  type="number"
                  value={character?.staticValues?.defenseModifier || 0}
                  onChange={e => {
                    const value = Math.max(-5, Math.min(5, Number.parseInt(e.target.value) || 0))
                    updateCharacter({ staticValues: { ...character.staticValues, defenseModifier: value } })
                  }}
                  className="w-12 text-center text-xs"
                  min={-5}
                  max={5}
                />
              </div>
            </div>
            <div className="space-y-2 text-center">
              <div className="text-2xl font-bold text-green-600">{calculations.evasion}</div>
              <div className="text-sm font-medium text-gray-700">Evasion</div>
              <div className="flex items-center justify-center gap-1">
                <Label className="text-xs text-gray-600">Mod:</Label>
                <Input
                  type="number"
                  value={character?.staticValues?.evasionModifier || 0}
                  onChange={e => {
                    const value = Math.max(-5, Math.min(5, Number.parseInt(e.target.value) || 0))
                    updateCharacter({ staticValues: { ...character.staticValues, evasionModifier: value } })
                  }}
                  className="w-12 text-center text-xs"
                  min={-5}
                  max={5}
                />
              </div>
            </div>
            <div className="space-y-2 text-center">
              <div className="text-2xl font-bold text-orange-600">{calculations.parry}</div>
              <div className="text-sm font-medium text-gray-700">Parry</div>
              <div className="flex items-center justify-center gap-1">
                <Label className="text-xs text-gray-600">Mod:</Label>
                <Input
                  type="number"
                  value={character?.staticValues?.parryModifier || 0}
                  onChange={e => {
                    const value = Math.max(-5, Math.min(5, Number.parseInt(e.target.value) || 0))
                    updateCharacter({ staticValues: { ...character.staticValues, parryModifier: value } })
                  }}
                  className="w-12 text-center text-xs"
                  min={-5}
                  max={5}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {calculateSoak()}
              </div>
              <div className="text-sm font-medium text-gray-700">Soak</div>
              <div className="flex items-center justify-center gap-1">
                <Label className="text-xs text-gray-600">Mod:</Label>
                <Input
                  type="number"
                  value={character?.staticValues?.soakModifier || 0}
                  onChange={e => {
                    const value = Math.max(-5, Math.min(5, Number.parseInt(e.target.value) || 0))
                    updateCharacter({ staticValues: { ...character.staticValues, soakModifier: value } })
                  }}
                  className="w-12 text-center text-xs"
                  min={-5}
                  max={5}
                />
              </div>
            </div>
            <div className="space-y-2 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {calculateHardness()}
              </div>
              <div className="text-sm font-medium text-gray-700">Hardness</div>
              <div className="flex items-center justify-center gap-1">
                <Label className="text-xs text-gray-600">Mod:</Label>
                <Input
                  type="number"
                  value={character?.staticValues?.hardnessModifier || 0}
                  onChange={e => {
                    const value = Math.max(-5, Math.min(5, Number.parseInt(e.target.value) || 0))
                    updateCharacter({ staticValues: { ...character.staticValues, hardnessModifier: value } })
                  }}
                  className="w-12 text-center text-xs"
                  min={-5}
                  max={5}
                />
              </div>
            </div>
            <div className="space-y-2 text-center">
              <div className="text-2xl font-bold text-gray-600">{calculations.resolve}</div>
              <div className="text-sm font-medium text-gray-700">Resolve</div>
              <div className="flex items-center justify-center gap-1">
                <Label className="text-xs text-gray-600">Mod:</Label>
                <Input
                  type="number"
                  value={character?.staticValues?.resolveModifier || 0}
                  onChange={e => {
                    const value = Math.max(-5, Math.min(5, Number.parseInt(e.target.value) || 0))
                    updateCharacter({ staticValues: { ...character.staticValues, resolveModifier: value } })
                  }}
                  className="w-12 text-center text-xs"
                  min={-5}
                  max={5}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

StaticValuesSection.displayName = "StaticValuesSection"

export default StaticValuesSection

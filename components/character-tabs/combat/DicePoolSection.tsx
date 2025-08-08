import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Character } from "@/lib/character-types"
import type { CharacterCalculations } from "@/hooks/useCharacterCalculations"
import { calculateStatTotal } from "@/lib/exalted-utils"

interface DicePoolSectionProps {
  character: Character
  updateCharacter: (updates: Partial<Character>) => void
  calculations: CharacterCalculations
}

export const DicePoolSection: React.FC<DicePoolSectionProps> = ({
  character,
  updateCharacter,
  calculations,
}) => {
  const highestAttribute = calculations.highestAttribute

  return (
    <Card>
      <CardHeader>
        <CardTitle>Combat Rolls</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">Join Battle</h3>
            <div className="p-3 bg-white rounded border">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <Label className="text-xs text-gray-600">Extra Dice</Label>
                  <Input
                    type="number"
                    value={character?.combat?.joinBattleDiceBonus || 0}
                    onChange={e => {
                      const value = Math.max(-10, Math.min(10, Number.parseInt(e.target.value) || 0))
                      updateCharacter({ combat: { ...character.combat, joinBattleDiceBonus: value } })
                    }}
                    className="w-full text-center"
                    min={-10}
                    max={10}
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Extra Success</Label>
                  <Input
                    type="number"
                    value={character?.combat?.joinBattleSuccessBonus || 0}
                    onChange={e => {
                      const value = Math.max(-5, Math.min(5, Number.parseInt(e.target.value) || 0))
                      updateCharacter({ combat: { ...character.combat, joinBattleSuccessBonus: value } })
                    }}
                    className="w-full text-center"
                    min={-5}
                    max={5}
                  />
                </div>
              </div>
              <div className="text-center p-2 bg-blue-100 rounded">
                <div className="text-lg font-bold text-blue-800">
                  Roll {highestAttribute +
                    Math.max(
                      calculateStatTotal(character?.abilities?.closeCombat || { base: 0, added: 0, bonus: 0 }),
                      calculateStatTotal(character?.abilities?.rangedCombat || { base: 0, added: 0, bonus: 0 })
                    ) +
                    (character?.combat?.joinBattleDiceBonus || 0)}
                  {(character?.combat?.joinBattleSuccessBonus || 0) !== 0 &&
                    `, ${character?.combat?.joinBattleSuccessBonus > 0 ? "+" : ""}${
                      character?.combat?.joinBattleSuccessBonus
                    } success in`}
                  , TN 7 Double 10s
                </div>
                <div className="text-sm text-blue-600">Join Battle</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">Power Tracker</h3>
            <div className="p-3 bg-white rounded border space-y-3">
              <div className="flex items-center justify-center gap-4">
                <Button
                  onClick={() =>
                    updateCharacter({
                      combat: { ...character.combat, power: Math.max(0, (character?.combat?.power || 0) - 1) },
                    })
                  }
                  variant="outline"
                  size="sm"
                >
                  -
                </Button>
                <div className="text-3xl font-bold text-gray-800 w-16 text-center">
                  {character?.combat?.power || 0}
                </div>
                <Button
                  onClick={() =>
                    updateCharacter({
                      combat: { ...character.combat, power: (character?.combat?.power || 0) + 1 },
                    })
                  }
                  variant="outline"
                  size="sm"
                >
                  +
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

DicePoolSection.displayName = "DicePoolSection"

export default DicePoolSection

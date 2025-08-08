// Combat Tab Component - Essence, health, static values, and combat mechanics

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { EssenceEditor } from "@/components/EssenceEditor"
import type { Character } from "@/lib/character-types"
import { getAnimaLevel, getActiveAnimaRulings, calculateStatTotal } from "@/lib/exalted-utils"
import type { CharacterCalculations } from "@/hooks/useCharacterCalculations"
import { StaticValuesPanel } from "@/components/combat/StaticValuesPanel"
import { HealthTracker } from "@/components/combat/HealthTracker"
import { useCombat } from "@/hooks/useCombat"

interface CombatTabProps {
  character: Character | null
  updateCharacter: (updates: Partial<Character>) => void
  calculations: CharacterCalculations
  calculateSoak: () => number
  calculateHardness: () => number
}

export const CombatTab: React.FC<CombatTabProps> = React.memo(
  ({ character, updateCharacter, calculations, calculateSoak, calculateHardness }) => {
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
        {/* Essence (duplicated for combat convenience) */}
        <Card>
          <CardHeader>
            <CardTitle>Essence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <EssenceEditor
                essence={
                  character.essence || {
                    rating: 1,
                    motes: 5,
                    commitments: 0,
                    spent: 0,
                    anima: 0,
                  }
                }
                onChange={essence => updateCharacter({ essence })}
              />

              <div className="space-y-4">
                {/* Anima Slider */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Anima Level</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>Dim</span>
                      <span>Burning</span>
                      <span>Bonfire</span>
                      <span>Iconic</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="1"
                      value={character.essence?.anima || 0}
                      onChange={e => {
                        const value = Number.parseInt(e.target.value)
                        updateCharacter({
                          essence: { ...character.essence, anima: value },
                        })
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>0</span>
                      <span>10</span>
                    </div>
                  </div>
                </div>

                {/* Anima Effects */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Current Level:</span>
                    <Badge variant="secondary">
                      {getAnimaLevel(character.essence?.anima || 0)}
                    </Badge>
                  </div>
                  {getActiveAnimaRulings(character?.essence?.anima || 0).length > 0 && (
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-purple-700 mb-2">
                        Active Effects:
                      </div>
                      {getActiveAnimaRulings(character?.essence?.anima || 0).map(
                        (ruling, index) => (
                          <div key={index} className="text-sm text-purple-600">
                            • {ruling}
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>

                {/* Exalt Type Rules Placeholder */}
                <div className="space-y-2">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      Exalt Type Rules:
                    </div>
                    <div className="text-sm text-gray-600">
                      [Placeholder: Exalt-specific rules and abilities will be displayed here based on character type]
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Combat Rolls */}
        <Card>
          <CardHeader>
            <CardTitle>Combat Rolls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Join Battle */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700">Join Battle</h3>
                <div className="p-3 bg-white rounded border">
                  <div className="text-sm text-gray-600 mb-3">
                    Best Attribute + Best of Close/Ranged Combat + Modifiers
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <Label className="text-xs text-gray-600">Extra Dice</Label>
                      <Input
                        type="number"
                        value={character?.combat?.joinBattleDiceBonus || 0}
                        onChange={e => {
                          const value = Math.max(
                            -10,
                            Math.min(10, Number.parseInt(e.target.value) || 0),
                          )
                          updateCharacter({
                            combat: { ...character.combat, joinBattleDiceBonus: value },
                          })
                        }}
                        className="w-full text-center"
                        min={-10}
                        max={10}
                      />
                      <div className="text-xs text-gray-400">±10 cap</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">Extra Success</Label>
                      <Input
                        type="number"
                        value={character?.combat?.joinBattleSuccessBonus || 0}
                        onChange={e => {
                          const value = Math.max(
                            -5,
                            Math.min(5, Number.parseInt(e.target.value) || 0),
                          )
                          updateCharacter({
                            combat: { ...character.combat, joinBattleSuccessBonus: value },
                          })
                        }}
                        className="w-full text-center"
                        min={-5}
                        max={5}
                      />
                      <div className="text-xs text-gray-400">±5 cap</div>
                    </div>
                  </div>
                  <div className="text-center p-2 bg-blue-100 rounded">
                    <div className="text-lg font-bold text-blue-800">
                      Roll{" "}
                      {getHighestAttribute() +
                        Math.max(
                          calculateStatTotal(
                            character?.abilities?.closeCombat || { base: 0, added: 0, bonus: 0 },
                          ),
                          calculateStatTotal(
                            character?.abilities?.rangedCombat || { base: 0, added: 0, bonus: 0 },
                          ),
                        ) +
                        (character?.combat?.joinBattleDiceBonus || 0)}
                      {(character?.combat?.joinBattleSuccessBonus || 0) !== 0 &&
                        `, ${
                          character?.combat?.joinBattleSuccessBonus > 0 ? "+" : ""
                        }${character?.combat?.joinBattleSuccessBonus} success in`}
                      , TN 7 Double 10s
                    </div>
                    <div className="text-sm text-blue-600">Join Battle</div>
                  </div>
                </div>
              </div>

              {/* Power Tracker */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700">Power Tracker</h3>
                <div className="p-3 bg-white rounded border space-y-3">
                  <div className="text-sm text-gray-600 mb-2">Track power gained from attacks</div>
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      onClick={() =>
                        updateCharacter({
                          combat: {
                            ...character.combat,
                            power: Math.max(0, (character?.combat?.power || 0) - 1),
                          },
                        })
                      }
                      variant="outline"
                    >
                      -1
                    </Button>
                    <div className="w-16 h-12 flex items-center justify-center border rounded bg-gray-50">
                      <span className="text-xl font-bold text-gray-700">
                        {character?.combat?.power || 0}
                      </span>
                    </div>
                    <Button
                      onClick={() =>
                        updateCharacter({
                          combat: { ...character.combat, power: (character?.combat?.power || 0) + 1 },
                        })
                      }
                      variant="outline"
                    >
                      +1
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Static Values */}
        <StaticValuesPanel
          character={character}
          updateCharacter={updateCharacter}
          calculations={calculations}
          calculateSoak={calculateSoak}
          calculateHardness={calculateHardness}
        />

        {/* Health Tracker */}
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

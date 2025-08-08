// Combat Tab Component - Essence, health, static values, and combat mechanics

import React, { useCallback } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import type { Character, ExaltType, DramaticInjury } from "@/lib/character-types"
import { getAnimaLevel, getActiveAnimaRulings, calculateStatTotal } from "@/lib/exalted-utils"
import type { CharacterCalculations } from "@/hooks/useCharacterCalculations"
import { v4 as uuidv4 } from "uuid"

interface CombatTabProps {
  character: Character | null
  updateCharacter: (updates: Partial<Character>) => void
  calculations: CharacterCalculations
  calculateSoak: () => number
  calculateHardness: () => number
}

export const CombatTab: React.FC<CombatTabProps> = React.memo(
  ({ character, updateCharacter, calculations, calculateSoak, calculateHardness }) => {
    // Helper function to get highest attribute
    const getHighestAttribute = useCallback(() => {
      if (!character?.attributes) return 0
      return calculations.highestAttribute
    }, [character?.attributes, calculations.highestAttribute])

    // Helper function to get total health levels
    const getTotalHealthLevels = useCallback(() => {
      return (
        calculations.healthLevels.zero +
        calculations.healthLevels.minusOne +
        calculations.healthLevels.minusTwo +
        calculations.healthLevels.incap
      )
    }, [calculations.healthLevels])

    // Dramatic injury management
    const addDramaticInjury = useCallback(() => {
      if (!character) return

      const newInjury: DramaticInjury = {
        id: uuidv4(),
        description: "",
        isHealed: false,
      }

      updateCharacter({
        health: {
          ...character.health,
          dramaticInjuries: [...(character.health?.dramaticInjuries || []), newInjury],
        },
      })
    }, [character, updateCharacter])

    const updateDramaticInjury = useCallback(
      (
        id: string,
        field: keyof DramaticInjury,
        value: DramaticInjury[keyof DramaticInjury]
      ) => {
        if (!character) return

        updateCharacter({
          health: {
            ...character.health,
            dramaticInjuries: (character.health?.dramaticInjuries || []).map(injury =>
              injury.id === id ? { ...injury, [field]: value } : injury
            ),
          },
        })
      },
      [character, updateCharacter]
    )

    const deleteDramaticInjury = useCallback(
      (id: string) => {
        if (!character) return

        updateCharacter({
          health: {
            ...character.health,
            dramaticInjuries: (character.health?.dramaticInjuries || []).filter(
              injury => injury.id !== id
            ),
          },
        })
      },
      [character, updateCharacter]
    )

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
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Rating</Label>
                  <Input
                    type="number"
                    value={character.essence?.rating || 1}
                    onChange={e => {
                      const value = Math.max(0, Math.min(10, Number.parseInt(e.target.value) || 0))
                      updateCharacter({
                        essence: { ...character.essence, rating: value },
                      })
                    }}
                    className="w-20 text-center"
                    min={0}
                    max={10}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Motes</Label>
                  <Input
                    type="number"
                    value={character.essence?.motes || 5}
                    onChange={e => {
                      const value = Math.max(0, Math.min(50, Number.parseInt(e.target.value) || 0))
                      updateCharacter({
                        essence: { ...character.essence, motes: value },
                      })
                    }}
                    className="w-20 text-center"
                    min={0}
                    max={50}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Commitments</Label>
                  <Input
                    type="number"
                    value={character.essence?.commitments || 0}
                    onChange={e => {
                      const value = Math.max(0, Number.parseInt(e.target.value) || 0)
                      updateCharacter({
                        essence: { ...character.essence, commitments: value },
                      })
                    }}
                    className="w-20 text-center"
                    min={0}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Spent</Label>
                  <Input
                    type="number"
                    value={character.essence?.spent || 0}
                    onChange={e => {
                      const value = Math.max(0, Number.parseInt(e.target.value) || 0)
                      updateCharacter({
                        essence: { ...character.essence, spent: value },
                      })
                    }}
                    className="w-20 text-center"
                    min={0}
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-medium text-blue-600">Remain</Label>
                    <span className="font-bold text-blue-600">
                      {(character.essence?.motes || 5) -
                        (character.essence?.commitments || 0) -
                        (character.essence?.spent || 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="font-medium text-green-600">Open</Label>
                    <span className="font-bold text-green-600">
                      {(character.essence?.motes || 5) - (character.essence?.commitments || 0)}
                    </span>
                  </div>
                </div>
              </div>

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
                      className={`w-full h-3 rounded-lg appearance-none cursor-pointer slider ${
                        (character?.essence?.anima || 0) <= 4
                          ? "slider-dim"
                          : (character?.essence?.anima || 0) <= 6
                            ? "slider-burning"
                            : (character?.essence?.anima || 0) <= 9
                              ? "slider-bonfire"
                              : "slider-iconic"
                      }`}
                      style={{
                        background: `linear-gradient(to right, 
                        ${
                          (character?.essence?.anima || 0) <= 4
                            ? "#9ca3af"
                            : (character?.essence?.anima || 0) <= 6
                              ? "#f97316"
                              : (character?.essence?.anima || 0) <= 9
                                ? "#ef4444"
                                : "#9333ea"
                        } 0%, 
                        ${
                          (character?.essence?.anima || 0) <= 4
                            ? "#9ca3af"
                            : (character?.essence?.anima || 0) <= 6
                              ? "#f97316"
                              : (character?.essence?.anima || 0) <= 9
                                ? "#ef4444"
                                : "#9333ea"
                        } ${((character?.essence?.anima || 0) / 10) * 100}%, 
                        #e5e7eb ${((character?.essence?.anima || 0) / 10) * 100}%, 
                        #e5e7eb 100%)`,
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0</span>
                      <span>4</span>
                      <span>6</span>
                      <span>9</span>
                      <span>10</span>
                    </div>
                    <div className="text-center">
                      <span className="text-lg font-bold text-purple-600">
                        {character?.essence?.anima || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Anima Level and Rulings */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-purple-600">Anima Level</span>
                    <Badge variant="outline" className="text-purple-600">
                      {getAnimaLevel(character?.essence?.anima || 0)}
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
                        )
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
                            Math.min(10, Number.parseInt(e.target.value) || 0)
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
                            Math.min(5, Number.parseInt(e.target.value) || 0)
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
                            character?.abilities?.closeCombat || { base: 0, added: 0, bonus: 0 }
                          ),
                          calculateStatTotal(
                            character?.abilities?.rangedCombat || { base: 0, added: 0, bonus: 0 }
                          )
                        ) +
                        (character?.combat?.joinBattleDiceBonus || 0)}
                      {(character?.combat?.joinBattleSuccessBonus || 0) !== 0 &&
                        `, ${character?.combat?.joinBattleSuccessBonus > 0 ? "+" : ""}${character?.combat?.joinBattleSuccessBonus} success in`}
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
                          combat: {
                            ...character.combat,
                            power: (character?.combat?.power || 0) + 1,
                          },
                        })
                      }
                      variant="outline"
                      size="sm"
                    >
                      +
                    </Button>
                  </div>

                  {/* Gambits */}
                  {(character?.combat?.power || 0) >= 3 && (
                    <div className="bg-yellow-50 p-2 rounded">
                      <div className="text-sm font-medium text-yellow-700 mb-1">
                        Available Gambits:
                      </div>
                      <div className="text-sm text-yellow-600">• Hinder(3) Available</div>
                    </div>
                  )}

                  {/* Decisive Attack Roller */}
                  <div className="border-t pt-3">
                    <h4 className="font-medium text-gray-700 mb-2">Decisive Attack Roller</h4>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <Label className="text-xs text-gray-600">Extra Dice</Label>
                        <Input
                          type="number"
                          value={character?.combat?.decisiveExtraDice || 0}
                          onChange={e => {
                            const value = Math.max(
                              -10,
                              Math.min(10, Number.parseInt(e.target.value) || 0)
                            )
                            updateCharacter({
                              combat: { ...character.combat, decisiveExtraDice: value },
                            })
                          }}
                          className="text-center text-sm"
                          min={-10}
                          max={10}
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600">Extra Success</Label>
                        <Input
                          type="number"
                          value={character?.combat?.decisiveExtraSuccess || 0}
                          onChange={e => {
                            const value = Math.max(
                              -5,
                              Math.min(5, Number.parseInt(e.target.value) || 0)
                            )
                            updateCharacter({
                              combat: { ...character.combat, decisiveExtraSuccess: value },
                            })
                          }}
                          className="text-center text-sm"
                          min={-5}
                          max={5}
                        />
                      </div>
                    </div>
                    <div className="text-center p-2 bg-red-100 rounded text-sm">
                      <div className="font-bold text-red-800">
                        Roll{" "}
                        {(character?.combat?.power || 0) +
                          (character?.combat?.decisiveExtraDice || 0)}{" "}
                        dice
                        {(character?.combat?.decisiveExtraSuccess || 0) +
                          ((character?.weapons || [])[0]?.damage || 0) >
                          0 &&
                          `, +${
                            (character?.combat?.decisiveExtraSuccess || 0) +
                            ((character?.weapons || [])[0]?.damage || 0)
                          } success in`}
                        , TN 7 Double 10s
                      </div>
                      <div className="text-red-600">Decisive Attack</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Weapon Combat Roller */}
            {(character?.weapons || []).length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold text-gray-700 mb-3">Weapon Combat Rolls</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 px-3 text-left">Weapon</th>
                        <th className="py-2 px-3 text-center">Range</th>
                        <th className="py-2 px-3 text-center">Attack Pool</th>
                        <th className="py-2 px-3 text-center">Damage Pool</th>
                        <th className="py-2 px-3 text-center">Overwhelming</th>
                        <th className="py-2 px-3 text-center">Defense Bonus</th>
                      </tr>
                    </thead>
                    <tbody>
                      {character.weapons.map(weapon => {
                        const isClose = weapon.range === "close"
                        const relevantAbility = isClose ? "closeCombat" : "rangedCombat"
                        const abilityTotal = calculateStatTotal(
                          character.abilities[relevantAbility] || { base: 0, added: 0, bonus: 0 }
                        )
                        const bestAttr = getHighestAttribute()
                        const attackPool = bestAttr + abilityTotal + (weapon.accuracy || 0)
                        const damagePool = weapon.damage || 0

                        return (
                          <tr key={weapon.id} className="border-b border-gray-200">
                            <td className="py-2 px-3 font-medium">
                              {weapon.name || "Unnamed Weapon"}
                            </td>
                            <td className="py-2 px-3 text-center capitalize">
                              {weapon.range || "close"}
                            </td>
                            <td className="py-2 px-3 text-center font-bold text-blue-600">
                              {attackPool}
                            </td>
                            <td className="py-2 px-3 text-center font-bold text-red-600">
                              {damagePool}
                            </td>
                            <td className="py-2 px-3 text-center">{weapon.overwhelming || 0}</td>
                            <td className="py-2 px-3 text-center">+{weapon.defence || 0}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Static Values */}
        <Card>
          <CardHeader>
            <CardTitle>Static Values</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* First Row */}
              <div className="grid grid-cols-3 gap-6">
                {/* Defense */}
                <div className="space-y-2">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{calculations.defense}</div>
                    <div className="text-sm font-medium text-gray-700">Defense</div>
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    <div>Max of Evasion/Parry</div>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Label className="text-xs text-gray-600">Mod:</Label>
                    <Input
                      type="number"
                      value={character?.staticValues?.defenseModifier || 0}
                      onChange={e => {
                        const value = Math.max(
                          -5,
                          Math.min(5, Number.parseInt(e.target.value) || 0)
                        )
                        updateCharacter({
                          staticValues: { ...character.staticValues, defenseModifier: value },
                        })
                      }}
                      className="w-12 text-center text-xs"
                      min={-5}
                      max={5}
                    />
                  </div>
                </div>

                {/* Evasion */}
                <div className="space-y-2">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{calculations.evasion}</div>
                    <div className="text-sm font-medium text-gray-700">Evasion</div>
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    <div>⌈(Athletics + Max Attr) / 2⌉</div>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Label className="text-xs text-gray-600">Mod:</Label>
                    <Input
                      type="number"
                      value={character?.staticValues?.evasionModifier || 0}
                      onChange={e => {
                        const value = Math.max(
                          -5,
                          Math.min(5, Number.parseInt(e.target.value) || 0)
                        )
                        updateCharacter({
                          staticValues: { ...character.staticValues, evasionModifier: value },
                        })
                      }}
                      className="w-12 text-center text-xs"
                      min={-5}
                      max={5}
                    />
                  </div>
                </div>

                {/* Parry */}
                <div className="space-y-2">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{calculations.parry}</div>
                    <div className="text-sm font-medium text-gray-700">Parry</div>
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    <div>⌈(Close Combat + Max Attr) / 2⌉</div>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Label className="text-xs text-gray-600">Mod:</Label>
                    <Input
                      type="number"
                      value={character?.staticValues?.parryModifier || 0}
                      onChange={e => {
                        const value = Math.max(
                          -5,
                          Math.min(5, Number.parseInt(e.target.value) || 0)
                        )
                        updateCharacter({
                          staticValues: { ...character.staticValues, parryModifier: value },
                        })
                      }}
                      className="w-12 text-center text-xs"
                      min={-5}
                      max={5}
                    />
                  </div>
                </div>
              </div>

              {/* Second Row */}
              <div className="grid grid-cols-3 gap-6">
                {/* Resolve */}
                <div className="space-y-2">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{calculations.resolve}</div>
                    <div className="text-sm font-medium text-gray-700">Resolve</div>
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    <div>2 + Integrity bonuses</div>
                    <div>Integrity 1+ = +1, Integrity 3+ = +2</div>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Label className="text-xs text-gray-600">Mod:</Label>
                    <Input
                      type="number"
                      value={character?.staticValues?.resolveModifier || 0}
                      onChange={e => {
                        const value = Math.max(
                          -5,
                          Math.min(5, Number.parseInt(e.target.value) || 0)
                        )
                        updateCharacter({
                          staticValues: { ...character.staticValues, resolveModifier: value },
                        })
                      }}
                      className="w-12 text-center text-xs"
                      min={-5}
                      max={5}
                    />
                  </div>
                </div>

                {/* Soak */}
                <div className="space-y-2">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{calculateSoak()}</div>
                    <div className="text-sm font-medium text-gray-700">Soak</div>
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    <div>1 + Physique + Armor</div>
                    <div>
                      Armor: +
                      {(character?.armor || []).reduce(
                        (total: number, armor) => total + (armor.soak || 0),
                        0
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Label className="text-xs text-gray-600">Mod:</Label>
                    <Input
                      type="number"
                      value={character?.staticValues?.soakModifier || 0}
                      onChange={e => {
                        const value = Math.max(
                          -5,
                          Math.min(5, Number.parseInt(e.target.value) || 0)
                        )
                        updateCharacter({
                          staticValues: { ...character.staticValues, soakModifier: value },
                        })
                      }}
                      className="w-12 text-center text-xs"
                      min={-5}
                      max={5}
                    />
                  </div>
                </div>

                {/* Hardness */}
                <div className="space-y-2">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{calculateHardness()}</div>
                    <div className="text-sm font-medium text-gray-700">Hardness</div>
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    <div>Essence + 2 + Armor</div>
                    <div>
                      Armor: +
                      {(character?.armor || []).reduce(
                        (total: number, armor) => total + (armor.hardness || 0),
                        0
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Label className="text-xs text-gray-600">Mod:</Label>
                    <Input
                      type="number"
                      value={character?.staticValues?.hardnessModifier || 0}
                      onChange={e => {
                        const value = Math.max(
                          -5,
                          Math.min(5, Number.parseInt(e.target.value) || 0)
                        )
                        updateCharacter({
                          staticValues: { ...character.staticValues, hardnessModifier: value },
                        })
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

        {/* Health Track - This section would continue with health levels and dramatic injuries */}
        {/* For brevity, I'll add a simplified version - the full version would include the complex health grid */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Health Track
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium text-gray-600">Exalt Type:</Label>
                  <Select
                    value={character?.health?.exaltType || "lunar"}
                    onValueChange={(value: ExaltType) =>
                      updateCharacter({
                        health: { ...character.health, exaltType: value },
                      })
                    }
                  >
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lunar">Lunar</SelectItem>
                      <SelectItem value="solar">Solar</SelectItem>
                      <SelectItem value="dragon-blood">Dragon-Blood</SelectItem>
                      <SelectItem value="sidereal">Sidereal</SelectItem>
                      <SelectItem value="abyssal">Abyssal</SelectItem>
                      <SelectItem value="liminal">Liminal</SelectItem>
                      <SelectItem value="exigent">Exigent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Health Levels Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Zero Penalty</Label>
                  <Input
                    type="number"
                    value={character?.health?.baseline?.zero || 1}
                    onChange={e => {
                      const value = Math.max(0, Number.parseInt(e.target.value) || 0)
                      updateCharacter({
                        health: {
                          ...character.health,
                          baseline: { ...character.health?.baseline, zero: value },
                        },
                      })
                    }}
                    className="text-center"
                    min={0}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">-1 Penalty</Label>
                  <Input
                    type="number"
                    value={character?.health?.baseline?.minusOne || 2}
                    onChange={e => {
                      const value = Math.max(0, Number.parseInt(e.target.value) || 0)
                      updateCharacter({
                        health: {
                          ...character.health,
                          baseline: { ...character.health?.baseline, minusOne: value },
                        },
                      })
                    }}
                    className="text-center"
                    min={0}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">-2 Penalty</Label>
                  <Input
                    type="number"
                    value={character?.health?.baseline?.minusTwo || 2}
                    onChange={e => {
                      const value = Math.max(0, Number.parseInt(e.target.value) || 0)
                      updateCharacter({
                        health: {
                          ...character.health,
                          baseline: { ...character.health?.baseline, minusTwo: value },
                        },
                      })
                    }}
                    className="text-center"
                    min={0}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Incapacitated</Label>
                  <Input
                    type="number"
                    value={character?.health?.baseline?.incap || 1}
                    onChange={e => {
                      const value = Math.max(0, Number.parseInt(e.target.value) || 0)
                      updateCharacter({
                        health: {
                          ...character.health,
                          baseline: { ...character.health?.baseline, incap: value },
                        },
                      })
                    }}
                    className="text-center"
                    min={0}
                  />
                </div>
              </div>

              {/* Ox-Body Levels */}
              <div className="mt-4">
                <Label className="text-sm font-medium text-gray-700">
                  Ox-Body Levels (adds health levels)
                </Label>
                <Input
                  type="number"
                  value={character?.health?.oxBodyLevels || 0}
                  onChange={e => {
                    const value = Math.max(0, Number.parseInt(e.target.value) || 0)
                    updateCharacter({
                      health: { ...character.health, oxBodyLevels: value },
                    })
                  }}
                  className="text-center w-20"
                  min={0}
                  max={10}
                />
              </div>

              {/* Health Summary */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Total Health Levels:</span>
                    <span className="ml-2 font-bold">
                      {calculations.healthLevels.zero +
                        calculations.healthLevels.minusOne +
                        calculations.healthLevels.minusTwo +
                        calculations.healthLevels.incap}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Total Damage:</span>
                    <span className="ml-2 font-bold">
                      {(character?.health?.bashingDamage || 0) +
                        (character?.health?.lethalDamage || 0) +
                        (character?.health?.aggravatedDamage || 0)}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Current Penalty:</span>
                    <span className="ml-2 font-bold text-red-600">
                      {calculations.healthPenalty === 0 
                        ? "None" 
                        : calculations.healthPenalty === -4
                          ? "-"
                          : calculations.healthPenalty}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <span className="ml-2 font-bold">
                      {calculations.healthPenalty === -4
                        ? "Incapacitated"
                        : calculations.healthPenalty === -2
                          ? "Injured (-2)"
                          : calculations.healthPenalty === -1
                            ? "Wounded (-1)"
                            : "Healthy"}
                    </span>
                  </div>
                </div>
                
                {/* Individual Health Level Counts */}
                <div className="mt-3 border-t pt-3">
                  <div className="text-xs font-medium text-gray-600 mb-2">Health Level Breakdown:</div>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div className="text-center">
                      <div className="font-medium text-green-600">0 Penalty</div>
                      <div className="text-lg font-bold">{calculations.healthLevels.zero}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-yellow-600">-1 Penalty</div>
                      <div className="text-lg font-bold">{calculations.healthLevels.minusOne}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-orange-600">-2 Penalty</div>
                      <div className="text-lg font-bold">{calculations.healthLevels.minusTwo}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-red-600">Incapacitated</div>
                      <div className="text-lg font-bold">{calculations.healthLevels.incap}</div>
                    </div>
                  </div>
                </div>
                
                {/* Incapacitation Rules */}
                {calculations.healthPenalty === -4 && (
                  <div className="mt-3 border-t pt-3 bg-red-50 p-2 rounded">
                    <div className="text-xs font-medium text-red-700 mb-1">Incapacitation Rules:</div>
                    <div className="text-xs text-red-600">
                      [Placeholder: Character is incapacitated and cannot take actions except for reflexive actions and one-die stunts]
                    </div>
                  </div>
                )}
              </div>

              {/* Damage Tracking */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Bashing Damage</Label>
                  <Input
                    type="number"
                    value={character?.health?.bashingDamage || 0}
                    onChange={e => {
                      const rawValue = Number.parseInt(e.target.value) || 0
                      const totalHealth = getTotalHealthLevels()
                      const otherDamage =
                        (character?.health?.lethalDamage || 0) +
                        (character?.health?.aggravatedDamage || 0)
                      const maxAllowed = Math.max(0, totalHealth - otherDamage)
                      const value = Math.max(0, Math.min(maxAllowed, rawValue))
                      updateCharacter({
                        health: { ...character.health, bashingDamage: value },
                      })
                    }}
                    className="text-center"
                    min={0}
                    max={getTotalHealthLevels()}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Lethal Damage</Label>
                  <Input
                    type="number"
                    value={character?.health?.lethalDamage || 0}
                    onChange={e => {
                      const rawValue = Number.parseInt(e.target.value) || 0
                      const totalHealth = getTotalHealthLevels()
                      const otherDamage =
                        (character?.health?.bashingDamage || 0) +
                        (character?.health?.aggravatedDamage || 0)
                      const maxAllowed = Math.max(0, totalHealth - otherDamage)
                      const value = Math.max(0, Math.min(maxAllowed, rawValue))
                      updateCharacter({
                        health: { ...character.health, lethalDamage: value },
                      })
                    }}
                    className="text-center"
                    min={0}
                    max={getTotalHealthLevels()}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Aggravated Damage</Label>
                  <Input
                    type="number"
                    value={character?.health?.aggravatedDamage || 0}
                    onChange={e => {
                      const rawValue = Number.parseInt(e.target.value) || 0
                      const totalHealth = getTotalHealthLevels()
                      const otherDamage =
                        (character?.health?.bashingDamage || 0) +
                        (character?.health?.lethalDamage || 0)
                      const maxAllowed = Math.max(0, totalHealth - otherDamage)
                      const value = Math.max(0, Math.min(maxAllowed, rawValue))
                      updateCharacter({
                        health: { ...character.health, aggravatedDamage: value },
                      })
                    }}
                    className="text-center"
                    min={0}
                    max={getTotalHealthLevels()}
                  />
                </div>
              </div>

              {/* Dramatic Injuries */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">Dramatic Injuries</Label>
                  <Button onClick={addDramaticInjury} size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Injury
                  </Button>
                </div>

                {(character?.health?.dramaticInjuries || []).length === 0 ? (
                  <p className="text-gray-500 italic text-sm">No dramatic injuries.</p>
                ) : (
                  <div className="space-y-2">
                    {(character?.health?.dramaticInjuries || []).map(injury => (
                      <div
                        key={injury.id}
                        className={`flex items-center gap-2 p-2 rounded ${
                          injury.isHealed
                            ? "bg-green-50 border border-green-200"
                            : "bg-red-50 border border-red-200"
                        }`}
                      >
                        <Input
                          value={injury.description}
                          onChange={e =>
                            updateDramaticInjury(injury.id, "description", e.target.value)
                          }
                          placeholder="Injury description..."
                          className={`flex-1 ${
                            injury.isHealed
                              ? "text-green-700 bg-green-50"
                              : "text-red-700 bg-red-50"
                          }`}
                        />
                        <Button
                          onClick={() =>
                            updateDramaticInjury(injury.id, "isHealed", !injury.isHealed)
                          }
                          size="sm"
                          variant={injury.isHealed ? "default" : "outline"}
                          className={
                            injury.isHealed
                              ? "bg-green-600 hover:bg-green-700"
                              : "text-red-600 border-red-300 hover:bg-red-50"
                          }
                        >
                          {injury.isHealed ? "Healed" : "Heal"}
                        </Button>
                        <Button
                          onClick={() => deleteDramaticInjury(injury.id)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
)

CombatTab.displayName = "CombatTab"

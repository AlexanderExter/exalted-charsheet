// Core Stats Tab Component - Essence, attributes, abilities, and dice pool calculator

import React, { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import type {
  Character,
  StatBlock,
  AttributeType,
  AbilityType,
} from "@/lib/character-types"
import { getAnimaLevel, getActiveAnimaRulings, calculateStatTotal } from "@/lib/exalted-utils"

interface CoreStatsTabProps {
  character: Character | null
  updateCharacter: (updates: Partial<Character>) => void
  calculateAbilityTotal: (abilityKey: AbilityType) => number
  calculateDicePool: () => {
    basePool: number
    extraDice: number
    totalPool: number
    cappedBonusDice: number
    actionPhrase: string
  }
  globalAbilityAttribute: AttributeType | "none"
  setGlobalAbilityAttribute: (attribute: AttributeType | "none") => void
}

export const CoreStatsTab: React.FC<CoreStatsTabProps> = React.memo(
  ({
    character,
    updateCharacter,
    calculateAbilityTotal,
    calculateDicePool,
    globalAbilityAttribute,
    setGlobalAbilityAttribute,
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
        {/* Essence */}
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

        {/* Attributes and Abilities */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Attributes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-3 text-left">Attribute</th>
                      <th className="py-2 px-3 text-center">Base</th>
                      <th className="py-2 px-3 text-center">Added</th>
                      <th className="py-2 px-3 text-center">Bonus</th>
                      <th className="py-2 px-3 text-center">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(character.attributes || {}).map(
                      ([key, attr]: [AttributeType, StatBlock]) => {
                        const colorClass =
                          key === "fortitude"
                            ? "text-green-600"
                            : key === "finesse"
                              ? "text-blue-600"
                              : key === "force"
                                ? "text-red-600"
                                : "text-gray-700"
                        return (
                          <tr key={key} className="border-b border-gray-200">
                            <td className={`py-2 px-3 font-medium capitalize ${colorClass}`}>
                              {key}
                            </td>
                            <td className="py-2 px-3">
                              <Input
                                type="number"
                                value={attr.base}
                                onChange={e => {
                                  const value = Math.max(
                                    1,
                                    Math.min(5, Number.parseInt(e.target.value) || 1)
                                  )
                                  updateCharacter({
                                    attributes: {
                                      ...character.attributes,
                                      [key]: { ...attr, base: value },
                                    },
                                  })
                                }}
                                className="w-16 text-center"
                                min={1}
                                max={5}
                              />
                            </td>
                            <td className="py-2 px-3">
                              <Input
                                type="number"
                                value={attr.added}
                                onChange={e => {
                                  const maxAdded = Math.max(0, 5 - attr.base)
                                  const value = Math.min(
                                    maxAdded,
                                    Math.max(0, Number.parseInt(e.target.value) || 0)
                                  )
                                  updateCharacter({
                                    attributes: {
                                      ...character.attributes,
                                      [key]: { ...attr, added: value },
                                    },
                                  })
                                }}
                                className="w-16 text-center"
                                min={0}
                                max={Math.max(0, 5 - attr.base)}
                              />
                            </td>
                            <td className="py-2 px-3">
                              <Input
                                type="number"
                                value={attr.bonus}
                                onChange={e => {
                                  const value = Math.max(0, Number.parseInt(e.target.value) || 0)
                                  updateCharacter({
                                    attributes: {
                                      ...character.attributes,
                                      [key]: { ...attr, bonus: value },
                                    },
                                  })
                                }}
                                className="w-16 text-center"
                                min={0}
                              />
                            </td>
                            <td className={`py-2 px-3 font-bold text-center ${colorClass}`}>
                              {calculateStatTotal(attr)}
                            </td>
                          </tr>
                        )
                      }
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-2 text-xs text-gray-400 italic">Base + Added cannot exceed 5</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Abilities</CardTitle>
              <CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  <Label className="text-sm">Add Attribute to All:</Label>
                  <div className="flex gap-1">
                    <Button
                      variant={globalAbilityAttribute === "none" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setGlobalAbilityAttribute("none")}
                    >
                      None
                    </Button>
                    <Button
                      variant={globalAbilityAttribute === "fortitude" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setGlobalAbilityAttribute("fortitude")}
                      className={
                        globalAbilityAttribute === "fortitude"
                          ? "bg-green-600 hover:bg-green-700"
                          : "text-green-600 border-green-600 hover:bg-green-50"
                      }
                    >
                      Fortitude
                    </Button>
                    <Button
                      variant={globalAbilityAttribute === "finesse" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setGlobalAbilityAttribute("finesse")}
                      className={
                        globalAbilityAttribute === "finesse"
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "text-blue-600 border-blue-600 hover:bg-blue-50"
                      }
                    >
                      Finesse
                    </Button>
                    <Button
                      variant={globalAbilityAttribute === "force" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setGlobalAbilityAttribute("force")}
                      className={
                        globalAbilityAttribute === "force"
                          ? "bg-red-600 hover:bg-red-700"
                          : "text-red-600 border-red-600 hover:bg-red-50"
                      }
                    >
                      Force
                    </Button>
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead className="sticky top-0 bg-gray-100">
                    <tr>
                      <th className="py-2 px-3 text-left text-sm">Ability</th>
                      <th className="py-2 px-3 text-center text-sm">Base</th>
                      <th className="py-2 px-3 text-center text-sm">Added</th>
                      <th className="py-2 px-3 text-center text-sm">Bonus</th>
                      <th className="py-2 px-3 text-center text-sm">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(character.abilities || {}).map(
                      ([key, ability]: [AbilityType, StatBlock]) => (
                        <tr key={key} className="border-b border-gray-200">
                          <td className="py-2 px-3 font-medium text-gray-700 text-sm capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </td>
                          <td className="py-2 px-3">
                            <Input
                              type="number"
                              value={ability.base}
                              onChange={e => {
                                const value = Math.max(
                                  0,
                                  Math.min(5, Number.parseInt(e.target.value) || 0)
                                )
                                updateCharacter({
                                  abilities: {
                                    ...character.abilities,
                                    [key]: { ...ability, base: value },
                                  },
                                })
                              }}
                              className="w-16 text-center text-sm"
                              min={0}
                              max={5}
                            />
                          </td>
                          <td className="py-2 px-3">
                            <Input
                              type="number"
                              value={ability.added}
                              onChange={e => {
                                const maxAdded = Math.max(0, 5 - ability.base)
                                const value = Math.min(
                                  maxAdded,
                                  Math.max(0, Number.parseInt(e.target.value) || 0)
                                )
                                updateCharacter({
                                  abilities: {
                                    ...character.abilities,
                                    [key]: { ...ability, added: value },
                                  },
                                })
                              }}
                              className="w-16 text-center text-sm"
                              min={0}
                              max={Math.max(0, 5 - ability.base)}
                            />
                          </td>
                          <td className="py-2 px-3">
                            <Input
                              type="number"
                              value={ability.bonus}
                              onChange={e => {
                                const value = Math.max(0, Number.parseInt(e.target.value) || 0)
                                updateCharacter({
                                  abilities: {
                                    ...character.abilities,
                                    [key]: { ...ability, bonus: value },
                                  },
                                })
                              }}
                              className="w-16 text-center text-sm"
                              min={0}
                            />
                          </td>
                          <td
                            className={`py-2 px-3 font-bold text-center text-sm ${
                              globalAbilityAttribute === "fortitude"
                                ? "text-green-600"
                                : globalAbilityAttribute === "finesse"
                                  ? "text-blue-600"
                                  : globalAbilityAttribute === "force"
                                    ? "text-red-600"
                                    : "text-gray-700"
                            }`}
                          >
                            {calculateAbilityTotal(key)}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-2 text-xs text-gray-400 italic">Base + Added cannot exceed 5</div>
            </CardContent>
          </Card>
        </div>

        {/* Roll Assembler */}
        <Card>
          <CardHeader>
            <CardTitle>Roll Assembler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Pool Assembly */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Pool Assembly</h3>
                <div className="space-y-3">
                  <div>
                    <Label className="block text-sm font-medium text-gray-600 mb-1">
                      Attribute
                    </Label>
                    <div className="flex gap-2">
                      <Button
                        variant={
                          character?.dicePool?.attribute === "fortitude" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          updateCharacter({
                            dicePool: { ...character.dicePool, attribute: "fortitude" },
                          })
                        }
                        className={
                          character?.dicePool?.attribute === "fortitude"
                            ? "bg-green-600 hover:bg-green-700"
                            : "text-green-600 border-green-600 hover:bg-green-50"
                        }
                      >
                        <div>Fortitude</div>
                        <div className="text-xs opacity-75">
                          (
                          {calculateStatTotal(
                            character?.attributes?.fortitude || { base: 0, added: 0, bonus: 0 }
                          )}
                          )
                        </div>
                      </Button>
                      <Button
                        variant={
                          character?.dicePool?.attribute === "finesse" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          updateCharacter({
                            dicePool: { ...character.dicePool, attribute: "finesse" },
                          })
                        }
                        className={
                          character?.dicePool?.attribute === "finesse"
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "text-blue-600 border-blue-600 hover:bg-blue-50"
                        }
                      >
                        <div>Finesse</div>
                        <div className="text-xs opacity-75">
                          (
                          {calculateStatTotal(
                            character?.attributes?.finesse || { base: 0, added: 0, bonus: 0 }
                          )}
                          )
                        </div>
                      </Button>
                      <Button
                        variant={character?.dicePool?.attribute === "force" ? "default" : "outline"}
                        size="sm"
                        onClick={() =>
                          updateCharacter({
                            dicePool: { ...character.dicePool, attribute: "force" },
                          })
                        }
                        className={
                          character?.dicePool?.attribute === "force"
                            ? "bg-red-600 hover:bg-red-700"
                            : "text-red-600 border-red-600 hover:bg-red-50"
                        }
                      >
                        <div>Force</div>
                        <div className="text-xs opacity-75">
                          (
                          {calculateStatTotal(
                            character?.attributes?.force || { base: 0, added: 0, bonus: 0 }
                          )}
                          )
                        </div>
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="block text-sm font-medium text-gray-600 mb-1">Ability</Label>
                    <Select
                      value={character?.dicePool?.ability || "athletics"}
                      onValueChange={value =>
                        updateCharacter({
                          dicePool: {
                            ...character.dicePool,
                            ability: value as keyof typeof character.abilities,
                          },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(character?.abilities || {}).map(ability => (
                          <SelectItem key={ability} value={ability}>
                            {ability.charAt(0).toUpperCase() +
                              ability.slice(1).replace(/([A-Z])/g, " $1")}{" "}
                            (
                            {calculateStatTotal(
                              character?.abilities?.[ability] || { base: 0, added: 0, bonus: 0 }
                            )}
                            )
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="block text-sm font-medium text-gray-600 mb-1">
                        Target Number
                      </Label>
                      <Input
                        type="number"
                        value={character?.dicePool?.targetNumber || 7}
                        onChange={e =>
                          updateCharacter({
                            dicePool: {
                              ...character.dicePool,
                              targetNumber: Number.parseInt(e.target.value) || 7,
                            },
                          })
                        }
                        className="text-center"
                        min={1}
                        max={10}
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-600 mb-1">
                        Doubles Threshold
                      </Label>
                      <Input
                        type="number"
                        value={character?.dicePool?.doublesThreshold || 10}
                        onChange={e =>
                          updateCharacter({
                            dicePool: {
                              ...character.dicePool,
                              doublesThreshold: Number.parseInt(e.target.value) || 10,
                            },
                          })
                        }
                        className="text-center"
                        min={1}
                        max={10}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Extra Dice and Success */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Modifiers</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="block text-sm font-medium text-gray-600 mb-1">
                        Extra Dice (Bonus)
                      </Label>
                      <Input
                        type="number"
                        value={character?.dicePool?.extraDiceBonus || 0}
                        onChange={e =>
                          updateCharacter({
                            dicePool: {
                              ...character.dicePool,
                              extraDiceBonus: Math.min(
                                10,
                                Math.max(0, Number.parseInt(e.target.value) || 0)
                              ),
                            },
                          })
                        }
                        className="text-center"
                        min={0}
                        max={10}
                      />
                      <div className="text-xs text-gray-500 mt-1">Max: 10</div>
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-600 mb-1">
                        Extra Dice (Non-Bonus)
                      </Label>
                      <Input
                        type="number"
                        value={character?.dicePool?.extraDiceNonBonus || 0}
                        onChange={e =>
                          updateCharacter({
                            dicePool: {
                              ...character.dicePool,
                              extraDiceNonBonus: Math.max(0, Number.parseInt(e.target.value) || 0),
                            },
                          })
                        }
                        className="text-center"
                        min={0}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="block text-sm font-medium text-gray-600 mb-1">
                        Extra Success (Bonus)
                      </Label>
                      <Input
                        type="number"
                        value={character?.dicePool?.extraSuccessBonus || 0}
                        onChange={e =>
                          updateCharacter({
                            dicePool: {
                              ...character.dicePool,
                              extraSuccessBonus: Math.min(
                                5,
                                Math.max(0, Number.parseInt(e.target.value) || 0)
                              ),
                            },
                          })
                        }
                        className="text-center"
                        min={0}
                        max={5}
                      />
                      <div className="text-xs text-gray-500 mt-1">Max: 5</div>
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-600 mb-1">
                        Extra Success (Non-Bonus)
                      </Label>
                      <Input
                        type="number"
                        value={character?.dicePool?.extraSuccessNonBonus || 0}
                        onChange={e =>
                          updateCharacter({
                            dicePool: {
                              ...character.dicePool,
                              extraSuccessNonBonus: Math.max(
                                0,
                                Number.parseInt(e.target.value) || 0
                              ),
                            },
                          })
                        }
                        className="text-center"
                        min={0}
                      />
                    </div>
                  </div>

                  {/* Stunt Checkbox */}
                  <div className="mt-4 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="stunt-checkbox"
                      checked={character?.dicePool?.isStunted || false}
                      onChange={e =>
                        updateCharacter({
                          dicePool: {
                            ...character.dicePool,
                            isStunted: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <Label htmlFor="stunt-checkbox" className="text-sm font-medium text-gray-700">
                      Stunt (+2 dice, non-capped)
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Dice Pool Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                <div>
                  <div className="text-blue-600 font-medium">Base Pool</div>
                  <div className="text-lg font-bold text-blue-800">
                    {calculateDicePool().basePool}
                  </div>
                </div>
                <div>
                  <div className="text-blue-600 font-medium">Extra Dice</div>
                  <div className="text-lg font-bold text-blue-800">
                    +{calculateDicePool().extraDice}
                  </div>
                </div>
                <div>
                  <div className="text-blue-600 font-medium">Total Dice</div>
                  <div className="text-lg font-bold text-blue-800">
                    {calculateDicePool().totalPool}
                  </div>
                </div>
                <div>
                  <div className="text-blue-600 font-medium">Extra Success</div>
                  <div className="text-lg font-bold text-blue-800">
                    +
                    {(character?.dicePool?.extraSuccessBonus || 0) +
                      (character?.dicePool?.extraSuccessNonBonus || 0)}
                  </div>
                </div>
              </div>
              <div className="text-center p-2 bg-blue-100 rounded font-medium text-blue-800">
                {calculateDicePool().actionPhrase}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
)

CoreStatsTab.displayName = "CoreStatsTab"

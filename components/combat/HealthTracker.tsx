import React from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Character, ExaltType, DramaticInjury } from "@/lib/character-types"
import type { CharacterCalculations } from "@/hooks/useCharacterCalculations"
import { DramaticInjuriesList } from "@/components/combat/DramaticInjuriesList"

interface HealthTrackerProps {
  character: Character
  updateCharacter: (updates: Partial<Character>) => void
  calculations: CharacterCalculations
  getTotalHealthLevels: () => number
  addDramaticInjury: () => void
  updateDramaticInjury: (
    id: string,
    field: keyof DramaticInjury,
    value: DramaticInjury[keyof DramaticInjury],
  ) => void
  deleteDramaticInjury: (id: string) => void
}

export const HealthTracker: React.FC<HealthTrackerProps> = ({
  character,
  updateCharacter,
  calculations,
  getTotalHealthLevels,
  addDramaticInjury,
  updateDramaticInjury,
  deleteDramaticInjury,
}) => {
  return (
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
              className="text-center"
              min={0}
            />
            <div className="mt-3 p-2 bg-gray-50 rounded">
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
                <div className="text-xs font-medium text-red-700 mb-1">
                  Incapacitation Rules:
                </div>
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
          <DramaticInjuriesList
            injuries={character.health?.dramaticInjuries || []}
            addDramaticInjury={addDramaticInjury}
            updateDramaticInjury={updateDramaticInjury}
            deleteDramaticInjury={deleteDramaticInjury}
          />
        </div>
      </CardContent>
    </Card>
  )
}

HealthTracker.displayName = "HealthTracker"

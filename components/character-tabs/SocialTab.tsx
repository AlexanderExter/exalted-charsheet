// Social Tab Component - Virtues, intimacies, and resolve management

import { useCallback } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Character, VirtueType, Intimacy } from "@/lib/character-types"

interface SocialTabProps {
  character: Character | null
  updateCharacter: (updates: Partial<Character>) => void
  calculateResolve: () => number
}

const virtueOptions: Array<NonNullable<VirtueType>> = ["valor", "compassion", "temperance", "conviction"]

export const SocialTab: React.FC<SocialTabProps> = ({ character, updateCharacter, calculateResolve }) => {
  // Virtue management functions
  const setVirtue = useCallback(
    (type: "major" | "minor", virtue: VirtueType) => {
      if (!character) return

      updateCharacter({
        social: {
          ...character.social,
          virtues: {
            ...character.social?.virtues,
            [type]: virtue,
          },
        },
      })
    },
    [character, updateCharacter],
  )

  // Intimacy management functions
  const addIntimacy = useCallback(
    (type: "tie" | "principle") => {
      if (!character) return

      const newIntimacy: Intimacy = {
        id: `intimacy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        description: "",
        type: type,
        intensity: "minor",
      }

      updateCharacter({
        social: {
          ...character.social,
          intimacies: [...(character.social?.intimacies || []), newIntimacy],
        },
      })
    },
    [character, updateCharacter],
  )

  const updateIntimacy = useCallback(
    (id: string, field: keyof Intimacy, value: any) => {
      if (!character) return

      updateCharacter({
        social: {
          ...character.social,
          intimacies: (character.social?.intimacies || []).map((intimacy) =>
            intimacy.id === id ? { ...intimacy, [field]: value } : intimacy,
          ),
        },
      })
    },
    [character, updateCharacter],
  )

  const deleteIntimacy = useCallback(
    (id: string) => {
      if (!character) return

      updateCharacter({
        social: {
          ...character.social,
          intimacies: (character.social?.intimacies || []).filter((intimacy) => intimacy.id !== id),
        },
      })
    },
    [character, updateCharacter],
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
      {/* Social Influence Reference */}
      <div className="bg-blue-50 rounded-lg p-4 text-xs text-blue-700">
        <div className="font-semibold mb-1">Social Influence Steps:</div>
        <div>Step 1: The player declares her intention for the influence.</div>
        <div>
          Step 2: Form the dice pool for the action using an appropriate Attribute + Ability and adding any
          modifiers.
        </div>
        <div>Step 3: The target determines if any Virtues or Intimacies adjust his Resolve.</div>
        <div>
          Step 4: On success, the player utilizes extra successes to determine the extent of her influence
          action on the target. The target may choose to resist the social influence.
        </div>
        <div className="mt-2 font-semibold">
          Resolve Modifiers: Minor = ±2, Major = ±3. Minimum Resolve against social action = 1.
        </div>
      </div>

      {/* Resolve Display */}
      <Card>
        <CardHeader>
          <CardTitle>Base Resolve</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{calculateResolve()}</div>
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
                onChange={(e) => {
                  const value = Math.max(-5, Math.min(5, Number.parseInt(e.target.value) || 0))
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
        </CardContent>
      </Card>

      {/* Virtues */}
      <Card>
        <CardHeader>
          <CardTitle>Virtues</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Major Virtue */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Major Virtue</h3>
            <div className="grid grid-cols-2 gap-3">
              {virtueOptions.map((virtue) => {
                const isSelected = character?.social?.virtues?.major === virtue
                const isMinor = character?.social?.virtues?.minor === virtue

                return (
                  <Button
                    key={virtue}
                    onClick={() => !isMinor && setVirtue("major", isSelected ? null : virtue)}
                    disabled={isMinor}
                    variant={isSelected ? "default" : "outline"}
                    className={
                      isSelected
                        ? "bg-purple-600 hover:bg-purple-700"
                        : isMinor
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                    }
                  >
                    {virtue.charAt(0).toUpperCase() + virtue.slice(1)}
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Minor Virtue */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Minor Virtue</h3>
            <div className="grid grid-cols-2 gap-3">
              {virtueOptions.map((virtue) => {
                const isSelected = character?.social?.virtues?.minor === virtue
                const isMajor = character?.social?.virtues?.major === virtue

                return (
                  <Button
                    key={virtue}
                    onClick={() => !isMajor && setVirtue("minor", isSelected ? null : virtue)}
                    disabled={isMajor}
                    variant={isSelected ? "default" : "outline"}
                    className={
                      isSelected
                        ? "bg-blue-600 hover:bg-blue-700"
                        : isMajor
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                    }
                  >
                    {virtue.charAt(0).toUpperCase() + virtue.slice(1)}
                  </Button>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Intimacies */}
      <Card>
        <CardHeader>
          <CardTitle>Intimacies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Ties */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-700">Ties</h3>
              <Button onClick={() => addIntimacy("tie")} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Add Tie
              </Button>
            </div>

            {(character?.social?.intimacies || []).filter((i) => i.type === "tie").length === 0 ? (
              <p className="text-gray-500 italic text-sm">No ties yet.</p>
            ) : (
              <div className="space-y-2">
                {(character?.social?.intimacies || [])
                  .filter((i) => i.type === "tie")
                  .map((intimacy) => (
                    <div key={intimacy.id} className="flex items-center gap-2">
                      <Input
                        type="text"
                        value={intimacy.description}
                        onChange={(e) => updateIntimacy(intimacy.id, "description", e.target.value)}
                        className="flex-1"
                        placeholder="Tie description..."
                      />
                      <Select
                        value={intimacy.intensity}
                        onValueChange={(value: "minor" | "major" | "defining") => 
                          updateIntimacy(intimacy.id, "intensity", value)
                        }
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minor">Minor</SelectItem>
                          <SelectItem value="major">Major</SelectItem>
                          <SelectItem value="defining">Defining</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button onClick={() => deleteIntimacy(intimacy.id)} size="sm" variant="destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Principles */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-700">Principles</h3>
              <Button onClick={() => addIntimacy("principle")} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Add Principle
              </Button>
            </div>

            {(character?.social?.intimacies || []).filter((i) => i.type === "principle").length === 0 ? (
              <p className="text-gray-500 italic text-sm">No principles yet.</p>
            ) : (
              <div className="space-y-2">
                {(character?.social?.intimacies || [])
                  .filter((i) => i.type === "principle")
                  .map((intimacy) => (
                    <div key={intimacy.id} className="flex items-center gap-2">
                      <Input
                        type="text"
                        value={intimacy.description}
                        onChange={(e) => updateIntimacy(intimacy.id, "description", e.target.value)}
                        className="flex-1"
                        placeholder="Principle description..."
                      />
                      <Select
                        value={intimacy.intensity}
                        onValueChange={(value: "minor" | "major" | "defining") => 
                          updateIntimacy(intimacy.id, "intensity", value)
                        }
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minor">Minor</SelectItem>
                          <SelectItem value="major">Major</SelectItem>
                          <SelectItem value="defining">Defining</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button onClick={() => deleteIntimacy(intimacy.id)} size="sm" variant="destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
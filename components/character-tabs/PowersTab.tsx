// Powers Tab Component - Charms and Spells management

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
import { Textarea } from "@/components/ui/textarea"
import type { Character, Charm, Spell, SpellCircle } from "@/lib/character-types"

interface PowersTabProps {
  character: Character | null
  updateCharacter: (updates: Partial<Character>) => void
}

export const PowersTab: React.FC<PowersTabProps> = React.memo(({ character, updateCharacter }) => {
  // Charm management functions
  const addCharm = useCallback(() => {
    if (!character) return

    const newCharm: Charm = {
      id: `charm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: "",
      cost: "",
      keywords: [],
      description: "",
      step: null,
      pageReference: "",
      prerequisites: [],
      dateAdded: new Date().toLocaleDateString(),
    }

    updateCharacter({
      charms: [...(character.charms || []), newCharm],
    })
  }, [character, updateCharacter])

  const updateCharm = useCallback(
    (id: string, field: keyof Charm, value: any) => {
      if (!character) return

      updateCharacter({
        charms: (character.charms || []).map(charm =>
          charm.id === id ? { ...charm, [field]: value } : charm
        ),
      })
    },
    [character, updateCharacter]
  )

  const deleteCharm = useCallback(
    (id: string) => {
      if (!character) return

      updateCharacter({
        charms: (character.charms || []).filter(charm => charm.id !== id),
      })
    },
    [character, updateCharacter]
  )

  // Spell management functions
  const addSpell = useCallback(() => {
    if (!character) return

    const newSpell: Spell = {
      id: `spell_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: "",
      circle: "terrestrial",
      cost: "",
      description: "",
      step: null,
      pageReference: "",
      dateAdded: new Date().toLocaleDateString(),
      components: [],
    }

    updateCharacter({
      spells: [...(character.spells || []), newSpell],
    })
  }, [character, updateCharacter])

  const updateSpell = useCallback(
    (id: string, field: keyof Spell, value: any) => {
      if (!character) return

      updateCharacter({
        spells: (character.spells || []).map(spell =>
          spell.id === id ? { ...spell, [field]: value } : spell
        ),
      })
    },
    [character, updateCharacter]
  )

  const deleteSpell = useCallback(
    (id: string) => {
      if (!character) return

      updateCharacter({
        spells: (character.spells || []).filter(spell => spell.id !== id),
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
      {/* Charms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Charms
            <Button onClick={addCharm} size="sm" className="bg-amber-600 hover:bg-amber-700">
              <Plus className="w-4 h-4 mr-1" />
              Add Charm
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(character.charms || []).length === 0 ? (
            <p className="text-gray-500 italic">No charms yet.</p>
          ) : (
            <div className="space-y-4">
              {(character.charms || []).map(charm => (
                <div
                  key={charm.id}
                  className="p-4 bg-white rounded border border-gray-200 space-y-3"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor={`charm-name-${charm.id}`}>Name</Label>
                      <Input
                        id={`charm-name-${charm.id}`}
                        value={charm.name}
                        onChange={e => updateCharm(charm.id, "name", e.target.value)}
                        placeholder="Charm name..."
                      />
                    </div>
                    <div>
                      <Label htmlFor={`charm-cost-${charm.id}`}>Cost</Label>
                      <Input
                        id={`charm-cost-${charm.id}`}
                        value={charm.cost}
                        onChange={e => updateCharm(charm.id, "cost", e.target.value)}
                        placeholder="e.g., 3m, 1wp"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor={`charm-step-${charm.id}`}>Combat Step</Label>
                      <Select
                        value={charm.step?.toString() || "none"}
                        onValueChange={value =>
                          updateCharm(charm.id, "step", value === "none" ? null : parseInt(value))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Step</SelectItem>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(step => (
                            <SelectItem key={step} value={step.toString()}>
                              Step {step}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor={`charm-page-${charm.id}`}>Page Reference</Label>
                      <Input
                        id={`charm-page-${charm.id}`}
                        value={charm.pageReference}
                        onChange={e => updateCharm(charm.id, "pageReference", e.target.value)}
                        placeholder="p.123"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`charm-description-${charm.id}`}>Description</Label>
                    <Textarea
                      id={`charm-description-${charm.id}`}
                      value={charm.description}
                      onChange={e => updateCharm(charm.id, "description", e.target.value)}
                      placeholder="Charm description and mechanics..."
                      rows={3}
                      className="resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">Added: {charm.dateAdded}</div>
                    <Button onClick={() => deleteCharm(charm.id)} size="sm" variant="destructive">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Spells */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Spells
            <Button onClick={addSpell} size="sm" className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-1" />
              Add Spell
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(character.spells || []).length === 0 ? (
            <p className="text-gray-500 italic">No spells yet.</p>
          ) : (
            <div className="space-y-4">
              {(character.spells || []).map(spell => (
                <div
                  key={spell.id}
                  className="p-4 bg-white rounded border border-gray-200 space-y-3"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor={`spell-name-${spell.id}`}>Name</Label>
                      <Input
                        id={`spell-name-${spell.id}`}
                        value={spell.name}
                        onChange={e => updateSpell(spell.id, "name", e.target.value)}
                        placeholder="Spell name..."
                      />
                    </div>
                    <div>
                      <Label htmlFor={`spell-circle-${spell.id}`}>Circle</Label>
                      <Select
                        value={spell.circle}
                        onValueChange={(value: SpellCircle) =>
                          updateSpell(spell.id, "circle", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="terrestrial">Terrestrial</SelectItem>
                          <SelectItem value="celestial">Celestial</SelectItem>
                          <SelectItem value="solar">Solar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor={`spell-cost-${spell.id}`}>Cost</Label>
                      <Input
                        id={`spell-cost-${spell.id}`}
                        value={spell.cost}
                        onChange={e => updateSpell(spell.id, "cost", e.target.value)}
                        placeholder="e.g., 5m, 1wp"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`spell-step-${spell.id}`}>Combat Step</Label>
                      <Select
                        value={spell.step?.toString() || "none"}
                        onValueChange={value =>
                          updateSpell(spell.id, "step", value === "none" ? null : parseInt(value))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Step</SelectItem>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(step => (
                            <SelectItem key={step} value={step.toString()}>
                              Step {step}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor={`spell-page-${spell.id}`}>Page Reference</Label>
                      <Input
                        id={`spell-page-${spell.id}`}
                        value={spell.pageReference}
                        onChange={e => updateSpell(spell.id, "pageReference", e.target.value)}
                        placeholder="p.123"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`spell-description-${spell.id}`}>Description</Label>
                    <Textarea
                      id={`spell-description-${spell.id}`}
                      value={spell.description}
                      onChange={e => updateSpell(spell.id, "description", e.target.value)}
                      placeholder="Spell description and effects..."
                      rows={3}
                      className="resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">Added: {spell.dateAdded}</div>
                    <Button onClick={() => deleteSpell(spell.id)} size="sm" variant="destructive">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
})

PowersTab.displayName = "PowersTab"

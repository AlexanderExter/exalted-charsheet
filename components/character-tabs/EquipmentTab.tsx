// Equipment Tab Component - Armor, weapons, and equipment management

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
import type {
  Character,
  ArmorPiece,
  Weapon,
  ArmorType,
  WeaponRange,
} from "@/lib/character-types"
import { v4 as uuidv4 } from "uuid"
import { CharacterTabWrapper } from "./CharacterTabWrapper"

interface EquipmentTabProps {
  character: Character | null
  updateCharacter: (updates: Partial<Character>) => void
}

export const EquipmentTab: React.FC<EquipmentTabProps> = React.memo(
  ({ character, updateCharacter }) => {
    // Armor management functions
    const addArmor = useCallback(() => {
      if (!character) return

      const newArmor: ArmorPiece = {
        id: uuidv4(),
        name: "",
        type: "light",
        soak: 0,
        hardness: 0,
        mobility: 0,
        tags: [],
        description: "",
      }

      updateCharacter({
        armor: [...(character.armor || []), newArmor],
      })
    }, [character, updateCharacter])

    const updateArmor = useCallback(
      (
        id: string,
        field: keyof ArmorPiece,
        value: ArmorPiece[keyof ArmorPiece]
      ) => {
        if (!character) return

        updateCharacter({
          armor: (character.armor || []).map(armor =>
            armor.id === id ? { ...armor, [field]: value } : armor
          ),
        })
      },
      [character, updateCharacter]
    )

    const deleteArmor = useCallback(
      (id: string) => {
        if (!character) return

        updateCharacter({
          armor: (character.armor || []).filter(armor => armor.id !== id),
        })
      },
      [character, updateCharacter]
    )

    // Weapon management functions
    const addWeapon = useCallback(() => {
      if (!character) return

      const newWeapon: Weapon = {
        id: uuidv4(),
        name: "",
        accuracy: 0,
        damage: 0,
        defence: 0,
        overwhelming: 0,
        range: "close",
        tags: [],
        description: "",
      }

      updateCharacter({
        weapons: [...(character.weapons || []), newWeapon],
      })
    }, [character, updateCharacter])

    const updateWeapon = useCallback(
      (
        id: string,
        field: keyof Weapon,
        value: Weapon[keyof Weapon]
      ) => {
        if (!character) return

        updateCharacter({
          weapons: (character.weapons || []).map(weapon =>
            weapon.id === id ? { ...weapon, [field]: value } : weapon
          ),
        })
      },
      [character, updateCharacter]
    )

    const deleteWeapon = useCallback(
      (id: string) => {
        if (!character) return

        updateCharacter({
          weapons: (character.weapons || []).filter(weapon => weapon.id !== id),
        })
      },
      [character, updateCharacter]
    )

    // Utility functions
    const parseTagsFromString = (tagString: string): string[] => {
      return tagString
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
    }

    const stringifyTags = (tags: string[]): string => {
      return tags.join(", ")
    }


      return (
        <CharacterTabWrapper character={character}>
          {character => (
            <>
              {/* Armor */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Armor
                    <Button onClick={addArmor} size="sm" className="bg-gray-600 hover:bg-gray-700">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Armor
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(character.armor || []).length === 0 ? (
                    <p className="text-gray-500 italic">No armor equipped.</p>
                  ) : (
                    <div className="space-y-4">
                      {(character.armor || []).map(armor => (
                        <div
                          key={armor.id}
                          className="p-4 bg-white rounded border border-gray-200 space-y-3"
                        >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label htmlFor={`armor-name-${armor.id}`}>Name</Label>
                        <Input
                          id={`armor-name-${armor.id}`}
                          value={armor.name}
                          onChange={e => updateArmor(armor.id, "name", e.target.value)}
                          placeholder="Armor name..."
                        />
                      </div>
                      <div>
                        <Label htmlFor={`armor-type-${armor.id}`}>Type</Label>
                        <Select
                          value={armor.type}
                          onValueChange={(value: ArmorType) => updateArmor(armor.id, "type", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="heavy">Heavy</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor={`armor-soak-${armor.id}`}>Soak</Label>
                        <Input
                          id={`armor-soak-${armor.id}`}
                          type="number"
                          value={armor.soak}
                          onChange={e =>
                            updateArmor(armor.id, "soak", Number.parseInt(e.target.value) || 0)
                          }
                          min={0}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label htmlFor={`armor-hardness-${armor.id}`}>Hardness</Label>
                        <Input
                          id={`armor-hardness-${armor.id}`}
                          type="number"
                          value={armor.hardness}
                          onChange={e =>
                            updateArmor(armor.id, "hardness", Number.parseInt(e.target.value) || 0)
                          }
                          min={0}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`armor-mobility-${armor.id}`}>Mobility</Label>
                        <Input
                          id={`armor-mobility-${armor.id}`}
                          type="number"
                          value={armor.mobility}
                          onChange={e =>
                            updateArmor(armor.id, "mobility", Number.parseInt(e.target.value) || 0)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor={`armor-tags-${armor.id}`}>Tags</Label>
                        <Input
                          id={`armor-tags-${armor.id}`}
                          value={stringifyTags(armor.tags)}
                          onChange={e =>
                            updateArmor(armor.id, "tags", parseTagsFromString(e.target.value))
                          }
                          placeholder="e.g., Concealable, Balanced"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`armor-description-${armor.id}`}>Description</Label>
                      <Textarea
                        id={`armor-description-${armor.id}`}
                        value={armor.description || ""}
                        onChange={e => updateArmor(armor.id, "description", e.target.value)}
                        placeholder="Armor description and special properties..."
                        rows={2}
                        className="resize-none"
                      />
                    </div>

                    <div className="flex items-center justify-end">
                      <Button onClick={() => deleteArmor(armor.id)} size="sm" variant="destructive">
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

        {/* Weapons */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Weapons
              <Button onClick={addWeapon} size="sm" className="bg-red-600 hover:bg-red-700">
                <Plus className="w-4 h-4 mr-1" />
                Add Weapon
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(character.weapons || []).length === 0 ? (
              <p className="text-gray-500 italic">No weapons equipped.</p>
            ) : (
              <div className="space-y-4">
                {(character.weapons || []).map(weapon => (
                  <div
                    key={weapon.id}
                    className="p-4 bg-white rounded border border-gray-200 space-y-3"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label htmlFor={`weapon-name-${weapon.id}`}>Name</Label>
                        <Input
                          id={`weapon-name-${weapon.id}`}
                          value={weapon.name}
                          onChange={e => updateWeapon(weapon.id, "name", e.target.value)}
                          placeholder="Weapon name..."
                        />
                      </div>
                      <div>
                        <Label htmlFor={`weapon-accuracy-${weapon.id}`}>Accuracy</Label>
                        <Input
                          id={`weapon-accuracy-${weapon.id}`}
                          type="number"
                          value={weapon.accuracy}
                          onChange={e =>
                            updateWeapon(
                              weapon.id,
                              "accuracy",
                              Number.parseInt(e.target.value) || 0
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor={`weapon-damage-${weapon.id}`}>Damage</Label>
                        <Input
                          id={`weapon-damage-${weapon.id}`}
                          type="number"
                          value={weapon.damage}
                          onChange={e =>
                            updateWeapon(weapon.id, "damage", Number.parseInt(e.target.value) || 0)
                          }
                          min={0}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div>
                        <Label htmlFor={`weapon-defence-${weapon.id}`}>Defence</Label>
                        <Input
                          id={`weapon-defence-${weapon.id}`}
                          type="number"
                          value={weapon.defence}
                          onChange={e =>
                            updateWeapon(weapon.id, "defence", Number.parseInt(e.target.value) || 0)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor={`weapon-overwhelming-${weapon.id}`}>Overwhelming</Label>
                        <Input
                          id={`weapon-overwhelming-${weapon.id}`}
                          type="number"
                          value={weapon.overwhelming}
                          onChange={e =>
                            updateWeapon(
                              weapon.id,
                              "overwhelming",
                              Number.parseInt(e.target.value) || 0
                            )
                          }
                          min={0}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`weapon-range-${weapon.id}`}>Range</Label>
                        <Select
                          value={weapon.range}
                          onValueChange={(value: WeaponRange) =>
                            updateWeapon(weapon.id, "range", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="close">Close</SelectItem>
                            <SelectItem value="short">Short</SelectItem>
                            <SelectItem value="mid">Mid</SelectItem>
                            <SelectItem value="long">Long</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor={`weapon-tags-${weapon.id}`}>Tags</Label>
                        <Input
                          id={`weapon-tags-${weapon.id}`}
                          value={stringifyTags(weapon.tags)}
                          onChange={e =>
                            updateWeapon(weapon.id, "tags", parseTagsFromString(e.target.value))
                          }
                          placeholder="e.g., Lethal, Thrown"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`weapon-description-${weapon.id}`}>Description</Label>
                      <Textarea
                        id={`weapon-description-${weapon.id}`}
                        value={weapon.description || ""}
                        onChange={e => updateWeapon(weapon.id, "description", e.target.value)}
                        placeholder="Weapon description and special properties..."
                        rows={2}
                        className="resize-none"
                      />
                    </div>

                    <div className="flex items-center justify-end">
                      <Button
                        onClick={() => deleteWeapon(weapon.id)}
                        size="sm"
                        variant="destructive"
                      >
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

        {/* Tag References */}
        <Card>
          <CardHeader>
            <CardTitle>Equipment Tag Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(() => {
                const allTags = new Set<string>()
                ;[...(character?.armor || []), ...(character?.weapons || [])].forEach(item => {
                  item.tags.forEach(tag => {
                    const trimmed = tag.trim()
                    if (trimmed) allTags.add(trimmed)
                  })
                })

                return Array.from(allTags).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {Array.from(allTags)
                      .sort()
                      .map((tag, index) => (
                        <div key={index} className="p-2 bg-gray-50 rounded border border-gray-200">
                          <span className="font-medium text-gray-700">{tag}</span>
                          <div className="text-xs text-gray-500 mt-1">
                            Used on{" "}
                            {[...(character?.armor || []), ...(character?.weapons || [])]
                              .filter(item => item.tags.includes(tag))
                              .map(item => item.name || "Unnamed")
                              .join(", ")}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No equipment tags to reference.</p>
                )
              })()}
            </div>
          </CardContent>
          </Card>
        </>
      )}
    </CharacterTabWrapper>
  )
}
)

EquipmentTab.displayName = "EquipmentTab"

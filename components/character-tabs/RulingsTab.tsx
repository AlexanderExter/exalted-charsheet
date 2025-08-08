// Rulings Tab Component - Character-specific rulings and house rules

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
import type { Character, Ruling } from "@/lib/character-types"
import { v4 as uuidv4 } from "uuid"
import { CharacterTabWrapper } from "./CharacterTabWrapper"

interface RulingsTabProps {
  character: Character | null
  updateCharacter: (updates: Partial<Character>) => void
}

export const RulingsTab: React.FC<RulingsTabProps> = React.memo(
  ({ character, updateCharacter }) => {
    // Ruling management functions
    const addRuling = useCallback(() => {
      if (!character) return

      const newRuling: Ruling = {
        id: uuidv4(),
        title: "New Ruling",
        description: "",
        category: "house-rule",
        dateCreated: new Date().toLocaleDateString(),
      }

      updateCharacter({
        rulings: [...(character.rulings || []), newRuling],
      })
    }, [character, updateCharacter])

    const updateRuling = useCallback(
      (id: string, field: keyof Ruling, value: string) => {
        if (!character) return

        updateCharacter({
          rulings: (character.rulings || []).map(ruling =>
            ruling.id === id ? { ...ruling, [field]: value } : ruling
          ),
        })
      },
      [character, updateCharacter]
    )

    const deleteRuling = useCallback(
      (id: string) => {
        if (!character) return

        updateCharacter({
          rulings: (character.rulings || []).filter(ruling => ruling.id !== id),
        })
      },
      [character, updateCharacter]
    )


      return (
        <CharacterTabWrapper character={character}>
          {character => (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Character-Specific Rulings
                    <Button onClick={addRuling} size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Ruling
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(character.rulings || []).length === 0 ? (
                    <p className="text-gray-500 italic">No rulings recorded yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {(character.rulings || []).map(ruling => (
                        <div
                          key={ruling.id}
                          className="p-4 bg-white rounded border border-gray-200 space-y-3"
                        >
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <Label htmlFor={`title-${ruling.id}`}>Title</Label>
                        <Input
                          id={`title-${ruling.id}`}
                          value={ruling.title}
                          onChange={e => updateRuling(ruling.id, "title", e.target.value)}
                          placeholder="Ruling title..."
                        />
                      </div>
                      <div className="w-32">
                        <Label htmlFor={`category-${ruling.id}`}>Category</Label>
                        <Select
                          value={ruling.category}
                          onValueChange={value => updateRuling(ruling.id, "category", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="house-rule">House Rule</SelectItem>
                            <SelectItem value="clarification">Clarification</SelectItem>
                            <SelectItem value="edge-case">Edge Case</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        onClick={() => deleteRuling(ruling.id)}
                        size="sm"
                        variant="destructive"
                        className="mt-6"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div>
                      <Label htmlFor={`description-${ruling.id}`}>Description</Label>
                      <Textarea
                        id={`description-${ruling.id}`}
                        value={ruling.description}
                        onChange={e => updateRuling(ruling.id, "description", e.target.value)}
                        className="resize-none"
                        placeholder="Enter ruling description..."
                        rows={3}
                      />
                    </div>
                    <div className="text-xs text-gray-500">Created: {ruling.dateCreated}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          </Card>
        </>
      )}
    </CharacterTabWrapper>
  )
}
)

RulingsTab.displayName = "RulingsTab"

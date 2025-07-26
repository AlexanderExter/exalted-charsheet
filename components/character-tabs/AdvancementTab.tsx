// Advancement Tab Component - Milestones and character progression management

import React, { useCallback, useState } from "react"
import { Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react"
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
import type { Character, AdvancementEntry, AdvancementStatus } from "@/lib/character-types"

interface AdvancementTabProps {
  character: Character | null
  updateCharacter: (updates: Partial<Character>) => void
}

export const AdvancementTab: React.FC<AdvancementTabProps> = React.memo(
  ({ character, updateCharacter }) => {
    const [showAdvancementLog, setShowAdvancementLog] = useState(false)

    // Advancement entry management functions
    const addAdvancementEntry = useCallback(() => {
      if (!character) return

      const newEntry: AdvancementEntry = {
        id: `advancement_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        item: "",
        status: "Planned",
        timestamp: new Date().toLocaleDateString(),
        description: "",
      }

      updateCharacter({
        advancement: [...(character.advancement || []), newEntry],
      })
    }, [character, updateCharacter])

    const updateAdvancementEntry = useCallback(
      (id: string, field: keyof AdvancementEntry, value: any) => {
        if (!character) return

        updateCharacter({
          advancement: (character.advancement || []).map(entry =>
            entry.id === id ? { ...entry, [field]: value } : entry
          ),
        })
      },
      [character, updateCharacter]
    )

    const deleteAdvancementEntry = useCallback(
      (id: string) => {
        if (!character) return

        updateCharacter({
          advancement: (character.advancement || []).filter(entry => entry.id !== id),
        })
      },
      [character, updateCharacter]
    )

    // Milestone calculation helpers
    const getSpentCount = (status: AdvancementStatus) => {
      return (character?.advancement || []).filter(entry => entry.status === status).length
    }

    const getRemainingCount = (
      milestoneType: "personal" | "exalt" | "minor" | "major",
      status: AdvancementStatus
    ) => {
      const accrued = character?.milestones?.[milestoneType] || 0
      const spent = getSpentCount(status)
      return accrued - spent
    }

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
        {/* Milestone Budget */}
        <Card>
          <CardHeader>
            <CardTitle>Milestone Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Personal Milestones */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-blue-700">Personal Milestones</Label>
                <div className="space-y-2">
                  <div>
                    <Label htmlFor="personal-accrued" className="text-xs text-gray-600">
                      Accrued
                    </Label>
                    <Input
                      id="personal-accrued"
                      type="number"
                      value={character?.milestones?.personal || 0}
                      onChange={e => {
                        const value = Number.parseInt(e.target.value) || 0
                        updateCharacter({
                          milestones: { ...character.milestones, personal: value },
                        })
                      }}
                      className={`text-center ${(character?.milestones?.personal || 0) < 0 ? "text-red-600 border-red-300" : ""}`}
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">
                      Spent:{" "}
                      <span className="font-bold text-blue-600">
                        {getSpentCount("Paid with Personal")}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Remaining:{" "}
                      <span className="font-bold">
                        {getRemainingCount("personal", "Paid with Personal")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Exalt Milestones */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-purple-700">Exalt Milestones</Label>
                <div className="space-y-2">
                  <div>
                    <Label htmlFor="exalt-accrued" className="text-xs text-gray-600">
                      Accrued
                    </Label>
                    <Input
                      id="exalt-accrued"
                      type="number"
                      value={character?.milestones?.exalt || 0}
                      onChange={e => {
                        const value = Number.parseInt(e.target.value) || 0
                        updateCharacter({
                          milestones: { ...character.milestones, exalt: value },
                        })
                      }}
                      className={`text-center ${(character?.milestones?.exalt || 0) < 0 ? "text-red-600 border-red-300" : ""}`}
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">
                      Spent:{" "}
                      <span className="font-bold text-purple-600">
                        {getSpentCount("Paid with Exalt")}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Remaining:{" "}
                      <span className="font-bold">
                        {getRemainingCount("exalt", "Paid with Exalt")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Minor Milestones */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-green-700">Minor Milestones</Label>
                <div className="space-y-2">
                  <div>
                    <Label htmlFor="minor-accrued" className="text-xs text-gray-600">
                      Accrued
                    </Label>
                    <Input
                      id="minor-accrued"
                      type="number"
                      value={character?.milestones?.minor || 0}
                      onChange={e => {
                        const value = Number.parseInt(e.target.value) || 0
                        updateCharacter({
                          milestones: { ...character.milestones, minor: value },
                        })
                      }}
                      className={`text-center ${(character?.milestones?.minor || 0) < 0 ? "text-red-600 border-red-300" : ""}`}
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">
                      Spent:{" "}
                      <span className="font-bold text-green-600">
                        {getSpentCount("Paid with Minor")}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Remaining:{" "}
                      <span className="font-bold">
                        {getRemainingCount("minor", "Paid with Minor")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Major Milestones */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-red-700">Major Milestones</Label>
                <div className="space-y-2">
                  <div>
                    <Label htmlFor="major-accrued" className="text-xs text-gray-600">
                      Accrued
                    </Label>
                    <Input
                      id="major-accrued"
                      type="number"
                      value={character?.milestones?.major || 0}
                      onChange={e => {
                        const value = Number.parseInt(e.target.value) || 0
                        updateCharacter({
                          milestones: { ...character.milestones, major: value },
                        })
                      }}
                      className={`text-center ${(character?.milestones?.major || 0) < 0 ? "text-red-600 border-red-300" : ""}`}
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">
                      Spent:{" "}
                      <span className="font-bold text-red-600">
                        {getSpentCount("Paid with Major")}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Remaining:{" "}
                      <span className="font-bold">
                        {getRemainingCount("major", "Paid with Major")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Planned Advancements:</span>
                <span className="font-bold text-lg">{getSpentCount("Planned")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advancement Log */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <button
                onClick={() => setShowAdvancementLog(!showAdvancementLog)}
                className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-gray-900"
              >
                {showAdvancementLog ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
                Advancement Log ({(character?.advancement || []).length} entries)
              </button>
              <Button
                onClick={addAdvancementEntry}
                size="sm"
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Entry
              </Button>
            </CardTitle>
          </CardHeader>
          {showAdvancementLog && (
            <CardContent>
              {(character?.advancement || []).length === 0 ? (
                <p className="text-gray-500 italic">No advancement entries yet.</p>
              ) : (
                <div className="space-y-4">
                  {(character?.advancement || []).map(entry => (
                    <div
                      key={entry.id}
                      className="p-4 bg-white rounded border border-gray-200 space-y-3"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor={`entry-item-${entry.id}`}>Advancement Item</Label>
                          <Input
                            id={`entry-item-${entry.id}`}
                            value={entry.item}
                            onChange={e => updateAdvancementEntry(entry.id, "item", e.target.value)}
                            placeholder="e.g., Increase Awareness to 3, Learn Flying Blade Technique"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`entry-status-${entry.id}`}>Status</Label>
                          <Select
                            value={entry.status}
                            onValueChange={(value: AdvancementStatus) =>
                              updateAdvancementEntry(entry.id, "status", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Planned">Planned</SelectItem>
                              <SelectItem value="Paid with Personal">Paid with Personal</SelectItem>
                              <SelectItem value="Paid with Exalt">Paid with Exalt</SelectItem>
                              <SelectItem value="Paid with Minor">Paid with Minor</SelectItem>
                              <SelectItem value="Paid with Major">Paid with Major</SelectItem>
                              <SelectItem value="Initial">Initial</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {entry.description !== undefined && (
                        <div>
                          <Label htmlFor={`entry-description-${entry.id}`}>Description</Label>
                          <Textarea
                            id={`entry-description-${entry.id}`}
                            value={entry.description || ""}
                            onChange={e =>
                              updateAdvancementEntry(entry.id, "description", e.target.value)
                            }
                            placeholder="Additional notes about this advancement..."
                            rows={2}
                            className="resize-none"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">Added: {entry.timestamp}</div>
                        <Button
                          onClick={() => deleteAdvancementEntry(entry.id)}
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
          )}
        </Card>
      </div>
    )
  }
)

AdvancementTab.displayName = "AdvancementTab"

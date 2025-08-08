import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { EssenceEditor } from "@/components/EssenceEditor"
import { getAnimaLevel, getActiveAnimaRulings } from "@/lib/exalted-utils/anima"
import type { Character } from "@/lib/character-types"

interface EssencePanelProps {
  character: Character
  updateCharacter: (updates: Partial<Character>) => void
}

export const EssencePanel: React.FC<EssencePanelProps> = ({
  character,
  updateCharacter,
}) => {
  return (
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
  )
}

EssencePanel.displayName = "EssencePanel"


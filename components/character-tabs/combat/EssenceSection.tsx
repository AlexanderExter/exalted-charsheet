import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import type { Character } from "@/lib/character-types"
import { getAnimaLevel, getActiveAnimaRulings } from "@/lib/exalted-utils"

interface EssenceSectionProps {
  character: Character
  updateCharacter: (updates: Partial<Character>) => void
}

export const EssenceSection: React.FC<EssenceSectionProps> = ({ character, updateCharacter }) => {
  return (
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
                  updateCharacter({ essence: { ...character.essence, rating: value } })
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
                  updateCharacter({ essence: { ...character.essence, motes: value } })
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
                  updateCharacter({ essence: { ...character.essence, commitments: value } })
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
                  updateCharacter({ essence: { ...character.essence, spent: value } })
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
            <div className="space-y-3">
              <Label className="text-sm font-medium">Anima Level</Label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={character.essence?.anima || 0}
                  onChange={e => {
                    const value = Number.parseInt(e.target.value)
                    updateCharacter({ essence: { ...character.essence, anima: value } })
                  }}
                  className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>0</span>
                  <span>10</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-purple-600">Anima Level</span>
                <Badge variant="outline" className="text-purple-600">
                  {getAnimaLevel(character?.essence?.anima || 0)}
                </Badge>
              </div>
              {getActiveAnimaRulings(character?.essence?.anima || 0).length > 0 && (
                <div className="bg-purple-50 p-3 rounded-lg">
                  {getActiveAnimaRulings(character?.essence?.anima || 0).map((ruling, index) => (
                    <div key={index} className="text-sm text-purple-600">
                      • {ruling}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

EssenceSection.displayName = "EssenceSection"

export default EssenceSection

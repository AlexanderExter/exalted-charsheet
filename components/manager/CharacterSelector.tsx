"use client"

import { Plus, Upload, Download, User, Search, Trash2, RefreshCw, Save } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Character } from "@/lib/character-types"

interface CharacterSelectorProps {
  characters: Character[]
  filteredCharacters: Character[]
  newCharacterName: string
  setNewCharacterName: (value: string) => void
  handleCreateCharacter: () => void
  searchTerm: string
  setSearchTerm: (value: string) => void
  setCurrentCharacter: (id: string) => void
  setShowCharacterSelect: (show: boolean) => void
  exportCharacter: (character: Character) => void
  onImportClick: () => void
  deleteCharacter: (id: string) => void
  isSaving: boolean
  lastSaved: Date | null
}

const CharacterSelector = ({
  characters,
  filteredCharacters,
  newCharacterName,
  setNewCharacterName,
  handleCreateCharacter,
  searchTerm,
  setSearchTerm,
  setCurrentCharacter,
  setShowCharacterSelect,
  exportCharacter,
  onImportClick,
  deleteCharacter,
  isSaving,
  lastSaved,
}: CharacterSelectorProps) => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Exalted: Essence Character Manager</CardTitle>
          <CardDescription className="text-center">
            Create and manage your Exalted characters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 cursor-help">
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : lastSaved ? (
                    <>
                      <Save className="w-4 h-4" /> Last saved: {lastSaved.toLocaleTimeString()}
                    </>
                  ) : null}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Characters are automatically saved to your browser&apos;s local storage every 10 minutes</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={onImportClick}>
              <Upload className="w-4 h-4 mr-2" />
              Import Character(s)
            </Button>
            {characters.length > 0 && (
              <Button
                variant="outline"
                onClick={() => {
                  const dataStr = JSON.stringify(characters, null, 2)
                  const dataBlob = new Blob([dataStr], { type: "application/json" })
                  const url = window.URL.createObjectURL(dataBlob)
                  const link = document.createElement("a")
                  link.href = url
                  link.download = "all_exalted_characters.json"
                  link.click()
                  window.URL.revokeObjectURL(url)
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Export All
              </Button>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Create New Character</h3>
            <div className="flex gap-3">
              <Input
                value={newCharacterName}
                onChange={e => setNewCharacterName(e.target.value)}
                placeholder="Character name..."
                onKeyPress={e => e.key === "Enter" && handleCreateCharacter()}
              />
              <Button onClick={handleCreateCharacter} disabled={!newCharacterName.trim()}>
                <Plus className="w-4 h-4 mr-2" />
                Create
              </Button>
            </div>
          </div>

          {characters.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Select Character</h3>
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  <Input
                    placeholder="Search characters..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-48"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                {filteredCharacters.map(character => (
                  <div
                    key={character.id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group"
                    onClick={() => {
                      setCurrentCharacter(character.id)
                      setShowCharacterSelect(false)
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-medium">{character.name}</div>
                        <div className="text-sm text-gray-600">
                          Essence {character.essence?.rating || 1}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={e => {
                          e.stopPropagation()
                          exportCharacter(character)
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={e => {
                          e.stopPropagation()
                          if (
                            window.confirm(`Are you sure you want to delete "${character.name}"? This action cannot be undone.`)
                          ) {
                            deleteCharacter(character.id)
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default CharacterSelector

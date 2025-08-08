"use client"

import type React from "react"
import { useState, useRef, useCallback, useMemo } from "react"
import {
  Plus,
  Trash2,
  User,
  Download,
  Upload,
  Search,
  Shield,
  Swords,
  BookOpen,
  TrendingUp,
  Users,
  Scroll,
  Save,
  RefreshCw,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useCharacterCalculations } from "@/hooks/useCharacterCalculations"
import { useAutoSave } from "@/hooks/useAutoSave"
import { useCharacterStore } from "@/hooks/useCharacterStore"
import type { Character, AttributeType, AbilityType, ArmorPiece } from "@/lib/character-types"
import { createNewCharacter } from "@/lib/character-defaults"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"
import {
  getAnimaLevel,
  getActiveAnimaRulings,
  calculateStatTotal,
  clampModifier,
} from "@/lib/exalted-utils"
import { RulingsTab } from "@/components/character-tabs/rulings/RulingsTab"
import { PowersTab } from "@/components/character-tabs/powers/PowersTab"
import { SocialTab } from "@/components/character-tabs/social/SocialTab"
import { EquipmentTab } from "@/components/character-tabs/equipment/EquipmentTab"
import { AdvancementTab } from "@/components/character-tabs/advancement/AdvancementTab"
import { CombatTab } from "@/components/character-tabs/combat/CombatTab"
import { CoreStatsTab } from "@/components/character-tabs/core-stats/CoreStatsTab"

// Anima system functions - now imported from utils

// Main component
const ExaltedCharacterManager = () => {
  const {
    characters,
    currentCharacter,
    addCharacter,
    updateCurrentCharacter,
    deleteCharacter,
    setCurrentCharacter,
    loadCharacters,
  } = useCharacterStore()
  const [showCharacterSelect, setShowCharacterSelect] = useState(true)
  const [newCharacterName, setNewCharacterName] = useState("")
  const [activeTab, setActiveTab] = useState("core")
  const [searchTerm, setSearchTerm] = useState("")
  const [globalAbilityAttribute, setGlobalAbilityAttribute] = useState<AttributeType | "none">(
    "none"
  )

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-save functionality
  const { isSaving, lastSaved } = useAutoSave(characters, "exalted-characters")

  // Character calculations hook
  const calculations = useCharacterCalculations(currentCharacter)

  // Load markdown content

  // Character management
  const handleCreateCharacter = useCallback(() => {
    if (!newCharacterName.trim()) return

    addCharacter(newCharacterName.trim())
    setNewCharacterName("")
    setShowCharacterSelect(false)
  }, [newCharacterName, addCharacter])

  const updateCharacter = useCallback(
    (updates: Partial<Character>) => {
      updateCurrentCharacter(updates)
    },
    [updateCurrentCharacter]
  )

  // Calculation functions
  // Using calculateStatTotal from utils instead of inline function

  const getHighestAttribute = useCallback(() => {
    if (!currentCharacter?.attributes) return 0
    return calculations.highestAttribute
  }, [currentCharacter?.attributes, calculations.highestAttribute])

  const calculateEvasion = useCallback(() => {
    return calculations.evasion
  }, [calculations.evasion])

  const calculateParry = useCallback(() => {
    return calculations.parry
  }, [calculations.parry])

  const calculateDefense = useCallback(() => {
    return calculations.defense
  }, [calculations.defense])

  const calculateResolve = useCallback(() => {
    return calculations.resolve
  }, [calculations.resolve])

  const calculateSoak = useCallback(() => {
    if (!currentCharacter?.abilities?.physique) return 1
    const physique = calculateStatTotal(currentCharacter.abilities.physique)
    let base = 1
    if (physique >= 3) base += 1
    const armorSoak = (currentCharacter?.armor || []).reduce(
      (total: number, armor: ArmorPiece) => total + (Number.parseInt(String(armor.soak)) || 0),
      0
    )
    const modifier = currentCharacter?.staticValues?.soakModifier || 0
    return Math.max(0, base + armorSoak + Math.max(-5, Math.min(5, modifier)))
  }, [currentCharacter])

  const calculateHardness = useCallback(() => {
    const essence = currentCharacter?.essence?.rating || 1
    const base = essence + 2
    const armorHardness = (currentCharacter?.armor || []).reduce(
      (total: number, armor: ArmorPiece) => total + (Number.parseInt(String(armor.hardness)) || 0),
      0
    )
    const modifier = currentCharacter?.staticValues?.hardnessModifier || 0
    return Math.max(0, base + armorHardness + Math.max(-5, Math.min(5, modifier)))
  }, [currentCharacter])

  const calculateAbilityTotal = useCallback(
    (abilityKey: AbilityType) => {
      const ability = currentCharacter?.abilities?.[abilityKey]
      if (!ability) return 0

      const abilityTotal = calculateStatTotal(ability)

      if (!globalAbilityAttribute || globalAbilityAttribute === "none") return abilityTotal

      const attribute = currentCharacter?.attributes?.[globalAbilityAttribute]
      if (!attribute) return abilityTotal

      return abilityTotal + calculateStatTotal(attribute)
    },
    [currentCharacter, globalAbilityAttribute]
  )

  const calculateDicePool = useCallback(() => {
    if (
      !currentCharacter?.dicePool ||
      !currentCharacter?.attributes ||
      !currentCharacter?.abilities
    ) {
      return {
        basePool: 0,
        extraDice: 0,
        totalPool: 0,
        cappedBonusDice: 0,
        actionPhrase: "Roll 0, TN 7 Double 10s",
      }
    }

    const {
      attribute,
      ability,
      targetNumber,
      doublesThreshold,
      extraSuccessBonus,
      extraSuccessNonBonus,
    } = currentCharacter.dicePool
    const attributeTotal = calculateStatTotal(
      currentCharacter.attributes[attribute] || { base: 0, added: 0, bonus: 0 }
    )
    const abilityTotal = calculateStatTotal(
      currentCharacter.abilities[ability] || { base: 0, added: 0, bonus: 0 }
    )
    const basePool = attributeTotal + abilityTotal

    const { extraDiceBonus, extraDiceNonBonus, isStunted } = currentCharacter.dicePool
    const cappedBonusDice = Math.min(extraDiceBonus || 0, 10)
    const stuntDice = isStunted ? 2 : 0
    const totalExtraDice = cappedBonusDice + (extraDiceNonBonus || 0) + stuntDice
    const totalPool = basePool + totalExtraDice

    const totalExtraSuccess = (extraSuccessBonus || 0) + (extraSuccessNonBonus || 0)

    // Generate action phrase
    let actionPhrase = `Roll ${totalPool}`
    if (totalExtraSuccess > 0) {
      const successText = totalExtraSuccess === 1 ? "success" : "successes"
      actionPhrase += `, ${totalExtraSuccess} ${successText}`
    }
    actionPhrase += `, TN ${targetNumber}`
    if (doublesThreshold < 10) {
      actionPhrase += ` Double ${doublesThreshold}s`
    } else {
      actionPhrase += ` Double 10s`
    }

    return {
      basePool,
      extraDice: totalExtraDice,
      totalPool,
      cappedBonusDice,
      actionPhrase,
    }
  }, [currentCharacter])

  // Equipment management - moved to EquipmentTab component

  // Powers management - moved to PowersTab component

  // Social management - moved to SocialTab component

  // Advancement management - moved to AdvancementTab component

  // Rulings management - moved to RulingsTab component

  // Import/Export functions
  const exportCharacter = (character: Character) => {
    try {
      const dataStr = JSON.stringify(character, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })

      const link = document.createElement("a")
      const url = window.URL.createObjectURL(dataBlob)
      link.href = url
      link.download = `${character.name.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_exalted_character.json`
      link.style.display = "none"
      document.body.appendChild(link)
      link.click()

      setTimeout(() => {
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }, 100)
    } catch (error) {
      toast.error("Failed to export character. Please try again.")
    }
  }

  const importCharacter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = e => {
      try {
        const importedData = JSON.parse(e.target?.result as string)

        const isArray = Array.isArray(importedData)
        const charactersToImport = isArray ? importedData : [importedData]

        const validatedCharacters = charactersToImport.map((char: Partial<Character>) => {
          if (!char.name) {
            throw new Error("Invalid character data: missing name")
          }

          return {
            ...createNewCharacter(char.name),
            ...char,
            id: uuidv4(),
          }
        })

        // Add characters to store
        loadCharacters([...characters, ...validatedCharacters])

        if (validatedCharacters.length === 1) {
          setCurrentCharacter(validatedCharacters[0].id)
          setShowCharacterSelect(false)
        }

        event.target.value = ""

        toast.success(`Successfully imported ${validatedCharacters.length} character(s)`)
      } catch (error) {
        toast.error(
          "Failed to import character(s). Please ensure the file is a valid character export."
        )
        event.target.value = ""
      }
    }

    reader.readAsText(file)
  }

  // Filtered characters for search
  const filteredCharacters = useMemo(() => {
    return characters.filter(char => char.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [characters, searchTerm])

  if (showCharacterSelect || !currentCharacter) {
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
            {/* Auto-save indicator */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 cursor-help">
                    {isSaving ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : lastSaved ? (
                      <>
                        <Save className="w-4 h-4" />
                        Last saved: {lastSaved.toLocaleTimeString()}
                      </>
                    ) : null}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Characters are automatically saved to your browser&apos;s local storage every 10
                    minutes
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Import/Export Controls */}
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Import Character(s)
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={importCharacter}
                className="hidden"
              />
              {characters.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    const dataStr = JSON.stringify(characters, null, 2)
                    const dataBlob = new Blob([dataStr], { type: "application/json" })
                    const link = document.createElement("a")
                    const url = window.URL.createObjectURL(dataBlob)
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

            {/* Create new character */}
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

            {/* Character list */}
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
                              window.confirm(
                                `Are you sure you want to delete "${character.name}"? This action cannot be undone.`
                              )
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

  const tabs = [
    { id: "core", label: "Core Stats", icon: User },
    { id: "combat", label: "Combat", icon: Swords },
    { id: "equipment", label: "Equipment", icon: Shield },
    { id: "powers", label: "Powers", icon: BookOpen },
    { id: "socials", label: "Socials", icon: Users },
    { id: "advancement", label: "Advancement", icon: TrendingUp },
    { id: "rulings", label: "Rulings", icon: Scroll },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Exalted: Essence Character Manager</h1>
          <div className="text-sm text-gray-600">
            {!showCharacterSelect && currentCharacter && (
              <span>
                Managing: <strong>{currentCharacter.name}</strong>
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Header */}
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold">{currentCharacter.name}</h1>
              </div>

              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 text-sm text-gray-600 cursor-help">
                        {isSaving ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Saving...
                          </>
                        ) : lastSaved ? (
                          <>
                            <Save className="w-4 h-4" />
                            Saved {lastSaved.toLocaleTimeString()}
                          </>
                        ) : null}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Characters are automatically saved to your browser&apos;s local storage
                        every 10 minutes
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportCharacter(currentCharacter)}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>

                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-1" />
                  Import
                </Button>

                <Button variant="outline" size="sm" onClick={() => setShowCharacterSelect(true)}>
                  <User className="w-4 h-4 mr-1" />
                  Switch
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={importCharacter}
            className="hidden"
          />

          {/* Main tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
              {tabs.map(tab => {
                const Icon = tab.icon
                return (
                  <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-1">
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>

            <TabsContent value="core" className="space-y-6">
              <CoreStatsTab
                character={currentCharacter}
                updateCharacter={updateCharacter}
                calculateAbilityTotal={calculateAbilityTotal}
                calculateDicePool={calculateDicePool}
                globalAbilityAttribute={globalAbilityAttribute}
                setGlobalAbilityAttribute={setGlobalAbilityAttribute}
              />
            </TabsContent>

            <TabsContent value="combat" className="space-y-6">
              <CombatTab
                character={currentCharacter}
                updateCharacter={updateCharacter}
                calculations={calculations}
                calculateSoak={calculateSoak}
                calculateHardness={calculateHardness}
              />
            </TabsContent>

            <TabsContent value="equipment" className="space-y-6">
              <EquipmentTab character={currentCharacter} updateCharacter={updateCharacter} />
            </TabsContent>

            <TabsContent value="powers" className="space-y-6">
              <PowersTab character={currentCharacter} updateCharacter={updateCharacter} />
            </TabsContent>

            <TabsContent value="socials" className="space-y-6">
              <SocialTab
                character={currentCharacter}
                updateCharacter={updateCharacter}
                calculateResolve={calculateResolve}
              />
            </TabsContent>

            <TabsContent value="advancement" className="space-y-6">
              <AdvancementTab character={currentCharacter} updateCharacter={updateCharacter} />
            </TabsContent>

            <TabsContent value="rulings" className="space-y-6">
              <RulingsTab character={currentCharacter} updateCharacter={updateCharacter} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

    </div>
  )
}

export default ExaltedCharacterManager

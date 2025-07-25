"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback, useMemo } from "react"
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
  Construction,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { useCharacterCalculations } from "@/hooks/useCharacterCalculations"
import type { Character, AttributeType, AbilityType } from "@/lib/character-types"
import { createNewCharacter } from "@/lib/character-defaults"
import { 
  getAnimaLevel, 
  getActiveAnimaRulings, 
  calculateStatTotal,
  clampModifier 
} from "@/lib/exalted-utils"
import { RulingsTab } from "@/components/character-tabs/RulingsTab"
import { WIPTab } from "@/components/character-tabs/WIPTab"
import { PowersTab } from "@/components/character-tabs/PowersTab"
import { SocialTab } from "@/components/character-tabs/SocialTab"
import { EquipmentTab } from "@/components/character-tabs/EquipmentTab"
import { AdvancementTab } from "@/components/character-tabs/AdvancementTab"
import { CombatTab } from "@/components/character-tabs/CombatTab"
import { CoreStatsTab } from "@/components/character-tabs/CoreStatsTab"

// Auto-save hook - 10 minute intervals
const useAutoSave = (data: any, key: string, delay = 600000) => {
  // 10 minutes = 600000ms
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setIsSaving(true)
      localStorage.setItem(key, JSON.stringify(data))
      setIsSaving(false)
      setLastSaved(new Date())
    }, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [data, key, delay])

  return { isSaving, lastSaved }
}

// Anima system functions - now imported from utils

// Main component
const ExaltedCharacterManager = () => {
  const [characters, setCharacters] = useLocalStorage<Character[]>("exalted-characters", [])
  const [currentCharacter, setCurrentCharacter] = useState<Character | null>(null)
  const [showCharacterSelect, setShowCharacterSelect] = useState(true)
  const [newCharacterName, setNewCharacterName] = useState("")
  const [activeTab, setActiveTab] = useState("core")
  const [searchTerm, setSearchTerm] = useState("")
  const [globalAbilityAttribute, setGlobalAbilityAttribute] = useState("none")
  const [showAboutModal, setShowAboutModal] = useState(false)
  const [showLegalModal, setShowLegalModal] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-save functionality
  const { isSaving, lastSaved } = useAutoSave(characters, "exalted-characters")
  
  // Character calculations hook
  const calculations = useCharacterCalculations(currentCharacter)

  // Character creation - now using imported defaults

  // Character management
  const handleCreateCharacter = useCallback(() => {
    if (!newCharacterName.trim()) return

    const newChar = createNewCharacter(newCharacterName.trim())
    setCharacters((prev) => [...prev, newChar])
    setCurrentCharacter(newChar)
    setNewCharacterName("")
    setShowCharacterSelect(false)
  }, [newCharacterName, setCharacters])

  const updateCharacter = useCallback(
    (updates: any) => {
      if (!currentCharacter) return

      const updatedCharacter = { ...currentCharacter, ...updates }
      setCurrentCharacter(updatedCharacter)
      setCharacters((prev) => prev.map((char) => (char.id === currentCharacter.id ? updatedCharacter : char)))
    },
    [currentCharacter, setCharacters],
  )

  // Calculation functions
  // Using calculateStatTotal from utils instead of inline function

  const getHighestAttribute = useCallback(() => {
    if (!currentCharacter?.attributes) return 0
    return calculations.highestAttribute
  }, [calculations.highestAttribute])

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
      (total: number, armor: any) => total + (Number.parseInt(armor.soak) || 0),
      0,
    )
    const modifier = currentCharacter?.staticValues?.soakModifier || 0
    return Math.max(0, base + armorSoak + Math.max(-5, Math.min(5, modifier)))
  }, [currentCharacter, calculateStatTotal])

  const calculateHardness = useCallback(() => {
    const essence = currentCharacter?.essence?.rating || 1
    const base = essence + 2
    const armorHardness = (currentCharacter?.armor || []).reduce(
      (total: number, armor: any) => total + (Number.parseInt(armor.hardness) || 0),
      0,
    )
    const modifier = currentCharacter?.staticValues?.hardnessModifier || 0
    return Math.max(0, base + armorHardness + Math.max(-5, Math.min(5, modifier)))
  }, [currentCharacter])


  const calculateAbilityTotal = useCallback(
    (abilityKey: string) => {
      const ability = currentCharacter?.abilities?.[abilityKey]
      if (!ability) return 0

      const abilityTotal = calculateStatTotal(ability)

      if (!globalAbilityAttribute || globalAbilityAttribute === "none") return abilityTotal

      const attribute = currentCharacter?.attributes?.[globalAbilityAttribute]
      if (!attribute) return abilityTotal

      return abilityTotal + calculateStatTotal(attribute)
    },
    [currentCharacter, calculateStatTotal, globalAbilityAttribute],
  )

  const calculateDicePool = useCallback(() => {
    if (!currentCharacter?.dicePool || !currentCharacter?.attributes || !currentCharacter?.abilities) {
      return { basePool: 0, extraDice: 0, totalPool: 0, cappedBonusDice: 0, actionPhrase: "Roll 0, TN 7 Double 10s" }
    }

    const { attribute, ability, targetNumber, doublesThreshold, extraSuccessBonus, extraSuccessNonBonus } =
      currentCharacter.dicePool
    const attributeTotal = calculateStatTotal(currentCharacter.attributes[attribute] || { base: 0, added: 0, bonus: 0 })
    const abilityTotal = calculateStatTotal(currentCharacter.abilities[ability] || { base: 0, added: 0, bonus: 0 })
    const basePool = attributeTotal + abilityTotal

    const { extraDiceBonus, extraDiceNonBonus } = currentCharacter.dicePool
    const cappedBonusDice = Math.min(extraDiceBonus || 0, 10)
    const totalExtraDice = cappedBonusDice + (extraDiceNonBonus || 0)
    const totalPool = basePool + totalExtraDice

    const totalExtraSuccess = (extraSuccessBonus || 0) + (extraSuccessNonBonus || 0)

    // Generate action phrase
    let actionPhrase = `Roll ${totalPool}`
    if (totalExtraSuccess > 0) {
      actionPhrase += `, ${totalExtraSuccess} success in`
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
  }, [currentCharacter, calculateStatTotal])

  // Equipment management - moved to EquipmentTab component

  // Powers management - moved to PowersTab component

  // Social management - moved to SocialTab component



  // Advancement management - moved to AdvancementTab component

  // Rulings management - moved to RulingsTab component

  // Import/Export functions
  const exportCharacter = (character: any) => {
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
      console.error("Export error:", error)
      alert("Failed to export character. Please try again.")
    }
  }

  const importCharacter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string)

        const isArray = Array.isArray(importedData)
        const charactersToImport = isArray ? importedData : [importedData]

        const validatedCharacters = charactersToImport.map((char: any) => {
          if (!char.name) {
            throw new Error("Invalid character data: missing name")
          }

          const newId = Date.now() + Math.random()

          return {
            ...createNewCharacter(char.name),
            ...char,
            id: newId,
          }
        })

        setCharacters((prev) => [...prev, ...validatedCharacters])

        if (validatedCharacters.length === 1) {
          setCurrentCharacter(validatedCharacters[0])
          setShowCharacterSelect(false)
        }

        event.target.value = ""

        alert(`Successfully imported ${validatedCharacters.length} character(s)`)
      } catch (error) {
        console.error("Import error:", error)
        alert("Failed to import character(s). Please ensure the file is a valid character export.")
        event.target.value = ""
      }
    }

    reader.readAsText(file)
  }

  // Filtered characters for search
  const filteredCharacters = useMemo(() => {
    return characters.filter((char) => char.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [characters, searchTerm])

  if (showCharacterSelect || !currentCharacter) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Exalted: Essence Character Manager</CardTitle>
            <CardDescription className="text-center">Create and manage your Exalted characters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Auto-save indicator */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
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

            {/* Import/Export Controls */}
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Import Character(s)
              </Button>
              <input ref={fileInputRef} type="file" accept=".json" onChange={importCharacter} className="hidden" />
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
                  onChange={(e) => setNewCharacterName(e.target.value)}
                  placeholder="Character name..."
                  onKeyPress={(e) => e.key === "Enter" && handleCreateCharacter()}
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
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-48"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  {filteredCharacters.map((character) => (
                    <div
                      key={character.id}
                      className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group"
                      onClick={() => {
                        setCurrentCharacter(character)
                        setShowCharacterSelect(false)
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-gray-600" />
                        <div>
                          <div className="font-medium">{character.name}</div>
                          <div className="text-sm text-gray-600">Essence {character.essence?.rating || 1}</div>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            exportCharacter(character)
                          }}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setCharacters((prev) => prev.filter((char) => char.id !== character.id))
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
    { id: "wip", label: "WIP", icon: Construction },
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
                <div className="flex items-center gap-2 text-sm text-gray-600">
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

                <Button variant="outline" size="sm" onClick={() => exportCharacter(currentCharacter)}>
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
          <input ref={fileInputRef} type="file" accept=".json" onChange={importCharacter} className="hidden" />

          {/* Main tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
              {tabs.map((tab) => {
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
              <SocialTab character={currentCharacter} updateCharacter={updateCharacter} calculateResolve={calculateResolve} />
            </TabsContent>

            <TabsContent value="advancement" className="space-y-6">
              <AdvancementTab character={currentCharacter} updateCharacter={updateCharacter} />
            </TabsContent>

            <TabsContent value="rulings" className="space-y-6">
              <RulingsTab character={currentCharacter} updateCharacter={updateCharacter} />
            </TabsContent>

            <TabsContent value="wip" className="space-y-6">
              <WIPTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-gray-600">
          <div>© 2024 Exalted Character Manager</div>
          <div className="flex gap-4">
            <button onClick={() => setShowAboutModal(true)} className="hover:text-gray-800 underline">
              About
            </button>
            <button onClick={() => setShowLegalModal(true)} className="hover:text-gray-800 underline">
              Legal
            </button>
          </div>
        </div>
      </footer>

      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl max-h-96 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">About</h2>
            <div className="prose text-sm text-gray-600">
              <p>Placeholder for markdown content about the application.</p>
            </div>
            <Button onClick={() => setShowAboutModal(false)} className="mt-4">
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Legal Modal */}
      {showLegalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl max-h-96 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Legal</h2>
            <div className="prose text-sm text-gray-600">
              <p>Placeholder for legal information and disclaimers.</p>
            </div>
            <Button onClick={() => setShowLegalModal(false)} className="mt-4">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExaltedCharacterManager

"use client"

import { useState, useMemo, useCallback } from "react"
import { Download, Upload, User, RefreshCw, Save } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useCharacterStore } from "@/hooks/useCharacterStore"
import { useAutoSave } from "@/hooks/useAutoSave"
import { useCharacterCalculations } from "@/hooks/useCharacterCalculations"
import type { Character, AttributeType, AbilityType, ArmorPiece } from "@/lib/character-types"
import { calculateStatTotal } from "@/lib/exalted-utils"
import CharacterSelector from "./CharacterSelector"
import CharacterTabs from "./CharacterTabs"
import { useCharacterImportExport } from "@/hooks/useCharacterImportExport"

const CharacterManager = () => {
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
  const [searchTerm, setSearchTerm] = useState("")
  const [globalAbilityAttribute, setGlobalAbilityAttribute] = useState<AttributeType | "none">(
    "none"
  )

  const { exportCharacter, importCharacter, fileInputRef } = useCharacterImportExport({
    characters,
    loadCharacters,
    setCurrentCharacter,
    setShowCharacterSelect,
  })

  const { isSaving, lastSaved } = useAutoSave(characters, "exalted-characters")

  const calculations = useCharacterCalculations(currentCharacter)

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

  const calculateResolve = useCallback(() => {
    return calculations.resolve
  }, [calculations.resolve])

  const filteredCharacters = useMemo(() => {
    return characters.filter(char => char.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [characters, searchTerm])

  const triggerImport = () => fileInputRef.current?.click()

  return (
    <>
      {showCharacterSelect || !currentCharacter ? (
        <CharacterSelector
          characters={characters}
          filteredCharacters={filteredCharacters}
          newCharacterName={newCharacterName}
          setNewCharacterName={setNewCharacterName}
          handleCreateCharacter={handleCreateCharacter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setCurrentCharacter={setCurrentCharacter}
          setShowCharacterSelect={setShowCharacterSelect}
          exportCharacter={exportCharacter}
          onImportClick={triggerImport}
          deleteCharacter={deleteCharacter}
          isSaving={isSaving}
          lastSaved={lastSaved}
        />
      ) : (
        <div className="min-h-screen flex flex-col">
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-800">Exalted: Essence Character Manager</h1>
              <div className="text-sm text-gray-600">
                <span>
                  Managing: <strong>{currentCharacter.name}</strong>
                </span>
              </div>
            </div>
          </header>
          <main className="flex-1">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
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
                                <RefreshCw className="w-4 h-4 animate-spin" /> Saving...
                              </>
                            ) : lastSaved ? (
                              <>
                                <Save className="w-4 h-4" /> Saved {lastSaved.toLocaleTimeString()}
                              </>
                            ) : null}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Characters are automatically saved to your browser&apos;s local storage every 10 minutes</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Button variant="outline" size="sm" onClick={() => exportCharacter(currentCharacter)}>
                      <Download className="w-4 h-4 mr-1" /> Export
                    </Button>
                    <Button variant="outline" size="sm" onClick={triggerImport}>
                      <Upload className="w-4 h-4 mr-1" /> Import
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowCharacterSelect(true)}>
                      <User className="w-4 h-4 mr-1" /> Switch
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <CharacterTabs
                currentCharacter={currentCharacter}
                updateCharacter={updateCharacter}
                calculations={calculations}
                calculateAbilityTotal={calculateAbilityTotal}
                calculateDicePool={calculateDicePool}
                globalAbilityAttribute={globalAbilityAttribute}
                setGlobalAbilityAttribute={setGlobalAbilityAttribute}
                calculateSoak={calculateSoak}
                calculateHardness={calculateHardness}
                calculateResolve={calculateResolve}
              />
            </div>
          </main>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={importCharacter}
        className="hidden"
      />
    </>
  )
}

export default CharacterManager

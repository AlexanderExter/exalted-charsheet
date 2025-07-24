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

// Anima system functions
const getAnimaLevel = (anima: number) => {
  if (anima <= 4) return "Dim"
  if (anima <= 6) return "Burning"
  if (anima <= 9) return "Bonfire"
  return "Iconic"
}

const getActiveAnimaRulings = (anima: number): string[] => {
  const rulings: string[] = []
  if (anima >= 3) rulings.push("Anima Active Effect available")
  if (anima >= 5) rulings.push("Exalted nature can't be hidden")
  if (anima >= 10) rulings.push("Iconic effect available")
  return rulings
}

// Main component
const ExaltedCharacterManager = () => {
  const [characters, setCharacters] = useLocalStorage<any[]>("exalted-characters", [])
  const [currentCharacter, setCurrentCharacter] = useState<any>(null)
  const [showCharacterSelect, setShowCharacterSelect] = useState(true)
  const [newCharacterName, setNewCharacterName] = useState("")
  const [activeTab, setActiveTab] = useState("core")
  const [searchTerm, setSearchTerm] = useState("")
  const [globalAbilityAttribute, setGlobalAbilityAttribute] = useState("none")
  const [showAdvancementLog, setShowAdvancementLog] = useState(false)
  const [showAboutModal, setShowAboutModal] = useState(false)
  const [showLegalModal, setShowLegalModal] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-save functionality
  const { isSaving, lastSaved } = useAutoSave(characters, "exalted-characters")

  // Default character template
  const createNewCharacter = useCallback(
    (name: string) => ({
      id: Date.now(),
      name,
      attributes: {
        fortitude: { base: 1, added: 0, bonus: 0 },
        finesse: { base: 1, added: 0, bonus: 0 },
        force: { base: 1, added: 0, bonus: 0 },
      },
      abilities: {
        athletics: { base: 0, added: 0, bonus: 0 },
        awareness: { base: 0, added: 0, bonus: 0 },
        closeCombat: { base: 0, added: 0, bonus: 0 },
        craft: { base: 0, added: 0, bonus: 0 },
        embassy: { base: 0, added: 0, bonus: 0 },
        integrity: { base: 0, added: 0, bonus: 0 },
        navigate: { base: 0, added: 0, bonus: 0 },
        physique: { base: 0, added: 0, bonus: 0 },
        presence: { base: 0, added: 0, bonus: 0 },
        performance: { base: 0, added: 0, bonus: 0 },
        rangedCombat: { base: 0, added: 0, bonus: 0 },
        sagacity: { base: 0, added: 0, bonus: 0 },
        stealth: { base: 0, added: 0, bonus: 0 },
        war: { base: 0, added: 0, bonus: 0 },
      },
      essence: {
        motes: 5,
        commitments: 0,
        spent: 0,
        anima: 0,
        rating: 1,
      },
      staticValues: {
        defenseModifier: 0,
        evasionModifier: 0,
        parryModifier: 0,
        resolveModifier: 0,
        soakModifier: 0,
        hardnessModifier: 0,
      },
      health: {
        baseline: { zero: 2, minusOne: 2, minusTwo: 2, incap: 1 },
        oxBodyLevels: 0,
        exaltType: "lunar",
        bashingDamage: 0,
        lethalDamage: 0,
        aggravatedDamage: 0,
        dramaticInjuries: [],
      },
      armor: [],
      weapons: [],
      milestones: {
        personal: 0,
        exalt: 0,
        minor: 0,
        major: 0,
      },
      advancement: [],
      dicePool: {
        attribute: "fortitude",
        ability: "athletics",
        targetNumber: 7,
        doublesThreshold: 10,
        extraDiceBonus: 0,
        extraDiceNonBonus: 0,
        extraSuccessBonus: 0,
        extraSuccessNonBonus: 0,
      },
      charms: [],
      spells: [],
      combat: {
        power: 0,
        joinBattleBonus: 0,
        joinBattleDiceBonus: 0,
        joinBattleSuccessBonus: 0,
        decisiveExtraDice: 0,
        decisiveExtraSuccess: 0,
      },
      social: {
        virtues: {
          major: null,
          minor: null,
        },
        intimacies: [],
      },
      rulings: [],
    }),
    [],
  )

  // Character management
  const handleCreateCharacter = useCallback(() => {
    if (!newCharacterName.trim()) return

    const newChar = createNewCharacter(newCharacterName.trim())
    setCharacters((prev) => [...prev, newChar])
    setCurrentCharacter(newChar)
    setNewCharacterName("")
    setShowCharacterSelect(false)
  }, [newCharacterName, createNewCharacter, setCharacters])

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
  const calculateTotal = useCallback((stat: any) => {
    return (stat?.base || 0) + (stat?.added || 0) + (stat?.bonus || 0)
  }, [])

  const getHighestAttribute = useCallback(() => {
    if (!currentCharacter?.attributes) return 0
    const { fortitude, finesse, force } = currentCharacter.attributes
    return Math.max(calculateTotal(fortitude), calculateTotal(finesse), calculateTotal(force))
  }, [currentCharacter, calculateTotal])

  const calculateEvasion = useCallback(() => {
    if (!currentCharacter?.abilities?.athletics) return 0
    const athletics = calculateTotal(currentCharacter.abilities.athletics)
    const highestAttr = getHighestAttribute()
    const base = Math.ceil((athletics + highestAttr) / 2)
    const modifier = currentCharacter?.staticValues?.evasionModifier || 0
    return Math.max(0, base + Math.max(-5, Math.min(5, modifier)))
  }, [currentCharacter, calculateTotal, getHighestAttribute])

  const calculateParry = useCallback(() => {
    if (!currentCharacter?.abilities?.closeCombat) return 0
    const closeCombat = calculateTotal(currentCharacter.abilities.closeCombat)
    const highestAttr = getHighestAttribute()
    const base = Math.ceil((closeCombat + highestAttr) / 2)
    const modifier = currentCharacter?.staticValues?.parryModifier || 0
    return Math.max(0, base + Math.max(-5, Math.min(5, modifier)))
  }, [currentCharacter, calculateTotal, getHighestAttribute])

  const calculateDefense = useCallback(() => {
    const evasion = calculateEvasion()
    const parry = calculateParry()
    const base = Math.max(evasion, parry)
    const modifier = currentCharacter?.staticValues?.defenseModifier || 0
    return Math.max(0, base + Math.max(-5, Math.min(5, modifier)))
  }, [calculateEvasion, calculateParry, currentCharacter])

  const calculateResolve = useCallback(() => {
    if (!currentCharacter?.abilities?.integrity) return 2
    const integrity = calculateTotal(currentCharacter.abilities.integrity)
    let base = 2
    if (integrity >= 1) base += 1
    if (integrity >= 3) base += 2
    const modifier = currentCharacter?.staticValues?.resolveModifier || 0
    return Math.max(0, base + Math.max(-5, Math.min(5, modifier)))
  }, [currentCharacter, calculateTotal])

  const calculateSoak = useCallback(() => {
    if (!currentCharacter?.abilities?.physique) return 1
    const physique = calculateTotal(currentCharacter.abilities.physique)
    let base = 1
    if (physique >= 3) base += 1
    const armorSoak = (currentCharacter?.armor || []).reduce(
      (total: number, armor: any) => total + (Number.parseInt(armor.soak) || 0),
      0,
    )
    const modifier = currentCharacter?.staticValues?.soakModifier || 0
    return Math.max(0, base + armorSoak + Math.max(-5, Math.min(5, modifier)))
  }, [currentCharacter, calculateTotal])

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

  const calculateHealthLevels = useCallback(() => {
    const baseline = currentCharacter?.health?.baseline || { zero: 2, minusOne: 2, minusTwo: 2, incap: 1 }
    const oxBodyLevels = Math.max(0, Math.min(5, currentCharacter?.health?.oxBodyLevels || 0))
    const exaltType = currentCharacter?.health?.exaltType || "lunar"

    let oxBodyZero = 0,
      oxBodyMinusOne = 0
    if (exaltType === "lunar") {
      oxBodyZero = oxBodyLevels * 2
      oxBodyMinusOne = oxBodyLevels * 1
    }

    return {
      zero: baseline.zero + oxBodyZero,
      minusOne: baseline.minusOne + oxBodyMinusOne,
      minusTwo: baseline.minusTwo,
      incap: baseline.incap,
      total: baseline.zero + oxBodyZero + baseline.minusOne + oxBodyMinusOne + baseline.minusTwo + baseline.incap,
    }
  }, [currentCharacter])

  const calculateHealthPenalty = useCallback(() => {
    const levels = calculateHealthLevels()
    const bashingDamage = currentCharacter?.health?.bashingDamage || 0
    const lethalDamage = currentCharacter?.health?.lethalDamage || 0
    const aggravatedDamage = currentCharacter?.health?.aggravatedDamage || 0

    const totalDamage = bashingDamage + lethalDamage + aggravatedDamage

    if (totalDamage === 0) return 0
    if (totalDamage <= levels.zero) return 0
    if (totalDamage <= levels.zero + levels.minusOne) return -1
    if (totalDamage <= levels.zero + levels.minusOne + levels.minusTwo) return -2
    return -99 // Incapacitated
  }, [currentCharacter, calculateHealthLevels])

  const calculateAbilityTotal = useCallback(
    (abilityKey: string) => {
      const ability = currentCharacter?.abilities?.[abilityKey]
      if (!ability) return 0

      const abilityTotal = calculateTotal(ability)

      if (!globalAbilityAttribute || globalAbilityAttribute === "none") return abilityTotal

      const attribute = currentCharacter?.attributes?.[globalAbilityAttribute]
      if (!attribute) return abilityTotal

      return abilityTotal + calculateTotal(attribute)
    },
    [currentCharacter, calculateTotal, globalAbilityAttribute],
  )

  const calculateDicePool = useCallback(() => {
    if (!currentCharacter?.dicePool || !currentCharacter?.attributes || !currentCharacter?.abilities) {
      return { basePool: 0, extraDice: 0, totalPool: 0, cappedBonusDice: 0, actionPhrase: "Roll 0, TN 7 Double 10s" }
    }

    const { attribute, ability, targetNumber, doublesThreshold, extraSuccessBonus, extraSuccessNonBonus } =
      currentCharacter.dicePool
    const attributeTotal = calculateTotal(currentCharacter.attributes[attribute] || { base: 0, added: 0, bonus: 0 })
    const abilityTotal = calculateTotal(currentCharacter.abilities[ability] || { base: 0, added: 0, bonus: 0 })
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
  }, [currentCharacter, calculateTotal])

  // Equipment management functions
  const addArmor = useCallback(() => {
    if (!currentCharacter) return

    const newArmor = {
      id: Date.now(),
      name: "",
      type: "light",
      soak: 0,
      hardness: 0,
      mobility: 0,
      tags: "",
    }

    updateCharacter({
      armor: [...(currentCharacter.armor || []), newArmor],
    })
  }, [currentCharacter, updateCharacter])

  const updateArmor = useCallback(
    (id: number, field: string, value: any) => {
      if (!currentCharacter?.armor) return

      updateCharacter({
        armor: currentCharacter.armor.map((armor: any) => (armor.id === id ? { ...armor, [field]: value } : armor)),
      })
    },
    [currentCharacter, updateCharacter],
  )

  const deleteArmor = useCallback(
    (id: number) => {
      if (!currentCharacter?.armor) return

      updateCharacter({
        armor: currentCharacter.armor.filter((armor: any) => armor.id !== id),
      })
    },
    [currentCharacter, updateCharacter],
  )

  const addWeapon = useCallback(() => {
    if (!currentCharacter) return

    const newWeapon = {
      id: Date.now(),
      name: "",
      accuracy: 0,
      damage: 0,
      defence: 0,
      overwhelming: 0,
      range: "close",
      tags: "",
    }

    updateCharacter({
      weapons: [...(currentCharacter.weapons || []), newWeapon],
    })
  }, [currentCharacter, updateCharacter])

  const updateWeapon = useCallback(
    (id: number, field: string, value: any) => {
      if (!currentCharacter?.weapons) return

      updateCharacter({
        weapons: currentCharacter.weapons.map((weapon: any) =>
          weapon.id === id ? { ...weapon, [field]: value } : weapon,
        ),
      })
    },
    [currentCharacter, updateCharacter],
  )

  const deleteWeapon = useCallback(
    (id: number) => {
      if (!currentCharacter?.weapons) return

      updateCharacter({
        weapons: currentCharacter.weapons.filter((weapon: any) => weapon.id !== id),
      })
    },
    [currentCharacter, updateCharacter],
  )

  // Powers management
  const addCharm = useCallback(() => {
    if (!currentCharacter) return

    const newCharm = {
      id: Date.now(),
      name: "",
      step: 1,
      cost: "",
      description: "",
      pageReference: "",
    }

    updateCharacter({
      charms: [...(currentCharacter.charms || []), newCharm],
    })
  }, [currentCharacter, updateCharacter])

  const updateCharm = useCallback(
    (id: number, field: string, value: any) => {
      if (!currentCharacter?.charms) return

      updateCharacter({
        charms: currentCharacter.charms.map((charm: any) => (charm.id === id ? { ...charm, [field]: value } : charm)),
      })
    },
    [currentCharacter, updateCharacter],
  )

  const deleteCharm = useCallback(
    (id: number) => {
      if (!currentCharacter?.charms) return

      updateCharacter({
        charms: currentCharacter.charms.filter((charm: any) => charm.id !== id),
      })
    },
    [currentCharacter, updateCharacter],
  )

  const addSpell = useCallback(() => {
    if (!currentCharacter) return

    const newSpell = {
      id: Date.now(),
      name: "",
      step: 1,
      cost: "",
      description: "",
      pageReference: "",
    }

    updateCharacter({
      spells: [...(currentCharacter.spells || []), newSpell],
    })
  }, [currentCharacter, updateCharacter])

  const updateSpell = useCallback(
    (id: number, field: string, value: any) => {
      if (!currentCharacter?.spells) return

      updateCharacter({
        spells: currentCharacter.spells.map((spell: any) => (spell.id === id ? { ...spell, [field]: value } : spell)),
      })
    },
    [currentCharacter, updateCharacter],
  )

  const deleteSpell = useCallback(
    (id: number) => {
      if (!currentCharacter?.spells) return

      updateCharacter({
        spells: currentCharacter.spells.filter((spell: any) => spell.id !== id),
      })
    },
    [currentCharacter, updateCharacter],
  )

  // Social management
  const setVirtue = useCallback(
    (type: "major" | "minor", virtue: string | null) => {
      if (!currentCharacter) return

      updateCharacter({
        social: {
          ...currentCharacter.social,
          virtues: {
            ...currentCharacter.social?.virtues,
            [type]: virtue,
          },
        },
      })
    },
    [currentCharacter, updateCharacter],
  )

  const addIntimacy = useCallback(
    (type = "Tie") => {
      if (!currentCharacter) return

      const newIntimacy = {
        id: Date.now(),
        intimacy: "",
        type: type,
        strength: "Minor",
      }

      updateCharacter({
        social: {
          ...currentCharacter.social,
          intimacies: [...(currentCharacter.social?.intimacies || []), newIntimacy],
        },
      })
    },
    [currentCharacter, updateCharacter],
  )

  const updateIntimacy = useCallback(
    (id: number, field: string, value: any) => {
      if (!currentCharacter) return

      updateCharacter({
        social: {
          ...currentCharacter.social,
          intimacies: (currentCharacter.social?.intimacies || []).map((intimacy: any) =>
            intimacy.id === id ? { ...intimacy, [field]: value } : intimacy,
          ),
        },
      })
    },
    [currentCharacter, updateCharacter],
  )

  const deleteIntimacy = useCallback(
    (id: number) => {
      if (!currentCharacter) return

      updateCharacter({
        social: {
          ...currentCharacter.social,
          intimacies: (currentCharacter.social?.intimacies || []).filter((intimacy: any) => intimacy.id !== id),
        },
      })
    },
    [currentCharacter, updateCharacter],
  )

  // Dramatic injuries management
  const addDramaticInjury = useCallback(() => {
    if (!currentCharacter) return

    const newInjury = {
      id: Date.now(),
      description: "",
      healed: false,
    }

    updateCharacter({
      health: {
        ...currentCharacter.health,
        dramaticInjuries: [...(currentCharacter.health?.dramaticInjuries || []), newInjury],
      },
    })
  }, [currentCharacter, updateCharacter])

  const updateDramaticInjury = useCallback(
    (id: number, field: string, value: any) => {
      if (!currentCharacter?.health?.dramaticInjuries) return

      updateCharacter({
        health: {
          ...currentCharacter.health,
          dramaticInjuries: currentCharacter.health.dramaticInjuries.map((injury: any) =>
            injury.id === id ? { ...injury, [field]: value } : injury,
          ),
        },
      })
    },
    [currentCharacter, updateCharacter],
  )

  const deleteDramaticInjury = useCallback(
    (id: number) => {
      if (!currentCharacter?.health?.dramaticInjuries) return

      updateCharacter({
        health: {
          ...currentCharacter.health,
          dramaticInjuries: currentCharacter.health.dramaticInjuries.filter((injury: any) => injury.id !== id),
        },
      })
    },
    [currentCharacter, updateCharacter],
  )

  // Advancement management
  const addAdvancementEntry = useCallback(() => {
    if (!currentCharacter) return

    const newEntry = {
      id: Date.now(),
      item: "",
      status: "Planned",
      timestamp: new Date().toLocaleDateString(),
    }

    updateCharacter({
      advancement: [...(currentCharacter.advancement || []), newEntry],
    })
  }, [currentCharacter, updateCharacter])

  const updateAdvancementEntry = useCallback(
    (id: number, field: string, value: any) => {
      if (!currentCharacter?.advancement) return

      updateCharacter({
        advancement: currentCharacter.advancement.map((entry: any) =>
          entry.id === id ? { ...entry, [field]: value } : entry,
        ),
      })
    },
    [currentCharacter, updateCharacter],
  )

  const deleteAdvancementEntry = useCallback(
    (id: number) => {
      if (!currentCharacter?.advancement) return

      updateCharacter({
        advancement: currentCharacter.advancement.filter((entry: any) => entry.id !== id),
      })
    },
    [currentCharacter, updateCharacter],
  )

  // Rulings management
  const addRuling = useCallback(() => {
    if (!currentCharacter) return

    const newRuling = {
      id: Date.now(),
      text: "",
      date: new Date().toLocaleDateString(),
    }

    updateCharacter({
      rulings: [...(currentCharacter.rulings || []), newRuling],
    })
  }, [currentCharacter, updateCharacter])

  const updateRuling = useCallback(
    (id: number, text: string) => {
      if (!currentCharacter) return

      updateCharacter({
        rulings: (currentCharacter.rulings || []).map((ruling: any) =>
          ruling.id === id ? { ...ruling, text } : ruling,
        ),
      })
    },
    [currentCharacter, updateCharacter],
  )

  const deleteRuling = useCallback(
    (id: number) => {
      if (!currentCharacter) return

      updateCharacter({
        rulings: (currentCharacter.rulings || []).filter((ruling: any) => ruling.id !== id),
      })
    },
    [currentCharacter, updateCharacter],
  )

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

  const virtueOptions = ["Compassion", "Courage", "Discipline", "Justice", "Loyalty", "Wonder"]

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
              {/* Essence */}
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
                          value={currentCharacter.essence?.rating || 1}
                          onChange={(e) => {
                            const value = Math.max(0, Math.min(10, Number.parseInt(e.target.value) || 0))
                            updateCharacter({
                              essence: { ...currentCharacter.essence, rating: value },
                            })
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
                          value={currentCharacter.essence?.motes || 5}
                          onChange={(e) => {
                            const value = Math.max(0, Math.min(50, Number.parseInt(e.target.value) || 0))
                            updateCharacter({
                              essence: { ...currentCharacter.essence, motes: value },
                            })
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
                          value={currentCharacter.essence?.commitments || 0}
                          onChange={(e) => {
                            const value = Math.max(0, Number.parseInt(e.target.value) || 0)
                            updateCharacter({
                              essence: { ...currentCharacter.essence, commitments: value },
                            })
                          }}
                          className="w-20 text-center"
                          min={0}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Spent</Label>
                        <Input
                          type="number"
                          value={currentCharacter.essence?.spent || 0}
                          onChange={(e) => {
                            const value = Math.max(0, Number.parseInt(e.target.value) || 0)
                            updateCharacter({
                              essence: { ...currentCharacter.essence, spent: value },
                            })
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
                            {(currentCharacter.essence?.motes || 5) -
                              (currentCharacter.essence?.commitments || 0) -
                              (currentCharacter.essence?.spent || 0)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="font-medium text-green-600">Open</Label>
                          <span className="font-bold text-green-600">
                            {(currentCharacter.essence?.motes || 5) - (currentCharacter.essence?.commitments || 0)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Anima</Label>
                        <Input
                          type="number"
                          value={currentCharacter.essence?.anima || 0}
                          onChange={(e) => {
                            const value = Math.max(0, Math.min(10, Number.parseInt(e.target.value) || 0))
                            updateCharacter({
                              essence: { ...currentCharacter.essence, anima: value },
                            })
                          }}
                          className="w-20 text-center"
                          min={0}
                          max={10}
                        />
                      </div>

                      {/* Anima Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>Dim</span>
                          <span>Burning</span>
                          <span>Bonfire</span>
                          <span>Iconic</span>
                        </div>
                        <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              (currentCharacter?.essence?.anima || 0) <= 4
                                ? "bg-gray-400"
                                : (currentCharacter?.essence?.anima || 0) <= 6
                                  ? "bg-orange-500"
                                  : (currentCharacter?.essence?.anima || 0) <= 9
                                    ? "bg-red-500"
                                    : "bg-purple-600"
                            }`}
                            style={{ width: `${Math.min(100, ((currentCharacter?.essence?.anima || 0) / 10) * 100)}%` }}
                          />
                          <div className="absolute inset-0 flex">
                            <div className="w-2/5 border-r border-white"></div>
                            <div className="w-1/5 border-r border-white"></div>
                            <div className="w-3/10 border-r border-white"></div>
                            <div className="w-1/10"></div>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>0</span>
                          <span>4</span>
                          <span>6</span>
                          <span>9</span>
                          <span>10</span>
                        </div>
                      </div>

                      {/* Anima Level and Rulings */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-purple-600">Anima Level</span>
                          <Badge variant="outline" className="text-purple-600">
                            {getAnimaLevel(currentCharacter?.essence?.anima || 0)}
                          </Badge>
                        </div>
                        {getActiveAnimaRulings(currentCharacter?.essence?.anima || 0).length > 0 && (
                          <div className="bg-purple-50 p-3 rounded-lg">
                            <div className="text-sm font-medium text-purple-700 mb-2">Active Effects:</div>
                            {getActiveAnimaRulings(currentCharacter?.essence?.anima || 0).map((ruling, index) => (
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

              {/* Attributes and Abilities */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Attributes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="py-2 px-3 text-left">Attribute</th>
                            <th className="py-2 px-3 text-center">Base</th>
                            <th className="py-2 px-3 text-center">Added</th>
                            <th className="py-2 px-3 text-center">Bonus</th>
                            <th className="py-2 px-3 text-center">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(currentCharacter.attributes || {}).map(([key, attr]: [string, any]) => {
                            const colorClass =
                              key === "fortitude"
                                ? "text-green-600"
                                : key === "finesse"
                                  ? "text-blue-600"
                                  : key === "force"
                                    ? "text-red-600"
                                    : "text-gray-700"
                            return (
                              <tr key={key} className="border-b border-gray-200">
                                <td className={`py-2 px-3 font-medium capitalize ${colorClass}`}>{key}</td>
                                <td className="py-2 px-3">
                                  <Input
                                    type="number"
                                    value={attr.base}
                                    onChange={(e) => {
                                      const value = Math.max(1, Math.min(5, Number.parseInt(e.target.value) || 1))
                                      updateCharacter({
                                        attributes: {
                                          ...currentCharacter.attributes,
                                          [key]: { ...attr, base: value },
                                        },
                                      })
                                    }}
                                    className="w-16 text-center"
                                    min={1}
                                    max={5}
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <Input
                                    type="number"
                                    value={attr.added}
                                    onChange={(e) => {
                                      const maxAdded = Math.max(0, 5 - attr.base)
                                      const value = Math.min(
                                        maxAdded,
                                        Math.max(0, Number.parseInt(e.target.value) || 0),
                                      )
                                      updateCharacter({
                                        attributes: {
                                          ...currentCharacter.attributes,
                                          [key]: { ...attr, added: value },
                                        },
                                      })
                                    }}
                                    className="w-16 text-center"
                                    min={0}
                                    max={Math.max(0, 5 - attr.base)}
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <Input
                                    type="number"
                                    value={attr.bonus}
                                    onChange={(e) => {
                                      const value = Math.max(0, Number.parseInt(e.target.value) || 0)
                                      updateCharacter({
                                        attributes: {
                                          ...currentCharacter.attributes,
                                          [key]: { ...attr, bonus: value },
                                        },
                                      })
                                    }}
                                    className="w-16 text-center"
                                    min={0}
                                  />
                                </td>
                                <td className={`py-2 px-3 font-bold text-center ${colorClass}`}>
                                  {calculateTotal(attr)}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-2 text-xs text-gray-400 italic">Base + Added cannot exceed 5</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Abilities</CardTitle>
                    <CardDescription>
                      <div className="flex items-center gap-2 mt-2">
                        <Label className="text-sm">Add Attribute to All:</Label>
                        <div className="flex gap-1">
                          <Button
                            variant={globalAbilityAttribute === "none" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setGlobalAbilityAttribute("none")}
                          >
                            None
                          </Button>
                          <Button
                            variant={globalAbilityAttribute === "fortitude" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setGlobalAbilityAttribute("fortitude")}
                            className={
                              globalAbilityAttribute === "fortitude"
                                ? "bg-green-600 hover:bg-green-700"
                                : "text-green-600 border-green-600 hover:bg-green-50"
                            }
                          >
                            Fortitude
                          </Button>
                          <Button
                            variant={globalAbilityAttribute === "finesse" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setGlobalAbilityAttribute("finesse")}
                            className={
                              globalAbilityAttribute === "finesse"
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "text-blue-600 border-blue-600 hover:bg-blue-50"
                            }
                          >
                            Finesse
                          </Button>
                          <Button
                            variant={globalAbilityAttribute === "force" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setGlobalAbilityAttribute("force")}
                            className={
                              globalAbilityAttribute === "force"
                                ? "bg-red-600 hover:bg-red-700"
                                : "text-red-600 border-red-600 hover:bg-red-50"
                            }
                          >
                            Force
                          </Button>
                        </div>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-96 overflow-y-auto">
                      <table className="w-full">
                        <thead className="sticky top-0 bg-gray-100">
                          <tr>
                            <th className="py-2 px-3 text-left text-sm">Ability</th>
                            <th className="py-2 px-3 text-center text-sm">Base</th>
                            <th className="py-2 px-3 text-center text-sm">Added</th>
                            <th className="py-2 px-3 text-center text-sm">Bonus</th>
                            <th className="py-2 px-3 text-center text-sm">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(currentCharacter.abilities || {}).map(([key, ability]: [string, any]) => (
                            <tr key={key} className="border-b border-gray-200">
                              <td className="py-2 px-3 font-medium text-gray-700 text-sm capitalize">
                                {key.replace(/([A-Z])/g, " $1").trim()}
                              </td>
                              <td className="py-2 px-3">
                                <Input
                                  type="number"
                                  value={ability.base}
                                  onChange={(e) => {
                                    const value = Math.max(0, Math.min(5, Number.parseInt(e.target.value) || 0))
                                    updateCharacter({
                                      abilities: {
                                        ...currentCharacter.abilities,
                                        [key]: { ...ability, base: value },
                                      },
                                    })
                                  }}
                                  className="w-16 text-center text-sm"
                                  min={0}
                                  max={5}
                                />
                              </td>
                              <td className="py-2 px-3">
                                <Input
                                  type="number"
                                  value={ability.added}
                                  onChange={(e) => {
                                    const maxAdded = Math.max(0, 5 - ability.base)
                                    const value = Math.min(maxAdded, Math.max(0, Number.parseInt(e.target.value) || 0))
                                    updateCharacter({
                                      abilities: {
                                        ...currentCharacter.abilities,
                                        [key]: { ...ability, added: value },
                                      },
                                    })
                                  }}
                                  className="w-16 text-center text-sm"
                                  min={0}
                                  max={Math.max(0, 5 - ability.base)}
                                />
                              </td>
                              <td className="py-2 px-3">
                                <Input
                                  type="number"
                                  value={ability.bonus}
                                  onChange={(e) => {
                                    const value = Math.max(0, Number.parseInt(e.target.value) || 0)
                                    updateCharacter({
                                      abilities: {
                                        ...currentCharacter.abilities,
                                        [key]: { ...ability, bonus: value },
                                      },
                                    })
                                  }}
                                  className="w-16 text-center text-sm"
                                  min={0}
                                />
                              </td>
                              <td
                                className={`py-2 px-3 font-bold text-center text-sm ${
                                  globalAbilityAttribute === "fortitude"
                                    ? "text-green-600"
                                    : globalAbilityAttribute === "finesse"
                                      ? "text-blue-600"
                                      : globalAbilityAttribute === "force"
                                        ? "text-red-600"
                                        : "text-gray-700"
                                }`}
                              >
                                {calculateAbilityTotal(key)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-2 text-xs text-gray-400 italic">Base + Added cannot exceed 5</div>
                  </CardContent>
                </Card>
              </div>

              {/* Dice Pool Calculator */}
              <Card>
                <CardHeader>
                  <CardTitle>Dice Pool Calculator</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Pool Assembly */}
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-3">Pool Assembly</h3>
                      <div className="space-y-3">
                        <div>
                          <Label className="block text-sm font-medium text-gray-600 mb-1">Attribute</Label>
                          <div className="flex gap-2">
                            <Button
                              variant={currentCharacter?.dicePool?.attribute === "fortitude" ? "default" : "outline"}
                              size="sm"
                              onClick={() =>
                                updateCharacter({
                                  dicePool: { ...currentCharacter.dicePool, attribute: "fortitude" },
                                })
                              }
                              className={
                                currentCharacter?.dicePool?.attribute === "fortitude"
                                  ? "bg-green-600 hover:bg-green-700"
                                  : "text-green-600 border-green-600 hover:bg-green-50"
                              }
                            >
                              <div>Fortitude</div>
                              <div className="text-xs opacity-75">
                                (
                                {calculateTotal(
                                  currentCharacter?.attributes?.fortitude || { base: 0, added: 0, bonus: 0 },
                                )}
                                )
                              </div>
                            </Button>
                            <Button
                              variant={currentCharacter?.dicePool?.attribute === "finesse" ? "default" : "outline"}
                              size="sm"
                              onClick={() =>
                                updateCharacter({
                                  dicePool: { ...currentCharacter.dicePool, attribute: "finesse" },
                                })
                              }
                              className={
                                currentCharacter?.dicePool?.attribute === "finesse"
                                  ? "bg-blue-600 hover:bg-blue-700"
                                  : "text-blue-600 border-blue-600 hover:bg-blue-50"
                              }
                            >
                              <div>Finesse</div>
                              <div className="text-xs opacity-75">
                                (
                                {calculateTotal(
                                  currentCharacter?.attributes?.finesse || { base: 0, added: 0, bonus: 0 },
                                )}
                                )
                              </div>
                            </Button>
                            <Button
                              variant={currentCharacter?.dicePool?.attribute === "force" ? "default" : "outline"}
                              size="sm"
                              onClick={() =>
                                updateCharacter({
                                  dicePool: { ...currentCharacter.dicePool, attribute: "force" },
                                })
                              }
                              className={
                                currentCharacter?.dicePool?.attribute === "force"
                                  ? "bg-red-600 hover:bg-red-700"
                                  : "text-red-600 border-red-600 hover:bg-red-50"
                              }
                            >
                              <div>Force</div>
                              <div className="text-xs opacity-75">
                                (
                                {calculateTotal(currentCharacter?.attributes?.force || { base: 0, added: 0, bonus: 0 })}
                                )
                              </div>
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label className="block text-sm font-medium text-gray-600 mb-1">Ability</Label>
                          <Select
                            value={currentCharacter?.dicePool?.ability || "athletics"}
                            onValueChange={(value) =>
                              updateCharacter({
                                dicePool: { ...currentCharacter.dicePool, ability: value },
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(currentCharacter?.abilities || {}).map((ability) => (
                                <SelectItem key={ability} value={ability}>
                                  {ability.charAt(0).toUpperCase() + ability.slice(1).replace(/([A-Z])/g, " $1")} (
                                  {calculateTotal(
                                    currentCharacter?.abilities?.[ability] || { base: 0, added: 0, bonus: 0 },
                                  )}
                                  )
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="block text-sm font-medium text-gray-600 mb-1">Target Number</Label>
                            <Input
                              type="number"
                              value={currentCharacter?.dicePool?.targetNumber || 7}
                              onChange={(e) =>
                                updateCharacter({
                                  dicePool: {
                                    ...currentCharacter.dicePool,
                                    targetNumber: Number.parseInt(e.target.value) || 7,
                                  },
                                })
                              }
                              className="text-center"
                              min={1}
                              max={10}
                            />
                          </div>
                          <div>
                            <Label className="block text-sm font-medium text-gray-600 mb-1">Doubles Threshold</Label>
                            <Input
                              type="number"
                              value={currentCharacter?.dicePool?.doublesThreshold || 10}
                              onChange={(e) =>
                                updateCharacter({
                                  dicePool: {
                                    ...currentCharacter.dicePool,
                                    doublesThreshold: Number.parseInt(e.target.value) || 10,
                                  },
                                })
                              }
                              className="text-center"
                              min={1}
                              max={10}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Extra Dice and Success */}
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-3">Modifiers</h3>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="block text-sm font-medium text-gray-600 mb-1">Extra Dice (Bonus)</Label>
                            <Input
                              type="number"
                              value={currentCharacter?.dicePool?.extraDiceBonus || 0}
                              onChange={(e) =>
                                updateCharacter({
                                  dicePool: {
                                    ...currentCharacter.dicePool,
                                    extraDiceBonus: Math.min(10, Math.max(0, Number.parseInt(e.target.value) || 0)),
                                  },
                                })
                              }
                              className="text-center"
                              min={0}
                              max={10}
                            />
                            <div className="text-xs text-gray-500 mt-1">Max: 10</div>
                          </div>
                          <div>
                            <Label className="block text-sm font-medium text-gray-600 mb-1">
                              Extra Dice (Non-Bonus)
                            </Label>
                            <Input
                              type="number"
                              value={currentCharacter?.dicePool?.extraDiceNonBonus || 0}
                              onChange={(e) =>
                                updateCharacter({
                                  dicePool: {
                                    ...currentCharacter.dicePool,
                                    extraDiceNonBonus: Math.max(0, Number.parseInt(e.target.value) || 0),
                                  },
                                })
                              }
                              className="text-center"
                              min={0}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="block text-sm font-medium text-gray-600 mb-1">
                              Extra Success (Bonus)
                            </Label>
                            <Input
                              type="number"
                              value={currentCharacter?.dicePool?.extraSuccessBonus || 0}
                              onChange={(e) =>
                                updateCharacter({
                                  dicePool: {
                                    ...currentCharacter.dicePool,
                                    extraSuccessBonus: Math.min(5, Math.max(0, Number.parseInt(e.target.value) || 0)),
                                  },
                                })
                              }
                              className="text-center"
                              min={0}
                              max={5}
                            />
                            <div className="text-xs text-gray-500 mt-1">Max: 5</div>
                          </div>
                          <div>
                            <Label className="block text-sm font-medium text-gray-600 mb-1">
                              Extra Success (Non-Bonus)
                            </Label>
                            <Input
                              type="number"
                              value={currentCharacter?.dicePool?.extraSuccessNonBonus || 0}
                              onChange={(e) =>
                                updateCharacter({
                                  dicePool: {
                                    ...currentCharacter.dicePool,
                                    extraSuccessNonBonus: Math.max(0, Number.parseInt(e.target.value) || 0),
                                  },
                                })
                              }
                              className="text-center"
                              min={0}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Results */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">Dice Pool Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <div className="text-blue-600 font-medium">Base Pool</div>
                        <div className="text-lg font-bold text-blue-800">{calculateDicePool().basePool}</div>
                      </div>
                      <div>
                        <div className="text-blue-600 font-medium">Extra Dice</div>
                        <div className="text-lg font-bold text-blue-800">+{calculateDicePool().extraDice}</div>
                      </div>
                      <div>
                        <div className="text-blue-600 font-medium">Total Dice</div>
                        <div className="text-lg font-bold text-blue-800">{calculateDicePool().totalPool}</div>
                      </div>
                      <div>
                        <div className="text-blue-600 font-medium">Extra Success</div>
                        <div className="text-lg font-bold text-blue-800">
                          +
                          {(currentCharacter?.dicePool?.extraSuccessBonus || 0) +
                            (currentCharacter?.dicePool?.extraSuccessNonBonus || 0)}
                        </div>
                      </div>
                    </div>
                    <div className="text-center p-2 bg-blue-100 rounded font-medium text-blue-800">
                      {calculateDicePool().actionPhrase}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="combat" className="space-y-6">
              {/* Essence (duplicated for combat convenience) */}
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
                          value={currentCharacter.essence?.rating || 1}
                          onChange={(e) => {
                            const value = Math.max(0, Math.min(10, Number.parseInt(e.target.value) || 0))
                            updateCharacter({
                              essence: { ...currentCharacter.essence, rating: value },
                            })
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
                          value={currentCharacter.essence?.motes || 5}
                          onChange={(e) => {
                            const value = Math.max(0, Math.min(50, Number.parseInt(e.target.value) || 0))
                            updateCharacter({
                              essence: { ...currentCharacter.essence, motes: value },
                            })
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
                          value={currentCharacter.essence?.commitments || 0}
                          onChange={(e) => {
                            const value = Math.max(0, Number.parseInt(e.target.value) || 0)
                            updateCharacter({
                              essence: { ...currentCharacter.essence, commitments: value },
                            })
                          }}
                          className="w-20 text-center"
                          min={0}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Spent</Label>
                        <Input
                          type="number"
                          value={currentCharacter.essence?.spent || 0}
                          onChange={(e) => {
                            const value = Math.max(0, Number.parseInt(e.target.value) || 0)
                            updateCharacter({
                              essence: { ...currentCharacter.essence, spent: value },
                            })
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
                            {(currentCharacter.essence?.motes || 5) -
                              (currentCharacter.essence?.commitments || 0) -
                              (currentCharacter.essence?.spent || 0)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="font-medium text-green-600">Open</Label>
                          <span className="font-bold text-green-600">
                            {(currentCharacter.essence?.motes || 5) - (currentCharacter.essence?.commitments || 0)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Anima</Label>
                        <Input
                          type="number"
                          value={currentCharacter.essence?.anima || 0}
                          onChange={(e) => {
                            const value = Math.max(0, Math.min(10, Number.parseInt(e.target.value) || 0))
                            updateCharacter({
                              essence: { ...currentCharacter.essence, anima: value },
                            })
                          }}
                          className="w-20 text-center"
                          min={0}
                          max={10}
                        />
                      </div>

                      {/* Anima Level and Rulings */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-purple-600">Anima Level</span>
                          <Badge variant="outline" className="text-purple-600">
                            {getAnimaLevel(currentCharacter?.essence?.anima || 0)}
                          </Badge>
                        </div>
                        {getActiveAnimaRulings(currentCharacter?.essence?.anima || 0).length > 0 && (
                          <div className="bg-purple-50 p-3 rounded-lg">
                            <div className="text-sm font-medium text-purple-700 mb-2">Active Effects:</div>
                            {getActiveAnimaRulings(currentCharacter?.essence?.anima || 0).map((ruling, index) => (
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

              {/* Combat Rolls */}
              <Card>
                <CardHeader>
                  <CardTitle>Combat Rolls</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Join Battle */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-700">Join Battle</h3>
                      <div className="p-3 bg-white rounded border">
                        <div className="text-sm text-gray-600 mb-3">
                          Best Attribute + Best of Close/Ranged Combat + Modifiers
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div>
                            <Label className="text-xs text-gray-600">Extra Dice</Label>
                            <Input
                              type="number"
                              value={currentCharacter?.combat?.joinBattleDiceBonus || 0}
                              onChange={(e) => {
                                const value = Math.max(-10, Math.min(10, Number.parseInt(e.target.value) || 0))
                                updateCharacter({
                                  combat: { ...currentCharacter.combat, joinBattleDiceBonus: value },
                                })
                              }}
                              className="w-full text-center"
                              min={-10}
                              max={10}
                            />
                            <div className="text-xs text-gray-400">±10 cap</div>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-600">Extra Success</Label>
                            <Input
                              type="number"
                              value={currentCharacter?.combat?.joinBattleSuccessBonus || 0}
                              onChange={(e) => {
                                const value = Math.max(-5, Math.min(5, Number.parseInt(e.target.value) || 0))
                                updateCharacter({
                                  combat: { ...currentCharacter.combat, joinBattleSuccessBonus: value },
                                })
                              }}
                              className="w-full text-center"
                              min={-5}
                              max={5}
                            />
                            <div className="text-xs text-gray-400">±5 cap</div>
                          </div>
                        </div>
                        <div className="text-center p-2 bg-blue-100 rounded">
                          <div className="text-lg font-bold text-blue-800">
                            Roll{" "}
                            {getHighestAttribute() +
                              Math.max(
                                calculateTotal(
                                  currentCharacter?.abilities?.closeCombat || { base: 0, added: 0, bonus: 0 },
                                ),
                                calculateTotal(
                                  currentCharacter?.abilities?.rangedCombat || { base: 0, added: 0, bonus: 0 },
                                ),
                              ) +
                              (currentCharacter?.combat?.joinBattleDiceBonus || 0)}
                            {(currentCharacter?.combat?.joinBattleSuccessBonus || 0) !== 0 &&
                              `, ${currentCharacter?.combat?.joinBattleSuccessBonus > 0 ? "+" : ""}${currentCharacter?.combat?.joinBattleSuccessBonus} success in`}
                            , TN 7 Double 10s
                          </div>
                          <div className="text-sm text-blue-600">Join Battle</div>
                        </div>
                      </div>
                    </div>

                    {/* Power Tracker */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-700">Power Tracker</h3>
                      <div className="p-3 bg-white rounded border space-y-3">
                        <div className="text-sm text-gray-600 mb-2">Track power gained from attacks</div>
                        <div className="flex items-center justify-center gap-4">
                          <Button
                            onClick={() =>
                              updateCharacter({
                                combat: {
                                  ...currentCharacter.combat,
                                  power: Math.max(0, (currentCharacter?.combat?.power || 0) - 1),
                                },
                              })
                            }
                            variant="outline"
                            size="sm"
                          >
                            -
                          </Button>
                          <div className="text-3xl font-bold text-gray-800 w-16 text-center">
                            {currentCharacter?.combat?.power || 0}
                          </div>
                          <Button
                            onClick={() =>
                              updateCharacter({
                                combat: {
                                  ...currentCharacter.combat,
                                  power: (currentCharacter?.combat?.power || 0) + 1,
                                },
                              })
                            }
                            variant="outline"
                            size="sm"
                          >
                            +
                          </Button>
                        </div>

                        {/* Gambits */}
                        {(currentCharacter?.combat?.power || 0) >= 3 && (
                          <div className="bg-yellow-50 p-2 rounded">
                            <div className="text-sm font-medium text-yellow-700 mb-1">Available Gambits:</div>
                            <div className="text-sm text-yellow-600">• Hinder(3) Available</div>
                          </div>
                        )}

                        {/* Decisive Attack Roller */}
                        <div className="border-t pt-3">
                          <h4 className="font-medium text-gray-700 mb-2">Decisive Attack Roller</h4>
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <div>
                              <Label className="text-xs text-gray-600">Extra Dice</Label>
                              <Input
                                type="number"
                                value={currentCharacter?.combat?.decisiveExtraDice || 0}
                                onChange={(e) => {
                                  const value = Math.max(-10, Math.min(10, Number.parseInt(e.target.value) || 0))
                                  updateCharacter({
                                    combat: { ...currentCharacter.combat, decisiveExtraDice: value },
                                  })
                                }}
                                className="text-center text-sm"
                                min={-10}
                                max={10}
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-gray-600">Extra Success</Label>
                              <Input
                                type="number"
                                value={currentCharacter?.combat?.decisiveExtraSuccess || 0}
                                onChange={(e) => {
                                  const value = Math.max(-5, Math.min(5, Number.parseInt(e.target.value) || 0))
                                  updateCharacter({
                                    combat: { ...currentCharacter.combat, decisiveExtraSuccess: value },
                                  })
                                }}
                                className="text-center text-sm"
                                min={-5}
                                max={5}
                              />
                            </div>
                          </div>
                          <div className="text-center p-2 bg-red-100 rounded text-sm">
                            <div className="font-bold text-red-800">
                              Roll{" "}
                              {(currentCharacter?.combat?.power || 0) +
                                (currentCharacter?.combat?.decisiveExtraDice || 0)}{" "}
                              dice
                              {(currentCharacter?.combat?.decisiveExtraSuccess || 0) +
                                ((currentCharacter?.weapons || [])[0]?.damage || 0) >
                                0 &&
                                `, +${
                                  (currentCharacter?.combat?.decisiveExtraSuccess || 0) +
                                  ((currentCharacter?.weapons || [])[0]?.damage || 0)
                                } success in`}
                              , TN 7 Double 10s
                            </div>
                            <div className="text-red-600">Decisive Attack</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Weapon Combat Roller */}
                  {(currentCharacter?.weapons || []).length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-semibold text-gray-700 mb-3">Weapon Combat Rolls</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="py-2 px-3 text-left">Weapon</th>
                              <th className="py-2 px-3 text-center">Range</th>
                              <th className="py-2 px-3 text-center">Attack Pool</th>
                              <th className="py-2 px-3 text-center">Damage Pool</th>
                              <th className="py-2 px-3 text-center">Overwhelming</th>
                              <th className="py-2 px-3 text-center">Defense Bonus</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentCharacter.weapons.map((weapon: any) => {
                              const isClose = weapon.range === "close"
                              const relevantAbility = isClose ? "closeCombat" : "rangedCombat"
                              const abilityTotal = calculateTotal(
                                currentCharacter.abilities[relevantAbility] || { base: 0, added: 0, bonus: 0 },
                              )
                              const bestAttr = getHighestAttribute()
                              const attackPool = bestAttr + abilityTotal + (Number.parseInt(weapon.accuracy) || 0)
                              const damagePool = Number.parseInt(weapon.damage) || 0

                              return (
                                <tr key={weapon.id} className="border-b border-gray-200">
                                  <td className="py-2 px-3 font-medium">{weapon.name || "Unnamed Weapon"}</td>
                                  <td className="py-2 px-3 text-center capitalize">{weapon.range || "close"}</td>
                                  <td className="py-2 px-3 text-center font-bold text-blue-600">{attackPool}</td>
                                  <td className="py-2 px-3 text-center font-bold text-red-600">{damagePool}</td>
                                  <td className="py-2 px-3 text-center">{weapon.overwhelming || 0}</td>
                                  <td className="py-2 px-3 text-center">+{weapon.defence || 0}</td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Static Values */}
              <Card>
                <CardHeader>
                  <CardTitle>Static Values</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* First Row */}
                    <div className="grid grid-cols-3 gap-6">
                      {/* Defense */}
                      <div className="space-y-2">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">{calculateDefense()}</div>
                          <div className="text-sm font-medium text-gray-700">Defense</div>
                        </div>
                        <div className="text-xs text-gray-500 text-center">
                          <div>Max of Evasion/Parry</div>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <Label className="text-xs text-gray-600">Mod:</Label>
                          <Input
                            type="number"
                            value={currentCharacter?.staticValues?.defenseModifier || 0}
                            onChange={(e) => {
                              const value = Math.max(-5, Math.min(5, Number.parseInt(e.target.value) || 0))
                              updateCharacter({
                                staticValues: { ...currentCharacter.staticValues, defenseModifier: value },
                              })
                            }}
                            className="w-12 text-center text-xs"
                            min={-5}
                            max={5}
                          />
                        </div>
                      </div>

                      {/* Evasion */}
                      <div className="space-y-2">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{calculateEvasion()}</div>
                          <div className="text-sm font-medium text-gray-700">Evasion</div>
                        </div>
                        <div className="text-xs text-gray-500 text-center">
                          <div>⌈(Athletics + Max Attr) / 2⌉</div>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <Label className="text-xs text-gray-600">Mod:</Label>
                          <Input
                            type="number"
                            value={currentCharacter?.staticValues?.evasionModifier || 0}
                            onChange={(e) => {
                              const value = Math.max(-5, Math.min(5, Number.parseInt(e.target.value) || 0))
                              updateCharacter({
                                staticValues: { ...currentCharacter.staticValues, evasionModifier: value },
                              })
                            }}
                            className="w-12 text-center text-xs"
                            min={-5}
                            max={5}
                          />
                        </div>
                      </div>

                      {/* Parry */}
                      <div className="space-y-2">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">{calculateParry()}</div>
                          <div className="text-sm font-medium text-gray-700">Parry</div>
                        </div>
                        <div className="text-xs text-gray-500 text-center">
                          <div>⌈(Close Combat + Max Attr) / 2⌉</div>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <Label className="text-xs text-gray-600">Mod:</Label>
                          <Input
                            type="number"
                            value={currentCharacter?.staticValues?.parryModifier || 0}
                            onChange={(e) => {
                              const value = Math.max(-5, Math.min(5, Number.parseInt(e.target.value) || 0))
                              updateCharacter({
                                staticValues: { ...currentCharacter.staticValues, parryModifier: value },
                              })
                            }}
                            className="w-12 text-center text-xs"
                            min={-5}
                            max={5}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Second Row */}
                    <div className="grid grid-cols-3 gap-6">
                      {/* Resolve */}
                      <div className="space-y-2">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{calculateResolve()}</div>
                          <div className="text-sm font-medium text-gray-700">Resolve</div>
                        </div>
                        <div className="text-xs text-gray-500 text-center">
                          <div>2 + Integrity bonuses</div>
                          <div>Integrity 1+ = +1, Integrity 3+ = +2</div>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <Label className="text-xs text-gray-600">Mod:</Label>
                          <Input
                            type="number"
                            value={currentCharacter?.staticValues?.resolveModifier || 0}
                            onChange={(e) => {
                              const value = Math.max(-5, Math.min(5, Number.parseInt(e.target.value) || 0))
                              updateCharacter({
                                staticValues: { ...currentCharacter.staticValues, resolveModifier: value },
                              })
                            }}
                            className="w-12 text-center text-xs"
                            min={-5}
                            max={5}
                          />
                        </div>
                      </div>

                      {/* Soak */}
                      <div className="space-y-2">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-600">{calculateSoak()}</div>
                          <div className="text-sm font-medium text-gray-700">Soak</div>
                        </div>
                        <div className="text-xs text-gray-500 text-center">
                          <div>1 + Physique + Armor</div>
                          <div>
                            Armor: +
                            {(currentCharacter?.armor || []).reduce(
                              (total: number, armor: any) => total + (Number.parseInt(armor.soak) || 0),
                              0,
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <Label className="text-xs text-gray-600">Mod:</Label>
                          <Input
                            type="number"
                            value={currentCharacter?.staticValues?.soakModifier || 0}
                            onChange={(e) => {
                              const value = Math.max(-5, Math.min(5, Number.parseInt(e.target.value) || 0))
                              updateCharacter({
                                staticValues: { ...currentCharacter.staticValues, soakModifier: value },
                              })
                            }}
                            className="w-12 text-center text-xs"
                            min={-5}
                            max={5}
                          />
                        </div>
                      </div>

                      {/* Hardness */}
                      <div className="space-y-2">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{calculateHardness()}</div>
                          <div className="text-sm font-medium text-gray-700">Hardness</div>
                        </div>
                        <div className="text-xs text-gray-500 text-center">
                          <div>Essence + 2 + Armor</div>
                          <div>
                            Armor: +
                            {(currentCharacter?.armor || []).reduce(
                              (total: number, armor: any) => total + (Number.parseInt(armor.hardness) || 0),
                              0,
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <Label className="text-xs text-gray-600">Mod:</Label>
                          <Input
                            type="number"
                            value={currentCharacter?.staticValues?.hardnessModifier || 0}
                            onChange={(e) => {
                              const value = Math.max(-5, Math.min(5, Number.parseInt(e.target.value) || 0))
                              updateCharacter({
                                staticValues: { ...currentCharacter.staticValues, hardnessModifier: value },
                              })
                            }}
                            className="w-12 text-center text-xs"
                            min={-5}
                            max={5}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Health Track */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Health Track
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium text-gray-600">Exalt Type:</Label>
                        <Select
                          value={currentCharacter?.health?.exaltType || "lunar"}
                          onValueChange={(value) =>
                            updateCharacter({
                              health: { ...currentCharacter.health, exaltType: value },
                            })
                          }
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lunar">Lunar</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium text-gray-600">Ox Body:</Label>
                        <Input
                          type="number"
                          value={currentCharacter?.health?.oxBodyLevels || 0}
                          onChange={(e) => {
                            const value = Math.max(0, Math.min(5, Number.parseInt(e.target.value) || 0))
                            updateCharacter({
                              health: { ...currentCharacter.health, oxBodyLevels: value },
                            })
                          }}
                          className="w-16 text-center"
                          min={0}
                          max={5}
                        />
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <div className="mb-4 p-3 bg-white rounded border">
                        <h3 className="font-semibold text-gray-700 mb-2">Health Levels</h3>
                        <div className="space-y-1 text-sm">
                          <div>
                            0: <span className="font-bold">{calculateHealthLevels().zero}</span>
                          </div>
                          <div>
                            -1: <span className="font-bold">{calculateHealthLevels().minusOne}</span>
                          </div>
                          <div>
                            -2: <span className="font-bold">{calculateHealthLevels().minusTwo}</span>
                          </div>
                          <div>
                            Incap: <span className="font-bold">{calculateHealthLevels().incap}</span>
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t">
                          <div>
                            Total: <span className="font-bold">{calculateHealthLevels().total}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4 p-3 bg-red-50 rounded border">
                        <h3 className="font-semibold text-red-700 mb-2">Current Penalty</h3>
                        <div className="text-2xl font-bold text-red-600 text-center">
                          {calculateHealthPenalty() === -99 ? "Incapacitated" : calculateHealthPenalty()}
                        </div>
                      </div>

                      <div className="p-3 bg-white rounded border">
                        <h3 className="font-semibold text-gray-700 mb-2">Damage Taken</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium text-gray-600">Bashing</Label>
                            <Input
                              type="number"
                              value={currentCharacter?.health?.bashingDamage || 0}
                              onChange={(e) => {
                                const value = Math.max(
                                  0,
                                  Math.min(calculateHealthLevels().total, Number.parseInt(e.target.value) || 0),
                                )
                                updateCharacter({
                                  health: { ...currentCharacter.health, bashingDamage: value },
                                })
                              }}
                              className="w-16 text-center"
                              min={0}
                              max={calculateHealthLevels().total}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium text-gray-600">Lethal</Label>
                            <Input
                              type="number"
                              value={currentCharacter?.health?.lethalDamage || 0}
                              onChange={(e) => {
                                const value = Math.max(
                                  0,
                                  Math.min(calculateHealthLevels().total, Number.parseInt(e.target.value) || 0),
                                )
                                updateCharacter({
                                  health: { ...currentCharacter.health, lethalDamage: value },
                                })
                              }}
                              className="w-16 text-center"
                              min={0}
                              max={calculateHealthLevels().total}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium text-gray-600">Aggravated</Label>
                            <Input
                              type="number"
                              value={currentCharacter?.health?.aggravatedDamage || 0}
                              onChange={(e) => {
                                const value = Math.max(
                                  0,
                                  Math.min(calculateHealthLevels().total, Number.parseInt(e.target.value) || 0),
                                )
                                updateCharacter({
                                  health: { ...currentCharacter.health, aggravatedDamage: value },
                                })
                              }}
                              className="w-16 text-center"
                              min={0}
                              max={calculateHealthLevels().total}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-700">Dramatic Injuries</h3>
                          <Button onClick={addDramaticInjury} size="sm" variant="outline">
                            <Plus className="w-4 h-4 mr-1" />
                            Add Injury
                          </Button>
                        </div>

                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {(currentCharacter?.health?.dramaticInjuries || []).map((injury: any) => (
                            <div
                              key={injury.id}
                              className={`p-2 rounded border flex items-center gap-2 ${
                                injury.healed ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                              }`}
                            >
                              <Input
                                type="text"
                                value={injury.description}
                                onChange={(e) => updateDramaticInjury(injury.id, "description", e.target.value)}
                                className="flex-1 text-sm"
                                placeholder="Injury description..."
                              />
                              <Button
                                onClick={() => updateDramaticInjury(injury.id, "healed", !injury.healed)}
                                size="sm"
                                variant={injury.healed ? "destructive" : "default"}
                              >
                                {injury.healed ? "Reopen" : "Heal"}
                              </Button>
                              <Button onClick={() => deleteDramaticInjury(injury.id)} size="sm" variant="outline">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                          {(currentCharacter?.health?.dramaticInjuries || []).length === 0 && (
                            <p className="text-gray-500 italic text-sm">No dramatic injuries recorded.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="equipment" className="space-y-6">
              {/* Armor */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Armor
                    <Button onClick={addArmor} size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Armor
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(currentCharacter?.armor || []).length === 0 ? (
                    <p className="text-gray-500 italic">No armor equipped.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="py-2 px-3 text-left">Name</th>
                            <th className="py-2 px-3 text-center">Type</th>
                            <th className="py-2 px-3 text-center">Soak</th>
                            <th className="py-2 px-3 text-center">Hardness</th>
                            <th className="py-2 px-3 text-center">Mobility</th>
                            <th className="py-2 px-3 text-left">Tags</th>
                            <th className="py-2 px-3 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(currentCharacter?.armor || []).map((armor: any) => (
                            <tr key={armor.id} className="border-b border-gray-200">
                              <td className="py-2 px-3">
                                <Input
                                  type="text"
                                  value={armor.name}
                                  onChange={(e) => updateArmor(armor.id, "name", e.target.value)}
                                  placeholder="Armor name..."
                                />
                              </td>
                              <td className="py-2 px-3">
                                <Select
                                  value={armor.type}
                                  onValueChange={(value) => updateArmor(armor.id, "type", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="light">Light</SelectItem>
                                    <SelectItem value="heavy">Heavy</SelectItem>
                                  </SelectContent>
                                </Select>
                              </td>
                              <td className="py-2 px-3">
                                <Input
                                  type="number"
                                  value={armor.soak}
                                  onChange={(e) => updateArmor(armor.id, "soak", Number.parseInt(e.target.value) || 0)}
                                  className="w-16 text-center"
                                  min={0}
                                />
                              </td>
                              <td className="py-2 px-3">
                                <Input
                                  type="number"
                                  value={armor.hardness}
                                  onChange={(e) =>
                                    updateArmor(armor.id, "hardness", Number.parseInt(e.target.value) || 0)
                                  }
                                  className="w-16 text-center"
                                  min={0}
                                />
                              </td>
                              <td className="py-2 px-3">
                                <Input
                                  type="number"
                                  value={armor.mobility}
                                  onChange={(e) =>
                                    updateArmor(armor.id, "mobility", Number.parseInt(e.target.value) || 0)
                                  }
                                  className="w-16 text-center"
                                />
                              </td>
                              <td className="py-2 px-3">
                                <Input
                                  type="text"
                                  value={armor.tags}
                                  onChange={(e) => updateArmor(armor.id, "tags", e.target.value)}
                                  placeholder="Tags..."
                                />
                              </td>
                              <td className="py-2 px-3 text-center">
                                <Button onClick={() => deleteArmor(armor.id)} size="sm" variant="destructive">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Weapons */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Weapons
                    <Button onClick={addWeapon} size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Weapon
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(currentCharacter?.weapons || []).length === 0 ? (
                    <p className="text-gray-500 italic">No weapons equipped.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="py-2 px-3 text-left">Name</th>
                            <th className="py-2 px-3 text-center">Accuracy</th>
                            <th className="py-2 px-3 text-center">Damage</th>
                            <th className="py-2 px-3 text-center">Defence</th>
                            <th className="py-2 px-3 text-center">Overwhelming</th>
                            <th className="py-2 px-3 text-center">Range</th>
                            <th className="py-2 px-3 text-left">Tags</th>
                            <th className="py-2 px-3 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(currentCharacter?.weapons || []).map((weapon: any) => (
                            <tr key={weapon.id} className="border-b border-gray-200">
                              <td className="py-2 px-3">
                                <Input
                                  type="text"
                                  value={weapon.name}
                                  onChange={(e) => updateWeapon(weapon.id, "name", e.target.value)}
                                  placeholder="Weapon name..."
                                />
                              </td>
                              <td className="py-2 px-3">
                                <Input
                                  type="number"
                                  value={weapon.accuracy}
                                  onChange={(e) =>
                                    updateWeapon(weapon.id, "accuracy", Number.parseInt(e.target.value) || 0)
                                  }
                                  className="w-16 text-center"
                                  min={0}
                                />
                              </td>
                              <td className="py-2 px-3">
                                <Input
                                  type="number"
                                  value={weapon.damage}
                                  onChange={(e) =>
                                    updateWeapon(weapon.id, "damage", Number.parseInt(e.target.value) || 0)
                                  }
                                  className="w-16 text-center"
                                  min={0}
                                />
                              </td>
                              <td className="py-2 px-3">
                                <Input
                                  type="number"
                                  value={weapon.defence}
                                  onChange={(e) =>
                                    updateWeapon(weapon.id, "defence", Number.parseInt(e.target.value) || 0)
                                  }
                                  className="w-16 text-center"
                                />
                              </td>
                              <td className="py-2 px-3">
                                <Input
                                  type="number"
                                  value={weapon.overwhelming}
                                  onChange={(e) =>
                                    updateWeapon(weapon.id, "overwhelming", Number.parseInt(e.target.value) || 0)
                                  }
                                  className="w-16 text-center"
                                  min={0}
                                />
                              </td>
                              <td className="py-2 px-3">
                                <Select
                                  value={weapon.range}
                                  onValueChange={(value) => updateWeapon(weapon.id, "range", value)}
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
                              </td>
                              <td className="py-2 px-3">
                                <Input
                                  type="text"
                                  value={weapon.tags}
                                  onChange={(e) => updateWeapon(weapon.id, "tags", e.target.value)}
                                  placeholder="Tags..."
                                />
                              </td>
                              <td className="py-2 px-3 text-center">
                                <Button onClick={() => deleteWeapon(weapon.id)} size="sm" variant="destructive">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tag References */}
              <Card>
                <CardHeader>
                  <CardTitle>Tag References</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {(() => {
                      const allTags = new Set<string>()
                      ;[...(currentCharacter?.armor || []), ...(currentCharacter?.weapons || [])].forEach((item) => {
                        if (item.tags) {
                          item.tags.split(",").forEach((tag: string) => {
                            const trimmed = tag.trim()
                            if (trimmed) allTags.add(trimmed)
                          })
                        }
                      })

                      return Array.from(allTags).length > 0 ? (
                        Array.from(allTags)
                          .sort()
                          .map((tag, index) => (
                            <div key={index} className="p-2 bg-white rounded border border-gray-200">
                              <span className="font-medium text-gray-700">{tag}:</span>
                              <span className="text-gray-600 ml-2">(Placeholder reference)</span>
                            </div>
                          ))
                      ) : (
                        <p className="text-gray-500 italic">No tags to reference.</p>
                      )
                    })()}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="powers" className="space-y-6">
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
                  {(currentCharacter?.charms || []).length === 0 ? (
                    <p className="text-gray-500 italic">No charms yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="py-2 px-3 text-left">Name</th>
                            <th className="py-2 px-3 text-center">Step</th>
                            <th className="py-2 px-3 text-center">Cost</th>
                            <th className="py-2 px-3 text-left">Description</th>
                            <th className="py-2 px-3 text-center">Page</th>
                            <th className="py-2 px-3 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(currentCharacter?.charms || []).map((charm: any) => (
                            <tr key={charm.id} className="border-b border-gray-200">
                              <td className="py-2 px-3">
                                <Input
                                  type="text"
                                  value={charm.name}
                                  onChange={(e) => updateCharm(charm.id, "name", e.target.value)}
                                  placeholder="Charm name..."
                                />
                              </td>
                              <td className="py-2 px-3">
                                <Select
                                  value={charm.step?.toString() || "none"}
                                  onValueChange={(value) =>
                                    updateCharm(charm.id, "step", value === "none" ? "none" : value)
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
                                      <SelectItem key={step} value={step.toString()}>
                                        {step}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </td>
                              <td className="py-2 px-3">
                                <Input
                                  type="text"
                                  value={charm.cost}
                                  onChange={(e) => updateCharm(charm.id, "cost", e.target.value)}
                                  placeholder="Cost..."
                                />
                              </td>
                              <td className="py-2 px-3">
                                <Textarea
                                  value={charm.description}
                                  onChange={(e) => updateCharm(charm.id, "description", e.target.value)}
                                  placeholder="Description..."
                                  rows={2}
                                  className="resize-none"
                                />
                              </td>
                              <td className="py-2 px-3">
                                <Input
                                  type="text"
                                  value={charm.pageReference || ""}
                                  onChange={(e) => updateCharm(charm.id, "pageReference", e.target.value)}
                                  className="w-20"
                                  placeholder="p.XX"
                                />
                              </td>
                              <td className="py-2 px-3 text-center">
                                <Button onClick={() => deleteCharm(charm.id)} size="sm" variant="destructive">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
                  {(currentCharacter?.spells || []).length === 0 ? (
                    <p className="text-gray-500 italic">No spells yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="py-2 px-3 text-left">Name</th>
                            <th className="py-2 px-3 text-center">Step</th>
                            <th className="py-2 px-3 text-center">Cost</th>
                            <th className="py-2 px-3 text-left">Description</th>
                            <th className="py-2 px-3 text-center">Page</th>
                            <th className="py-2 px-3 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(currentCharacter?.spells || []).map((spell: any) => (
                            <tr key={spell.id} className="border-b border-gray-200">
                              <td className="py-2 px-3">
                                <Input
                                  type="text"
                                  value={spell.name}
                                  onChange={(e) => updateSpell(spell.id, "name", e.target.value)}
                                  placeholder="Spell name..."
                                />
                              </td>
                              <td className="py-2 px-3">
                                <Select
                                  value={spell.step?.toString() || "none"}
                                  onValueChange={(value) =>
                                    updateSpell(spell.id, "step", value === "none" ? "none" : value)
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
                                      <SelectItem key={step} value={step.toString()}>
                                        {step}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </td>
                              <td className="py-2 px-3">
                                <Input
                                  type="text"
                                  value={spell.cost}
                                  onChange={(e) => updateSpell(spell.id, "cost", e.target.value)}
                                  placeholder="Cost..."
                                />
                              </td>
                              <td className="py-2 px-3">
                                <Textarea
                                  value={spell.description}
                                  onChange={(e) => updateSpell(spell.id, "description", e.target.value)}
                                  placeholder="Description..."
                                  rows={2}
                                  className="resize-none"
                                />
                              </td>
                              <td className="py-2 px-3">
                                <Input
                                  type="text"
                                  value={spell.pageReference || ""}
                                  onChange={(e) => updateSpell(spell.id, "pageReference", e.target.value)}
                                  className="w-20"
                                  placeholder="p.XX"
                                />
                              </td>
                              <td className="py-2 px-3 text-center">
                                <Button onClick={() => deleteSpell(spell.id)} size="sm" variant="destructive">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="socials" className="space-y-6">
              {/* Social Influence Reference */}
              <div className="bg-blue-50 rounded-lg p-4 text-xs text-blue-700">
                <div className="font-semibold mb-1">Social Influence Steps:</div>
                <div>Step 1: The player declares her intention for the influence.</div>
                <div>
                  Step 2: Form the dice pool for the action using an appropriate Attribute + Ability and adding any
                  modifiers.
                </div>
                <div>Step 3: The target determines if any Virtues or Intimacies adjust his Resolve.</div>
                <div>
                  Step 4: On success, the player utilizes extra successes to determine the extent of her influence
                  action on the target. The target may choose to resist the social influence.
                </div>
                <div className="mt-2 font-semibold">
                  Resolve Modifiers: Minor = ±2, Major = ±3. Minimum Resolve against social action = 1.
                </div>
              </div>

              {/* Resolve Display */}
              <Card>
                <CardHeader>
                  <CardTitle>Base Resolve</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{calculateResolve()}</div>
                      <div className="text-sm font-medium text-gray-700">Resolve</div>
                    </div>
                    <div className="text-xs text-gray-500 text-center">
                      <div>2 + Integrity bonuses</div>
                      <div>Integrity 1+ = +1, Integrity 3+ = +2</div>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <Label className="text-xs text-gray-600">Mod:</Label>
                      <Input
                        type="number"
                        value={currentCharacter?.staticValues?.resolveModifier || 0}
                        onChange={(e) => {
                          const value = Math.max(-5, Math.min(5, Number.parseInt(e.target.value) || 0))
                          updateCharacter({
                            staticValues: { ...currentCharacter.staticValues, resolveModifier: value },
                          })
                        }}
                        className="w-12 text-center text-xs"
                        min={-5}
                        max={5}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Virtues */}
              <Card>
                <CardHeader>
                  <CardTitle>Virtues</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Major Virtue */}
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Major Virtue</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {virtueOptions.map((virtue) => {
                        const isSelected = currentCharacter?.social?.virtues?.major === virtue
                        const isMinor = currentCharacter?.social?.virtues?.minor === virtue

                        return (
                          <Button
                            key={virtue}
                            onClick={() => !isMinor && setVirtue("major", isSelected ? null : virtue)}
                            disabled={isMinor}
                            variant={isSelected ? "default" : "outline"}
                            className={
                              isSelected
                                ? "bg-purple-600 hover:bg-purple-700"
                                : isMinor
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                            }
                          >
                            {virtue}
                          </Button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Minor Virtue */}
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Minor Virtue</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {virtueOptions.map((virtue) => {
                        const isSelected = currentCharacter?.social?.virtues?.minor === virtue
                        const isMajor = currentCharacter?.social?.virtues?.major === virtue

                        return (
                          <Button
                            key={virtue}
                            onClick={() => !isMajor && setVirtue("minor", isSelected ? null : virtue)}
                            disabled={isMajor}
                            variant={isSelected ? "default" : "outline"}
                            className={
                              isSelected
                                ? "bg-blue-600 hover:bg-blue-700"
                                : isMajor
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                            }
                          >
                            {virtue}
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Intimacies */}
              <Card>
                <CardHeader>
                  <CardTitle>Intimacies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Ties */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-700">Ties</h3>
                      <Button onClick={() => addIntimacy("Tie")} size="sm" variant="outline">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Tie
                      </Button>
                    </div>

                    {(currentCharacter?.social?.intimacies || []).filter((i: any) => i.type === "Tie").length === 0 ? (
                      <p className="text-gray-500 italic text-sm">No ties yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {(currentCharacter?.social?.intimacies || [])
                          .filter((i: any) => i.type === "Tie")
                          .map((intimacy: any) => (
                            <div key={intimacy.id} className="flex items-center gap-2">
                              <Input
                                type="text"
                                value={intimacy.intimacy}
                                onChange={(e) => updateIntimacy(intimacy.id, "intimacy", e.target.value)}
                                className="flex-1"
                                placeholder="Tie description..."
                              />
                              <Select
                                value={intimacy.strength}
                                onValueChange={(value) => updateIntimacy(intimacy.id, "strength", value)}
                              >
                                <SelectTrigger className="w-24">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Minor">Minor</SelectItem>
                                  <SelectItem value="Major">Major</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button onClick={() => deleteIntimacy(intimacy.id)} size="sm" variant="destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* Principles */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-700">Principles</h3>
                      <Button onClick={() => addIntimacy("Principle")} size="sm" variant="outline">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Principle
                      </Button>
                    </div>

                    {(currentCharacter?.social?.intimacies || []).filter((i: any) => i.type === "Principle").length ===
                    0 ? (
                      <p className="text-gray-500 italic text-sm">No principles yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {(currentCharacter?.social?.intimacies || [])
                          .filter((i: any) => i.type === "Principle")
                          .map((intimacy: any) => (
                            <div key={intimacy.id} className="flex items-center gap-2">
                              <Input
                                type="text"
                                value={intimacy.intimacy}
                                onChange={(e) => updateIntimacy(intimacy.id, "intimacy", e.target.value)}
                                className="flex-1"
                                placeholder="Principle description..."
                              />
                              <Select
                                value={intimacy.strength}
                                onValueChange={(value) => updateIntimacy(intimacy.id, "strength", value)}
                              >
                                <SelectTrigger className="w-24">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Minor">Minor</SelectItem>
                                  <SelectItem value="Major">Major</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button onClick={() => deleteIntimacy(intimacy.id)} size="sm" variant="destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advancement" className="space-y-6">
              {/* Milestone Budget */}
              <Card>
                <CardHeader>
                  <CardTitle>Milestone Budget</CardTitle>
                </CardHeader>
                <CardContent>
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 px-3 text-left">Type</th>
                        <th className="py-2 px-3 text-center">Personal</th>
                        <th className="py-2 px-3 text-center">Exalt</th>
                        <th className="py-2 px-3 text-center">Minor</th>
                        <th className="py-2 px-3 text-center">Major</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 px-3 font-medium">Accrued</td>
                        <td className="py-2 px-3">
                          <Input
                            type="number"
                            value={currentCharacter?.milestones?.personal || 0}
                            onChange={(e) => {
                              const value = Number.parseInt(e.target.value) || 0
                              updateCharacter({
                                milestones: { ...currentCharacter.milestones, personal: value },
                              })
                            }}
                            className={`text-center ${(currentCharacter?.milestones?.personal || 0) < 0 ? "text-red-600 border-red-300" : ""}`}
                          />
                        </td>
                        <td className="py-2 px-3">
                          <Input
                            type="number"
                            value={currentCharacter?.milestones?.exalt || 0}
                            onChange={(e) => {
                              const value = Number.parseInt(e.target.value) || 0
                              updateCharacter({
                                milestones: { ...currentCharacter.milestones, exalt: value },
                              })
                            }}
                            className={`text-center ${(currentCharacter?.milestones?.exalt || 0) < 0 ? "text-red-600 border-red-300" : ""}`}
                          />
                        </td>
                        <td className="py-2 px-3">
                          <Input
                            type="number"
                            value={currentCharacter?.milestones?.minor || 0}
                            onChange={(e) => {
                              const value = Number.parseInt(e.target.value) || 0
                              updateCharacter({
                                milestones: { ...currentCharacter.milestones, minor: value },
                              })
                            }}
                            className={`text-center ${(currentCharacter?.milestones?.minor || 0) < 0 ? "text-red-600 border-red-300" : ""}`}
                          />
                        </td>
                        <td className="py-2 px-3">
                          <Input
                            type="number"
                            value={currentCharacter?.milestones?.major || 0}
                            onChange={(e) => {
                              const value = Number.parseInt(e.target.value) || 0
                              updateCharacter({
                                milestones: { ...currentCharacter.milestones, major: value },
                              })
                            }}
                            className={`text-center ${(currentCharacter?.milestones?.major || 0) < 0 ? "text-red-600 border-red-300" : ""}`}
                          />
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 px-3 font-medium">Spent</td>
                        <td className="py-2 px-3 text-center font-bold text-blue-600">
                          {
                            (currentCharacter?.advancement || []).filter(
                              (entry: any) => entry.status === "Paid with Personal",
                            ).length
                          }
                        </td>
                        <td className="py-2 px-3 text-center font-bold text-purple-600">
                          {
                            (currentCharacter?.advancement || []).filter(
                              (entry: any) => entry.status === "Paid with Exalt",
                            ).length
                          }
                        </td>
                        <td className="py-2 px-3 text-center font-bold text-green-600">
                          {
                            (currentCharacter?.advancement || []).filter(
                              (entry: any) => entry.status === "Paid with Minor",
                            ).length
                          }
                        </td>
                        <td className="py-2 px-3 text-center font-bold text-red-600">
                          {
                            (currentCharacter?.advancement || []).filter(
                              (entry: any) => entry.status === "Paid with Major",
                            ).length
                          }
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium">Remaining</td>
                        <td className="py-2 px-3 text-center font-bold">
                          {(currentCharacter?.milestones?.personal || 0) -
                            (currentCharacter?.advancement || []).filter(
                              (entry: any) => entry.status === "Paid with Personal",
                            ).length}
                        </td>
                        <td className="py-2 px-3 text-center font-bold">
                          {(currentCharacter?.milestones?.exalt || 0) -
                            (currentCharacter?.advancement || []).filter(
                              (entry: any) => entry.status === "Paid with Exalt",
                            ).length}
                        </td>
                        <td className="py-2 px-3 text-center font-bold">
                          {(currentCharacter?.milestones?.minor || 0) -
                            (currentCharacter?.advancement || []).filter(
                              (entry: any) => entry.status === "Paid with Minor",
                            ).length}
                        </td>
                        <td className="py-2 px-3 text-center font-bold">
                          {(currentCharacter?.milestones?.major || 0) -
                            (currentCharacter?.advancement || []).filter(
                              (entry: any) => entry.status === "Paid with Major",
                            ).length}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="mt-2 text-sm text-gray-600">
                    Planned Advancements:{" "}
                    <span className="font-bold">
                      {(currentCharacter?.advancement || []).filter((entry: any) => entry.status === "Planned").length}
                    </span>
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
                      {showAdvancementLog ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                      Advancement Log ({(currentCharacter?.advancement || []).length} entries)
                    </button>
                    <Button onClick={addAdvancementEntry} size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Entry
                    </Button>
                  </CardTitle>
                </CardHeader>
                {showAdvancementLog && (
                  <CardContent>
                    {(currentCharacter?.advancement || []).length === 0 ? (
                      <p className="text-gray-500 italic">No advancement entries yet.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="py-2 px-3 text-left">Item</th>
                              <th className="py-2 px-3 text-center">Status</th>
                              <th className="py-2 px-3 text-center">Date</th>
                              <th className="py-2 px-3 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(currentCharacter?.advancement || []).map((entry: any) => (
                              <tr key={entry.id} className="border-b border-gray-200">
                                <td className="py-2 px-3">
                                  <Input
                                    type="text"
                                    value={entry.item}
                                    onChange={(e) => updateAdvancementEntry(entry.id, "item", e.target.value)}
                                    placeholder="Advancement item..."
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <Select
                                    value={entry.status}
                                    onValueChange={(value) => updateAdvancementEntry(entry.id, "status", value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Planned">Planned</SelectItem>
                                      <SelectItem value="Paid with Personal">Paid with Personal</SelectItem>
                                      <SelectItem value="Paid with Exalt">Paid with Exalt</SelectItem>
                                      <SelectItem value="Paid with Minor">Paid with Minor</SelectItem>
                                      <SelectItem value="Initial">Initial</SelectItem>
                                      <SelectItem value="Paid with Major">Paid with Major</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </td>
                                <td className="py-2 px-3 text-center text-sm text-gray-600">{entry.timestamp}</td>
                                <td className="py-2 px-3 text-center">
                                  <Button
                                    onClick={() => deleteAdvancementEntry(entry.id)}
                                    size="sm"
                                    variant="destructive"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="rulings" className="space-y-6">
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
                  {(currentCharacter?.rulings || []).length === 0 ? (
                    <p className="text-gray-500 italic">No rulings recorded yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {(currentCharacter?.rulings || []).map((ruling: any) => (
                        <div
                          key={ruling.id}
                          className="flex items-start gap-2 p-3 bg-white rounded border border-gray-200"
                        >
                          <Textarea
                            value={ruling.text}
                            onChange={(e) => updateRuling(ruling.id, e.target.value)}
                            className="flex-1 resize-none"
                            placeholder="Enter ruling text..."
                            rows={2}
                          />
                          <div className="text-xs text-gray-500 whitespace-nowrap pt-1">{ruling.date}</div>
                          <Button onClick={() => deleteRuling(ruling.id)} size="sm" variant="destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wip" className="space-y-6">
              <div className="bg-yellow-50 rounded-lg p-4 text-sm text-yellow-800">
                <div className="font-semibold mb-1">Work In Progress</div>
                <div>This tab contains experimental features that are still being developed.</div>
              </div>

              {/* Combat Steps Guide */}
              <Card>
                <CardHeader>
                  <CardTitle>Combat Turn Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        step: 1,
                        defaultActions: ["Move", "Decisive Attack", "Withering Attack", "Activate Excellence"],
                      },
                      { step: 2, defaultActions: [] },
                      { step: 3, defaultActions: [] },
                      { step: 4, defaultActions: [] },
                      { step: 5, defaultActions: [] },
                      { step: 6, defaultActions: [] },
                      { step: 7, defaultActions: [] },
                      { step: 8, defaultActions: [] },
                    ].map((step) => (
                      <div key={step.step} className="p-3 bg-white rounded border border-gray-200">
                        <h3 className="font-semibold text-gray-700 mb-2">Step {step.step}</h3>
                        <div className="space-y-1">
                          {step.defaultActions.map((action, index) => (
                            <div key={index} className="text-sm text-gray-600">
                              • {action}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-xs text-gray-500">
                    Note: This component will eventually allow dynamic addition of available actions per step based on
                    character abilities and current combat situation.
                  </div>
                </CardContent>
              </Card>
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

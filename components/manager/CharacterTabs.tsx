"use client"

import { useState } from "react"
import { User, Swords, Shield, BookOpen, Users, TrendingUp, Scroll } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RulingsTab } from "@/components/character-tabs/RulingsTab"
import { PowersTab } from "@/components/character-tabs/PowersTab"
import { SocialTab } from "@/components/character-tabs/SocialTab"
import { EquipmentTab } from "@/components/character-tabs/EquipmentTab"
import { AdvancementTab } from "@/components/character-tabs/AdvancementTab"
import { CombatTab } from "@/components/character-tabs/CombatTab"
import { CoreStatsTab } from "@/components/character-tabs/CoreStatsTab"
import type { Character, AttributeType, AbilityType } from "@/lib/character-types"

import type { useCharacterCalculations } from "@/hooks/useCharacterCalculations"

interface CharacterTabsProps {
  currentCharacter: Character
  updateCharacter: (updates: Partial<Character>) => void
  calculations: ReturnType<typeof useCharacterCalculations>
  calculateAbilityTotal: (ability: AbilityType) => number
  calculateDicePool: () => {
    basePool: number
    extraDice: number
    totalPool: number
    cappedBonusDice: number
    actionPhrase: string
  }
  globalAbilityAttribute: AttributeType | "none"
  setGlobalAbilityAttribute: (attribute: AttributeType | "none") => void
  calculateSoak: () => number
  calculateHardness: () => number
  calculateResolve: () => number
}

const CharacterTabs = ({
  currentCharacter,
  updateCharacter,
  calculations,
  calculateAbilityTotal,
  calculateDicePool,
  globalAbilityAttribute,
  setGlobalAbilityAttribute,
  calculateSoak,
  calculateHardness,
  calculateResolve,
}: CharacterTabsProps) => {
  const [activeTab, setActiveTab] = useState("core")

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
  )
}

export default CharacterTabs

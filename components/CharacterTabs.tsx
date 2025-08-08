"use client";

import { User, Swords, Shield, BookOpen, TrendingUp, Users, Scroll } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Character, AttributeType, AbilityType } from "@/lib/character-types";
import { CoreStatsTab } from "@/components/character-tabs/CoreStatsTab";
import { CombatTab } from "@/components/character-tabs/CombatTab";
import { EquipmentTab } from "@/components/character-tabs/EquipmentTab";
import { PowersTab } from "@/components/character-tabs/PowersTab";
import { SocialTab } from "@/components/character-tabs/SocialTab";
import { AdvancementTab } from "@/components/character-tabs/AdvancementTab";
import { RulingsTab } from "@/components/character-tabs/RulingsTab";
import type { CharacterCalculations } from "@/hooks/useCharacterCalculations";
import type React from "react";

interface CharacterTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  character: Character;
  updateCharacter: (updates: Partial<Character>) => void;
  calculations: CharacterCalculations;
  calculateSoak: () => number;
  calculateHardness: () => number;
  calculateAbilityTotal: (abilityKey: AbilityType) => number;
  calculateDicePool: () => {
    basePool: number;
    extraDice: number;
    totalPool: number;
    cappedBonusDice: number;
    actionPhrase: string;
  };
  globalAbilityAttribute: AttributeType | "none";
  setGlobalAbilityAttribute: (attr: AttributeType | "none") => void;
  resolve: number;
}

export function CharacterTabs({
  activeTab,
  onTabChange,
  character,
  updateCharacter,
  calculations,
  calculateSoak,
  calculateHardness,
  calculateAbilityTotal,
  calculateDicePool,
  globalAbilityAttribute,
  setGlobalAbilityAttribute,
  resolve,
}: CharacterTabsProps) {
  const tabs = [
    { id: "core", label: "Core Stats", icon: User },
    { id: "combat", label: "Combat", icon: Swords },
    { id: "equipment", label: "Equipment", icon: Shield },
    { id: "powers", label: "Powers", icon: BookOpen },
    { id: "socials", label: "Socials", icon: Users },
    { id: "advancement", label: "Advancement", icon: TrendingUp },
    { id: "rulings", label: "Rulings", icon: Scroll },
  ];

  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-1">
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>

      <TabsContent value="core" className="space-y-6">
        <CoreStatsTab
          character={character}
          updateCharacter={updateCharacter}
          calculateAbilityTotal={calculateAbilityTotal}
          calculateDicePool={calculateDicePool}
          globalAbilityAttribute={globalAbilityAttribute}
          setGlobalAbilityAttribute={setGlobalAbilityAttribute}
        />
      </TabsContent>

      <TabsContent value="combat" className="space-y-6">
        <CombatTab
          character={character}
          updateCharacter={updateCharacter}
          calculations={calculations}
          calculateSoak={calculateSoak}
          calculateHardness={calculateHardness}
        />
      </TabsContent>

      <TabsContent value="equipment" className="space-y-6">
        <EquipmentTab character={character} updateCharacter={updateCharacter} />
      </TabsContent>

      <TabsContent value="powers" className="space-y-6">
        <PowersTab character={character} updateCharacter={updateCharacter} />
      </TabsContent>

      <TabsContent value="socials" className="space-y-6">
        <SocialTab character={character} updateCharacter={updateCharacter} resolve={resolve} />
      </TabsContent>

      <TabsContent value="advancement" className="space-y-6">
        <AdvancementTab character={character} updateCharacter={updateCharacter} />
      </TabsContent>

      <TabsContent value="rulings" className="space-y-6">
        <RulingsTab character={character} updateCharacter={updateCharacter} />
      </TabsContent>
    </Tabs>
  );
}

export default CharacterTabs;

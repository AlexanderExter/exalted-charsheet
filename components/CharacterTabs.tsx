"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Character, AttributeType, AbilityType } from "@/lib/character-types";
import type { CharacterCalculations } from "@/hooks/useCharacterCalculations";
import tabs from "@/components/character-tabs/tabs-config";
import type React from "react";

interface CharacterTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  character: Character;
  updateCharacter: (updates: Partial<Character>) => void;
  calculations: CharacterCalculations;
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
  calculateAbilityTotal,
  calculateDicePool,
  globalAbilityAttribute,
  setGlobalAbilityAttribute,
  resolve,
}: CharacterTabsProps) {
  const extraProps = {
    calculateAbilityTotal,
    calculateDicePool,
    globalAbilityAttribute,
    setGlobalAbilityAttribute,
    calculations,
    resolve,
  };

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

      {tabs.map(tab => {
        const TabComponent = tab.component;
        const tabProps = tab.componentProps?.reduce(
          (acc, key) => {
            (acc as any)[key] = (extraProps as any)[key];
            return acc;
          },
          {} as Record<string, unknown>,
        );

        return (
          <TabsContent key={tab.id} value={tab.id} className="space-y-6">
            <TabComponent character={character} updateCharacter={updateCharacter} {...tabProps} />
          </TabsContent>
        );
      })}
    </Tabs>
  );
}

export default CharacterTabs;

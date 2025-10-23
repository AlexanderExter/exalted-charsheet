"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabErrorBoundary } from "@/components/common/TabErrorBoundary";
import tabs from "@/components/character-tabs/tabsConfig";

interface CharacterTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function CharacterTabs({ activeTab, onTabChange }: CharacterTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-8">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-1">
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>

      {tabs.map(tab => {
        const TabComponent = tab.component;
        return (
          <TabsContent key={tab.id} value={tab.id} className="space-y-6">
            <TabErrorBoundary tabName={tab.label}>
              <TabComponent />
            </TabErrorBoundary>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}

export default CharacterTabs;

"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ErrorBoundary } from "@/components/ErrorBoundary";
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
            <ErrorBoundary compact title={tab.label}>
              <TabComponent />
            </ErrorBoundary>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}

export default CharacterTabs;

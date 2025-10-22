"use client";

// Core Stats Tab Component - Essence, attributes, abilities, and dice pool calculator

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { calculateStatTotal } from "@/lib/exalted-utils";
import { StatTable } from "@/components/forms/StatTable";
import { attributeConfig, abilityConfig } from "@/lib/stat-config";
import { DicePoolEditor } from "@/components/forms/DicePoolEditor";
import { EssencePanel } from "@/components/character-tabs/common/EssencePanel";
import { createDefaultEssence } from "@/lib/character-defaults";
import { useCharacterContext } from "@/hooks/CharacterContext";
export const CoreStatsTab: React.FC = React.memo(() => {
  const {
    character,
    updateCharacter,
    calculateAbilityTotal,
    calculateDicePool,
    globalAbilityAttribute,
    setGlobalAbilityAttribute,
  } = useCharacterContext();

  const abilityTotalColor =
    globalAbilityAttribute === "fortitude"
      ? "text-success"
      : globalAbilityAttribute === "finesse"
        ? "text-info"
        : globalAbilityAttribute === "force"
          ? "text-destructive"
          : "text-foreground/80";

  return (
    <div className="space-y-6">
      <EssencePanel
        essence={character.essence || createDefaultEssence()}
        onChange={essence => updateCharacter({ essence })}
      />

      {/* Attributes and Abilities */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Attributes</CardTitle>
          </CardHeader>
          <CardContent>
            <StatTable
              config={attributeConfig}
              stats={character.attributes}
              onChange={(key, stat) =>
                updateCharacter({
                  attributes: { ...character.attributes, [key]: stat },
                })
              }
              getTotal={key => calculateStatTotal(character.attributes[key])}
              minBase={1}
            />
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
                        ? "bg-success hover:bg-success"
                        : "text-success border-success hover:bg-success/10"
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
                        ? "bg-info hover:bg-info"
                        : "text-info border-info hover:bg-info/10"
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
                        ? "bg-destructive hover:bg-destructive"
                        : "text-destructive border-destructive hover:bg-destructive/10"
                    }
                  >
                    Force
                  </Button>
                </div>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StatTable
              config={abilityConfig}
              stats={character.abilities}
              onChange={(key, stat) =>
                updateCharacter({
                  abilities: { ...character.abilities, [key]: stat },
                })
              }
              getTotal={calculateAbilityTotal}
              minBase={0}
              scrollable
              totalColorClass={abilityTotalColor}
            />
          </CardContent>
        </Card>
      </div>

      {/* Roll Assembler */}
      <DicePoolEditor />
    </div>
  );
});

CoreStatsTab.displayName = "CoreStatsTab";

export default CoreStatsTab;

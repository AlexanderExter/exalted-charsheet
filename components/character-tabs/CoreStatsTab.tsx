"use client";

// Core Stats Tab Component - Essence, attributes, abilities, and dice pool calculator

import React, { useCallback, useMemo, useRef, useEffect } from "react";
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
import type { AttributeType, AbilityType, StatBlock, Essence } from "@/lib/character-types";

export const CoreStatsTab: React.FC = React.memo(() => {
  const {
    character,
    updateCharacter,
    calculateAbilityTotal,
    calculateDicePool,
    globalAbilityAttribute,
    setGlobalAbilityAttribute,
  } = useCharacterContext();

  // Use ref to track latest character without causing re-renders
  const characterRef = useRef(character);
  useEffect(() => {
    characterRef.current = character;
  });

  // Memoize onChange callbacks to prevent StatTable column recalculation
  // These callbacks access character via ref to avoid recreating on every character update
  // This prevents infinite re-render loops while ensuring callbacks always use latest data
  const handleAttributeChange = useCallback((key: AttributeType, stat: StatBlock) => {
    updateCharacter({
      attributes: { ...characterRef.current.attributes, [key]: stat },
    });
  }, [updateCharacter]);

  const handleAbilityChange = useCallback((key: AbilityType, stat: StatBlock) => {
    updateCharacter({
      abilities: { ...characterRef.current.abilities, [key]: stat },
    });
  }, [updateCharacter]);

  const getAttributeTotal = useCallback(
    (key: AttributeType) => calculateStatTotal(characterRef.current.attributes[key]),
    []
  );

  const handleEssenceChange = useCallback(
    (essence: Essence) => updateCharacter({ essence }),
    [updateCharacter]
  );

  const abilityTotalColor =
    globalAbilityAttribute === "fortitude"
      ? "text-green-600"
      : globalAbilityAttribute === "finesse"
        ? "text-blue-600"
        : globalAbilityAttribute === "force"
          ? "text-red-600"
          : "text-gray-700";

  return (
    <div className="space-y-6">
      <EssencePanel
        essence={character.essence || createDefaultEssence()}
        onChange={handleEssenceChange}
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
              onChange={handleAttributeChange}
              getTotal={getAttributeTotal}
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
            <StatTable
              config={abilityConfig}
              stats={character.abilities}
              onChange={handleAbilityChange}
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

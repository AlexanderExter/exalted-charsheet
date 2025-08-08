// Core Stats Tab Component - Essence, attributes, abilities, and dice pool calculator

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { EssenceEditor } from "@/components/EssenceEditor";
import { Badge } from "@/components/ui/badge";
import type { Character, AttributeType, AbilityType } from "@/lib/character-types";
import { getAnimaLevel, getActiveAnimaRulings, calculateStatTotal } from "@/lib/exalted-utils";
import { StatTable } from "@/components/forms/StatTable";
import { attributeConfig, abilityConfig } from "@/lib/stat-config";
import { DicePoolEditor } from "@/components/forms/DicePoolEditor";

interface CoreStatsTabProps {
  character: Character | null;
  updateCharacter: (updates: Partial<Character>) => void;
  calculateAbilityTotal: (abilityKey: AbilityType) => number;
  calculateDicePool: () => {
    basePool: number;
    extraDice: number;
    totalPool: number;
    cappedBonusDice: number;
    actionPhrase: string;
  };
  globalAbilityAttribute: AttributeType | "none";
  setGlobalAbilityAttribute: (attribute: AttributeType | "none") => void;
}

export const CoreStatsTab: React.FC<CoreStatsTabProps> = React.memo(
  ({
    character,
    updateCharacter,
    calculateAbilityTotal,
    calculateDicePool,
    globalAbilityAttribute,
    setGlobalAbilityAttribute,
  }) => {
    if (!character) {
      return (
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-500 italic">No character selected.</p>
            </CardContent>
          </Card>
        </div>
      );
    }

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
        {/* Essence */}
        <Card>
          <CardHeader>
            <CardTitle>Essence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <EssenceEditor
                essence={
                  character.essence || {
                    rating: 1,
                    motes: 5,
                    commitments: 0,
                    spent: 0,
                    anima: 0,
                  }
                }
                onChange={essence => updateCharacter({ essence })}
              />

              <div className="space-y-4">
                {/* Anima Slider */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Anima Level</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>Dim</span>
                      <span>Burning</span>
                      <span>Bonfire</span>
                      <span>Iconic</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="1"
                      value={character.essence?.anima || 0}
                      onChange={e => {
                        const value = Number.parseInt(e.target.value);
                        updateCharacter({
                          essence: { ...character.essence, anima: value },
                        });
                      }}
                      className={`w-full h-3 rounded-lg appearance-none cursor-pointer slider ${
                        (character?.essence?.anima || 0) <= 4
                          ? "slider-dim"
                          : (character?.essence?.anima || 0) <= 6
                            ? "slider-burning"
                            : (character?.essence?.anima || 0) <= 9
                              ? "slider-bonfire"
                              : "slider-iconic"
                      }`}
                      style={{
                        background: `linear-gradient(to right,
                        ${
                          (character?.essence?.anima || 0) <= 4
                            ? "#9ca3af"
                            : (character?.essence?.anima || 0) <= 6
                              ? "#f97316"
                              : (character?.essence?.anima || 0) <= 9
                                ? "#ef4444"
                                : "#9333ea"
                        } 0%,
                        ${
                          (character?.essence?.anima || 0) <= 4
                            ? "#9ca3af"
                            : (character?.essence?.anima || 0) <= 6
                              ? "#f97316"
                              : (character?.essence?.anima || 0) <= 9
                                ? "#ef4444"
                                : "#9333ea"
                        } ${((character?.essence?.anima || 0) / 10) * 100}%,
                        #e5e7eb ${((character?.essence?.anima || 0) / 10) * 100}%,
                        #e5e7eb 100%)`,
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0</span>
                      <span>4</span>
                      <span>6</span>
                      <span>9</span>
                      <span>10</span>
                    </div>
                    <div className="text-center">
                      <span className="text-lg font-bold text-purple-600">
                        {character?.essence?.anima || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Anima Level and Rulings */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-purple-600">Anima Level</span>
                    <Badge variant="outline" className="text-purple-600">
                      {getAnimaLevel(character?.essence?.anima || 0)}
                    </Badge>
                  </div>
                  {getActiveAnimaRulings(character?.essence?.anima || 0).length > 0 && (
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-purple-700 mb-2">
                        Active Effects:
                      </div>
                      {getActiveAnimaRulings(character?.essence?.anima || 0).map(
                        (ruling, index) => (
                          <div key={index} className="text-sm text-purple-600">
                            • {ruling}
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>

                {/* Exalt Type Rules Placeholder */}
                <div className="space-y-2">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      Exalt Type Rules:
                    </div>
                    <div className="text-sm text-gray-600">
                      [Placeholder: Exalt-specific rules and abilities will be displayed here based on character type]
                    </div>
                  </div>
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
        <DicePoolEditor
          character={character}
          updateCharacter={updateCharacter}
          calculateDicePool={calculateDicePool}
        />
      </div>
    );
  },
);

CoreStatsTab.displayName = "CoreStatsTab";

export default CoreStatsTab;

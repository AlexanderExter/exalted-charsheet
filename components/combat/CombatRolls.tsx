"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Character, AttributeType, AbilityType } from "@/lib/character-types";
import { calculateStatTotal } from "@/lib/exalted-utils";
import { DEFAULT_MODIFIER_MAX, DEFAULT_MODIFIER_MIN } from "@/lib/character-defaults";
import { attributeConfig, abilityConfig } from "@/lib/stat-config";

interface CombatRollsProps {
  character: Character;
  updateCharacter: (updates: Partial<Character>) => void;
  highestAttribute: number;
}

export const CombatRolls: React.FC<CombatRollsProps> = ({
  character,
  updateCharacter,
  highestAttribute,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Combat Rolls</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          {/* Join Battle */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground/80">Join Battle</h3>
            <div className="p-3 bg-white rounded border space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Attribute</Label>
                  <Select
                    value={character?.combat?.joinBattleAttribute || ""}
                    onValueChange={(value: AttributeType) => {
                      updateCharacter({
                        combat: { ...character.combat, joinBattleAttribute: value },
                      });
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select attribute" />
                    </SelectTrigger>
                    <SelectContent>
                      {attributeConfig.map(attr => (
                        <SelectItem key={attr.key} value={attr.key}>
                          {attr.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Ability</Label>
                  <Select
                    value={character?.combat?.joinBattleAbility || ""}
                    onValueChange={(value: AbilityType) => {
                      updateCharacter({
                        combat: { ...character.combat, joinBattleAbility: value },
                      });
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select ability" />
                    </SelectTrigger>
                    <SelectContent>
                      {abilityConfig.map(ability => (
                        <SelectItem key={ability.key} value={ability.key}>
                          {ability.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Extra Dice</Label>
                  <Input
                    type="number"
                    value={character?.combat?.joinBattleDiceBonus || 0}
                    onChange={e => {
                      const value = Math.max(
                        -10,
                        Math.min(10, Number.parseInt(e.target.value) || 0)
                      );
                      updateCharacter({
                        combat: { ...character.combat, joinBattleDiceBonus: value },
                      });
                    }}
                    className="w-full text-center"
                    min={-10}
                    max={10}
                  />
                  <div className="text-xs text-muted-foreground/70">±10 cap</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Extra Success</Label>
                  <Input
                    type="number"
                    value={character?.combat?.joinBattleSuccessBonus || 0}
                    onChange={e => {
                      const value = Math.max(
                        DEFAULT_MODIFIER_MIN,
                        Math.min(DEFAULT_MODIFIER_MAX, Number.parseInt(e.target.value) || 0)
                      );
                      updateCharacter({
                        combat: { ...character.combat, joinBattleSuccessBonus: value },
                      });
                    }}
                    className="w-full text-center"
                    min={DEFAULT_MODIFIER_MIN}
                    max={DEFAULT_MODIFIER_MAX}
                  />
                  <div className="text-xs text-muted-foreground/70">±5 cap</div>
                </div>
              </div>
              {character?.combat?.joinBattleAttribute && character?.combat?.joinBattleAbility && (
                <div className="text-center p-2 bg-info/20 rounded">
                  <div className="text-lg font-bold text-info">
                    Roll{" "}
                    {calculateStatTotal(
                      character.attributes[character.combat.joinBattleAttribute]
                    ) +
                      calculateStatTotal(
                        character.abilities[character.combat.joinBattleAbility]
                      ) +
                      (character?.combat?.joinBattleDiceBonus || 0)}
                    {(character?.combat?.joinBattleSuccessBonus || 0) !== 0 &&
                      `, ${
                        character?.combat?.joinBattleSuccessBonus > 0 ? "+" : ""
                      }${character?.combat?.joinBattleSuccessBonus} success`}
                    , TN 7 Double 10s
                  </div>
                  <div className="text-sm text-info">Join Battle</div>
                </div>
              )}
            </div>
          </div>

          {/* Power Tracker */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground/80">Power Tracker</h3>
            <div className="p-3 bg-white rounded border space-y-3">
              <div className="text-sm text-muted-foreground">Track power gained from attacks</div>
              {character?.weapons && character.weapons.length > 0 && (
                <div>
                  <Label className="text-xs text-muted-foreground">Selected Weapon</Label>
                  <Select
                    value={character?.combat?.selectedWeaponId || ""}
                    onValueChange={(value: string) => {
                      updateCharacter({
                        combat: { ...character.combat, selectedWeaponId: value },
                      });
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select weapon" />
                    </SelectTrigger>
                    <SelectContent>
                      {character.weapons.map(weapon => (
                        <SelectItem key={weapon.id} value={weapon.id}>
                          {weapon.name} (Acc+{weapon.accuracy}, Dmg+{weapon.damage})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex items-center justify-center gap-4">
                <Button
                  onClick={() =>
                    updateCharacter({
                      combat: {
                        ...character.combat,
                        power: Math.max(0, (character?.combat?.power || 0) - 1),
                      },
                    })
                  }
                  variant="outline"
                >
                  -1
                </Button>
                <div className="w-16 h-12 flex items-center justify-center border rounded bg-muted/50">
                  <span className="text-xl font-bold text-foreground/80">
                    {character?.combat?.power || 0}
                  </span>
                </div>
                <Button
                  onClick={() =>
                    updateCharacter({
                      combat: { ...character.combat, power: (character?.combat?.power || 0) + 1 },
                    })
                  }
                  variant="outline"
                >
                  +1
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

CombatRolls.displayName = "CombatRolls";

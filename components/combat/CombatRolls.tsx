"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Character } from "@/lib/character-types";
import { calculateStatTotal } from "@/lib/exalted-utils";
import { DEFAULT_MODIFIER_MAX, DEFAULT_MODIFIER_MIN } from "@/lib/character-defaults";

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
            <div className="p-3 bg-white rounded border">
              <div className="text-sm text-muted-foreground mb-3">
                Best Attribute + Best of Close/Ranged Combat + Modifiers
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
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
              <div className="text-center p-2 bg-info/20 rounded">
                <div className="text-lg font-bold text-info">
                  Roll{" "}
                  {highestAttribute +
                    Math.max(
                      calculateStatTotal(
                        character?.abilities?.closeCombat || { base: 0, added: 0, bonus: 0 }
                      ),
                      calculateStatTotal(
                        character?.abilities?.rangedCombat || { base: 0, added: 0, bonus: 0 }
                      )
                    ) +
                    (character?.combat?.joinBattleDiceBonus || 0)}
                  {(character?.combat?.joinBattleSuccessBonus || 0) !== 0 &&
                    `, ${
                      character?.combat?.joinBattleSuccessBonus > 0 ? "+" : ""
                    }${character?.combat?.joinBattleSuccessBonus} success in`}
                  , TN 7 Double 10s
                </div>
                <div className="text-sm text-info">Join Battle</div>
              </div>
            </div>
          </div>

          {/* Power Tracker */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground/80">Power Tracker</h3>
            <div className="p-3 bg-white rounded border space-y-3">
              <div className="text-sm text-muted-foreground mb-2">Track power gained from attacks</div>
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

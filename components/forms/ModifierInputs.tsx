"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DEFAULT_MODIFIER_MAX } from "@/lib/character-defaults";
import { useCharacterContext } from "@/hooks/CharacterContext";
import type { DicePool } from "@/lib/character-types";

export const ModifierInputs: React.FC = () => {
  const { character, updateCharacter } = useCharacterContext();
  const pool = character.dicePool;

  const updateField = (field: keyof DicePool, value: number | boolean) => {
    updateCharacter({ dicePool: { ...pool, [field]: value } });
  };

  return (
    <div>
      <h3 className="font-semibold text-foreground/80 mb-3">Modifiers</h3>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="block text-sm font-medium text-muted-foreground mb-1">
              Target Number
            </Label>
            <Input
              type="number"
              className="text-center"
              min={1}
              max={10}
              value={pool.targetNumber}
              onChange={e => updateField("targetNumber", Number(e.target.value))}
            />
          </div>
          <div className="space-y-1">
            <Label className="block text-sm font-medium text-muted-foreground mb-1">
              Doubles Threshold
            </Label>
            <Input
              type="number"
              className="text-center"
              min={1}
              max={10}
              value={pool.doublesThreshold}
              onChange={e => updateField("doublesThreshold", Number(e.target.value))}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="block text-sm font-medium text-muted-foreground mb-1">
              Extra Dice (Bonus)
            </Label>
            <Input
              type="number"
              className="text-center"
              min={0}
              max={10}
              value={pool.extraDiceBonus}
              onChange={e => updateField("extraDiceBonus", Number(e.target.value))}
            />
            <div className="text-xs text-muted-foreground/80 mt-1">Max: 10</div>
          </div>
          <div className="space-y-1">
            <Label className="block text-sm font-medium text-muted-foreground mb-1">
              Extra Dice (Non-Bonus)
            </Label>
            <Input
              type="number"
              className="text-center"
              min={0}
              value={pool.extraDiceNonBonus}
              onChange={e => updateField("extraDiceNonBonus", Number(e.target.value))}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="block text-sm font-medium text-muted-foreground mb-1">
              Extra Success (Bonus)
            </Label>
            <Input
              type="number"
              className="text-center"
              min={0}
              max={DEFAULT_MODIFIER_MAX}
              value={pool.extraSuccessBonus}
              onChange={e => updateField("extraSuccessBonus", Number(e.target.value))}
            />
            <div className="text-xs text-muted-foreground/80 mt-1">Max: {DEFAULT_MODIFIER_MAX}</div>
          </div>
          <div className="space-y-1">
            <Label className="block text-sm font-medium text-muted-foreground mb-1">
              Extra Success (Non-Bonus)
            </Label>
            <Input
              type="number"
              className="text-center"
              min={0}
              value={pool.extraSuccessNonBonus}
              onChange={e => updateField("extraSuccessNonBonus", Number(e.target.value))}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Checkbox
            checked={pool.isStunted}
            onCheckedChange={checked => updateField("isStunted", checked === true)}
          />
          <Label className="text-sm font-medium text-foreground/80">
            Stunt (+2 dice, non-capped)
          </Label>
        </div>
      </div>
    </div>
  );
};

export default ModifierInputs;

"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { calculateStatTotal } from "@/lib/exalted-utils";
import { useCharacterContext } from "@/hooks/CharacterContext";
import type { AbilityType } from "@/lib/character-types";

export const AbilitySelector: React.FC = () => {
  const { character, updateCharacter } = useCharacterContext();
  const selected = character.dicePool.ability;

  const handleChange = (value: string) => {
    updateCharacter({ dicePool: { ...character.dicePool, ability: value as AbilityType } });
  };

  return (
    <div className="space-y-1">
      <Label className="block text-sm font-medium text-muted-foreground mb-1">Ability</Label>
      <Select onValueChange={handleChange} value={selected}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(character?.abilities || {}).map(ability => (
            <SelectItem key={ability} value={ability}>
              {ability.charAt(0).toUpperCase() + ability.slice(1).replace(/([A-Z])/g, " $1")} (
              {calculateStatTotal(
                character?.abilities?.[ability as keyof typeof character.abilities] || {
                  base: 0,
                  added: 0,
                  bonus: 0,
                }
              )}
              )
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default AbilitySelector;

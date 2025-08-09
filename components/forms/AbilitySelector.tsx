import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { calculateStatTotal } from "@/lib/exalted-utils";
import { useCharacterContext } from "@/hooks/CharacterContext";

export const AbilitySelector: React.FC = () => {
  const { character, updateCharacter } = useCharacterContext();

  return (
    <div>
      <Label className="block text-sm font-medium text-gray-600 mb-1">Ability</Label>
      <Select
        value={character?.dicePool?.ability || "athletics"}
        onValueChange={value =>
          updateCharacter({
            dicePool: {
              ...character.dicePool,
              ability: value as keyof typeof character.abilities,
            },
          })
        }
      >
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
                },
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


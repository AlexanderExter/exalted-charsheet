"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { calculateStatTotal } from "@/lib/exalted-utils";
import { useCharacterContext } from "@/hooks/CharacterContext";
import type { AttributeType } from "@/lib/character-types";

const attributes = [
  {
    key: "fortitude" as const,
    label: "Fortitude",
    activeClass: "bg-green-600 hover:bg-green-700",
    inactiveClass: "text-green-600 border-green-600 hover:bg-green-50",
  },
  {
    key: "finesse" as const,
    label: "Finesse",
    activeClass: "bg-blue-600 hover:bg-blue-700",
    inactiveClass: "text-blue-600 border-blue-600 hover:bg-blue-50",
  },
  {
    key: "force" as const,
    label: "Force",
    activeClass: "bg-red-600 hover:bg-red-700",
    inactiveClass: "text-red-600 border-red-600 hover:bg-red-50",
  },
];

export const AttributeSelector: React.FC = () => {
  const { character, updateCharacter } = useCharacterContext();
  const selected = character.dicePool.attribute;

  const handleSelect = (key: AttributeType) => {
    updateCharacter({ dicePool: { ...character.dicePool, attribute: key } });
  };

  return (
    <div className="space-y-1">
      <Label className="block text-sm font-medium text-muted-foreground mb-1">Attribute</Label>
      <div className="flex gap-2">
        {attributes.map(attr => (
          <Button
            key={attr.key}
            type="button"
            variant={selected === attr.key ? "default" : "outline"}
            size="sm"
            onClick={() => handleSelect(attr.key)}
            className={selected === attr.key ? attr.activeClass : attr.inactiveClass}
          >
            <div>{attr.label}</div>
            <div className="text-xs opacity-75">
              (
              {calculateStatTotal(
                character?.attributes?.[attr.key] || { base: 0, added: 0, bonus: 0 }
              )}
              )
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default AttributeSelector;

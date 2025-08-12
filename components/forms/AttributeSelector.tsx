'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { calculateStatTotal } from "@/lib/exalted-utils";
import { useCharacterContext } from "@/hooks/CharacterContext";
import type { DicePoolFormValues } from "@/lib/form-schemas";

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
  const { character } = useCharacterContext();
  const { control } = useFormContext<DicePoolFormValues>();

  return (
    <FormField
      control={control}
      name="attribute"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="block text-sm font-medium text-gray-600 mb-1">
            Attribute
          </FormLabel>
          <FormControl>
            <div className="flex gap-2">
              {attributes.map(attr => (
                <Button
                  key={attr.key}
                  type="button"
                  variant={field.value === attr.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => field.onChange(attr.key)}
                  className={field.value === attr.key ? attr.activeClass : attr.inactiveClass}
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
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AttributeSelector;

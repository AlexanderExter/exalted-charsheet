"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { calculateStatTotal } from "@/lib/exalted-utils";
import { useCharacterContext } from "@/hooks/CharacterContext";
import type { DicePoolFormValues } from "@/lib/form-schemas";

export const AbilitySelector: React.FC = () => {
  const { character } = useCharacterContext();
  const { control } = useFormContext<DicePoolFormValues>();

  return (
    <FormField
      control={control}
      name="ability"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="block text-sm font-medium text-muted-foreground mb-1">Ability</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(character?.abilities || {}).map(ability => (
                  <SelectItem key={ability} value={ability}>
                    {ability.charAt(0).toUpperCase() + ability.slice(1).replace(/([A-Z])/g, " $1")}{" "}
                    (
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
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AbilitySelector;

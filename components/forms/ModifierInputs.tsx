'use client';

import React from "react";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { DEFAULT_MODIFIER_MAX } from "@/lib/character-defaults";
import { useFormContext } from "react-hook-form";
import type { DicePoolFormValues } from "@/lib/form-schemas";

export const ModifierInputs: React.FC = () => {
  const { control } = useFormContext<DicePoolFormValues>();

  return (
    <div>
      <h3 className="font-semibold text-gray-700 mb-3">Modifiers</h3>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={control}
            name="targetNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-600 mb-1">
                  Target Number
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="text-center"
                    min={1}
                    max={10}
                    value={field.value}
                    onChange={e => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="doublesThreshold"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-600 mb-1">
                  Doubles Threshold
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="text-center"
                    min={1}
                    max={10}
                    value={field.value}
                    onChange={e => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={control}
            name="extraDiceBonus"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-600 mb-1">
                  Extra Dice (Bonus)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="text-center"
                    min={0}
                    max={10}
                    value={field.value}
                    onChange={e => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <div className="text-xs text-gray-500 mt-1">Max: 10</div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="extraDiceNonBonus"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-600 mb-1">
                  Extra Dice (Non-Bonus)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="text-center"
                    min={0}
                    value={field.value}
                    onChange={e => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={control}
            name="extraSuccessBonus"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-600 mb-1">
                  Extra Success (Bonus)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="text-center"
                    min={0}
                    max={DEFAULT_MODIFIER_MAX}
                    value={field.value}
                    onChange={e => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <div className="text-xs text-gray-500 mt-1">
                  Max: {DEFAULT_MODIFIER_MAX}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="extraSuccessNonBonus"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-600 mb-1">
                  Extra Success (Non-Bonus)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="text-center"
                    min={0}
                    value={field.value}
                    onChange={e => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="isStunted"
          render={({ field }) => (
            <FormItem className="mt-4 flex items-center gap-2">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={e => field.onChange(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </FormControl>
              <FormLabel className="text-sm font-medium text-gray-700">
                Stunt (+2 dice, non-capped)
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default ModifierInputs;

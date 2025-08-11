import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCharacterContext } from "@/hooks/CharacterContext";
import { DEFAULT_MODIFIER_MAX } from "@/lib/character-defaults";
import { DicePoolSchema } from "@/lib/character-types";
import { z } from "zod";

export const ModifierInputs: React.FC = () => {
  const { character, updateCharacter } = useCharacterContext();

  const [values, setValues] = React.useState({
    targetNumber: String(character?.dicePool?.targetNumber || 7),
    doublesThreshold: String(character?.dicePool?.doublesThreshold || 10),
    extraDiceBonus: String(character?.dicePool?.extraDiceBonus || 0),
    extraDiceNonBonus: String(character?.dicePool?.extraDiceNonBonus || 0),
    extraSuccessBonus: String(character?.dicePool?.extraSuccessBonus || 0),
    extraSuccessNonBonus: String(character?.dicePool?.extraSuccessNonBonus || 0),
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    setValues({
      targetNumber: String(character?.dicePool?.targetNumber || 7),
      doublesThreshold: String(character?.dicePool?.doublesThreshold || 10),
      extraDiceBonus: String(character?.dicePool?.extraDiceBonus || 0),
      extraDiceNonBonus: String(character?.dicePool?.extraDiceNonBonus || 0),
      extraSuccessBonus: String(character?.dicePool?.extraSuccessBonus || 0),
      extraSuccessNonBonus: String(character?.dicePool?.extraSuccessNonBonus || 0),
    });
  }, [character]);

  const fieldSchemas: Record<string, z.ZodTypeAny> = {
    targetNumber: DicePoolSchema.shape.targetNumber,
    doublesThreshold: DicePoolSchema.shape.doublesThreshold,
    extraDiceBonus: DicePoolSchema.shape.extraDiceBonus,
    extraDiceNonBonus: DicePoolSchema.shape.extraDiceNonBonus,
    extraSuccessBonus: DicePoolSchema.shape.extraSuccessBonus,
    extraSuccessNonBonus: DicePoolSchema.shape.extraSuccessNonBonus,
  };

  const handleChange = (field: keyof typeof values) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setValues(prev => ({ ...prev, [field]: val }));
      const schema = fieldSchemas[field];
      const result = schema.safeParse(Number(val));
      if (result.success) {
        setErrors(prev => ({ ...prev, [field]: "" }));
        updateCharacter({
          dicePool: { ...character.dicePool, [field]: result.data },
        });
      } else {
        setErrors(prev => ({
          ...prev,
          [field]: result.error.issues[0]?.message || "Invalid value",
        }));
      }
    };

  return (
    <div>
      <h3 className="font-semibold text-gray-700 mb-3">Modifiers</h3>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="block text-sm font-medium text-gray-600 mb-1">Target Number</Label>
            <Input
              type="number"
              value={values.targetNumber}
              onChange={handleChange("targetNumber")}
              className="text-center"
              min={1}
              max={10}
              aria-invalid={Boolean(errors.targetNumber)}
            />
            {errors.targetNumber && (
              <p className="text-xs text-red-500 mt-1">{errors.targetNumber}</p>
            )}
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-600 mb-1">
              Doubles Threshold
            </Label>
            <Input
              type="number"
              value={values.doublesThreshold}
              onChange={handleChange("doublesThreshold")}
              className="text-center"
              min={1}
              max={10}
              aria-invalid={Boolean(errors.doublesThreshold)}
            />
            {errors.doublesThreshold && (
              <p className="text-xs text-red-500 mt-1">{errors.doublesThreshold}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="block text-sm font-medium text-gray-600 mb-1">
              Extra Dice (Bonus)
            </Label>
            <Input
              type="number"
              value={values.extraDiceBonus}
              onChange={handleChange("extraDiceBonus")}
              className="text-center"
              min={0}
              max={10}
              aria-invalid={Boolean(errors.extraDiceBonus)}
            />
            <div className="text-xs text-gray-500 mt-1">Max: 10</div>
            {errors.extraDiceBonus && (
              <p className="text-xs text-red-500 mt-1">{errors.extraDiceBonus}</p>
            )}
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-600 mb-1">
              Extra Dice (Non-Bonus)
            </Label>
            <Input
              type="number"
              value={values.extraDiceNonBonus}
              onChange={handleChange("extraDiceNonBonus")}
              className="text-center"
              min={0}
              aria-invalid={Boolean(errors.extraDiceNonBonus)}
            />
            {errors.extraDiceNonBonus && (
              <p className="text-xs text-red-500 mt-1">{errors.extraDiceNonBonus}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="block text-sm font-medium text-gray-600 mb-1">
              Extra Success (Bonus)
            </Label>
            <Input
              type="number"
              value={values.extraSuccessBonus}
              onChange={handleChange("extraSuccessBonus")}
              className="text-center"
              min={0}
              max={DEFAULT_MODIFIER_MAX}
              aria-invalid={Boolean(errors.extraSuccessBonus)}
            />
            <div className="text-xs text-gray-500 mt-1">Max: {DEFAULT_MODIFIER_MAX}</div>
            {errors.extraSuccessBonus && (
              <p className="text-xs text-red-500 mt-1">{errors.extraSuccessBonus}</p>
            )}
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-600 mb-1">
              Extra Success (Non-Bonus)
            </Label>
            <Input
              type="number"
              value={values.extraSuccessNonBonus}
              onChange={handleChange("extraSuccessNonBonus")}
              className="text-center"
              min={0}
              aria-invalid={Boolean(errors.extraSuccessNonBonus)}
            />
            {errors.extraSuccessNonBonus && (
              <p className="text-xs text-red-500 mt-1">{errors.extraSuccessNonBonus}</p>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <input
            type="checkbox"
            id="stunt-checkbox"
            checked={character?.dicePool?.isStunted || false}
            onChange={e =>
              updateCharacter({
                dicePool: {
                  ...character.dicePool,
                  isStunted: e.target.checked,
                },
              })
            }
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <Label htmlFor="stunt-checkbox" className="text-sm font-medium text-gray-700">
            Stunt (+2 dice, non-capped)
          </Label>
        </div>
      </div>
    </div>
  );
};

export default ModifierInputs;

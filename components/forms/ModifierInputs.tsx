import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCharacterContext } from "@/hooks/CharacterContext";
import { DEFAULT_MODIFIER_MAX } from "@/lib/character-defaults";

export const ModifierInputs: React.FC = () => {
  const { character, updateCharacter } = useCharacterContext();

  return (
    <div>
      <h3 className="font-semibold text-gray-700 mb-3">Modifiers</h3>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="block text-sm font-medium text-gray-600 mb-1">
              Target Number
            </Label>
            <Input
              type="number"
              value={character?.dicePool?.targetNumber || 7}
              onChange={e =>
                updateCharacter({
                  dicePool: {
                    ...character.dicePool,
                    targetNumber: Number.parseInt(e.target.value) || 7,
                  },
                })
              }
              className="text-center"
              min={1}
              max={10}
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-600 mb-1">
              Doubles Threshold
            </Label>
            <Input
              type="number"
              value={character?.dicePool?.doublesThreshold || 10}
              onChange={e =>
                updateCharacter({
                  dicePool: {
                    ...character.dicePool,
                    doublesThreshold: Number.parseInt(e.target.value) || 10,
                  },
                })
              }
              className="text-center"
              min={1}
              max={10}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="block text-sm font-medium text-gray-600 mb-1">
              Extra Dice (Bonus)
            </Label>
            <Input
              type="number"
              value={character?.dicePool?.extraDiceBonus || 0}
              onChange={e =>
                updateCharacter({
                  dicePool: {
                    ...character.dicePool,
                    extraDiceBonus: Math.min(
                      10,
                      Math.max(0, Number.parseInt(e.target.value) || 0),
                    ),
                  },
                })
              }
              className="text-center"
              min={0}
              max={10}
            />
            <div className="text-xs text-gray-500 mt-1">Max: 10</div>
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-600 mb-1">
              Extra Dice (Non-Bonus)
            </Label>
            <Input
              type="number"
              value={character?.dicePool?.extraDiceNonBonus || 0}
              onChange={e =>
                updateCharacter({
                  dicePool: {
                    ...character.dicePool,
                    extraDiceNonBonus: Math.max(0, Number.parseInt(e.target.value) || 0),
                  },
                })
              }
              className="text-center"
              min={0}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="block text-sm font-medium text-gray-600 mb-1">
              Extra Success (Bonus)
            </Label>
            <Input
              type="number"
              value={character?.dicePool?.extraSuccessBonus || 0}
              onChange={e =>
                updateCharacter({
                  dicePool: {
                    ...character.dicePool,
                    extraSuccessBonus: Math.min(
                      DEFAULT_MODIFIER_MAX,
                      Math.max(0, Number.parseInt(e.target.value) || 0),
                    ),
                  },
                })
              }
              className="text-center"
              min={0}
              max={DEFAULT_MODIFIER_MAX}
            />
            <div className="text-xs text-gray-500 mt-1">
              Max: {DEFAULT_MODIFIER_MAX}
            </div>
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-600 mb-1">
              Extra Success (Non-Bonus)
            </Label>
            <Input
              type="number"
              value={character?.dicePool?.extraSuccessNonBonus || 0}
              onChange={e =>
                updateCharacter({
                  dicePool: {
                    ...character.dicePool,
                    extraSuccessNonBonus: Math.max(
                      0,
                      Number.parseInt(e.target.value) || 0,
                    ),
                  },
                })
              }
              className="text-center"
              min={0}
            />
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


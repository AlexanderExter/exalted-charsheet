import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

export const DicePoolEditor: React.FC = React.memo(() => {
  const { character, updateCharacter, calculateDicePool } = useCharacterContext();
  const dicePool = useMemo(() => calculateDicePool(), [calculateDicePool]);

  return (
      <Card>
        <CardHeader>
          <CardTitle>Roll Assembler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Pool Assembly */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Pool Assembly</h3>
              <div className="space-y-3">
                <div>
                  <Label className="block text-sm font-medium text-gray-600 mb-1">Attribute</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={
                        character?.dicePool?.attribute === "fortitude" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        updateCharacter({
                          dicePool: { ...character.dicePool, attribute: "fortitude" },
                        })
                      }
                      className={
                        character?.dicePool?.attribute === "fortitude"
                          ? "bg-green-600 hover:bg-green-700"
                          : "text-green-600 border-green-600 hover:bg-green-50"
                      }
                    >
                      <div>Fortitude</div>
                      <div className="text-xs opacity-75">
                        (
                        {calculateStatTotal(
                          character?.attributes?.fortitude || { base: 0, added: 0, bonus: 0 }
                        )}
                        )
                      </div>
                    </Button>
                    <Button
                      variant={
                        character?.dicePool?.attribute === "finesse" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        updateCharacter({
                          dicePool: { ...character.dicePool, attribute: "finesse" },
                        })
                      }
                      className={
                        character?.dicePool?.attribute === "finesse"
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "text-blue-600 border-blue-600 hover:bg-blue-50"
                      }
                    >
                      <div>Finesse</div>
                      <div className="text-xs opacity-75">
                        (
                        {calculateStatTotal(
                          character?.attributes?.finesse || { base: 0, added: 0, bonus: 0 }
                        )}
                        )
                      </div>
                    </Button>
                    <Button
                      variant={
                        character?.dicePool?.attribute === "force" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        updateCharacter({
                          dicePool: { ...character.dicePool, attribute: "force" },
                        })
                      }
                      className={
                        character?.dicePool?.attribute === "force"
                          ? "bg-red-600 hover:bg-red-700"
                          : "text-red-600 border-red-600 hover:bg-red-50"
                      }
                    >
                      <div>Force</div>
                      <div className="text-xs opacity-75">
                        (
                        {calculateStatTotal(
                          character?.attributes?.force || { base: 0, added: 0, bonus: 0 }
                        )}
                        )
                      </div>
                    </Button>
                  </div>
                </div>

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
                          {ability.charAt(0).toUpperCase() +
                            ability.slice(1).replace(/([A-Z])/g, " $1")}{" "}
                          (
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
              </div>
            </div>

            {/* Extra Dice and Success */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Modifiers</h3>
              <div className="space-y-3">
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
                              5,
                              Math.max(0, Number.parseInt(e.target.value) || 0),
                            ),
                          },
                        })
                      }
                      className="text-center"
                      min={0}
                      max={5}
                    />
                    <div className="text-xs text-gray-500 mt-1">Max: 5</div>
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

                {/* Stunt Checkbox */}
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
          </div>

          {/* Results */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Dice Pool Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
              <div>
                <div className="text-blue-600 font-medium">Base Pool</div>
                <div className="text-lg font-bold text-blue-800">
                  {dicePool.basePool}
                </div>
              </div>
              <div>
                <div className="text-blue-600 font-medium">Extra Dice</div>
                <div className="text-lg font-bold text-blue-800">
                  +{dicePool.extraDice}
                </div>
              </div>
              <div>
                <div className="text-blue-600 font-medium">Total Dice</div>
                <div className="text-lg font-bold text-blue-800">
                  {dicePool.totalPool}
                </div>
              </div>
              <div>
                <div className="text-blue-600 font-medium">Extra Success</div>
                <div className="text-lg font-bold text-blue-800">
                  +
                  {(character?.dicePool?.extraSuccessBonus || 0) +
                    (character?.dicePool?.extraSuccessNonBonus || 0)}
                </div>
              </div>
            </div>
            <div className="text-center p-2 bg-blue-100 rounded font-medium text-blue-800">
              {dicePool.actionPhrase}
            </div>
          </div>
        </CardContent>
      </Card>
    );
});

DicePoolEditor.displayName = "DicePoolEditor";

export default DicePoolEditor;

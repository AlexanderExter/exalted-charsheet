import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { Character } from "@/lib/character-types";
import type { CharacterCalculations } from "@/hooks/useCharacterCalculations";
import { DEFAULT_MODIFIER_MAX, DEFAULT_MODIFIER_MIN } from "@/lib/character-defaults";

interface StaticValuesPanelProps {
  character: Character;
  updateCharacter: (updates: Partial<Character>) => void;
  calculations: CharacterCalculations;
}

export const StaticValuesPanel: React.FC<StaticValuesPanelProps> = ({
  character,
  updateCharacter,
  calculations,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Static Values</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* First Row */}
          <div className="grid grid-cols-3 gap-6">
            {/* Defense */}
            <div className="space-y-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{calculations.defense}</div>
                <div className="text-sm font-medium text-gray-700">Defense</div>
              </div>
              <div className="text-xs text-gray-500 text-center">
                <div>Max of Evasion/Parry</div>
              </div>
              <div className="flex items-center justify-center gap-1">
                <Label className="text-xs text-gray-600">Mod:</Label>
                <Input
                  type="number"
                  value={character?.staticValues?.defenseModifier || 0}
                  onChange={e => {
                    const value = Math.max(
                      DEFAULT_MODIFIER_MIN,
                      Math.min(DEFAULT_MODIFIER_MAX, Number.parseInt(e.target.value) || 0)
                    );
                    updateCharacter({
                      staticValues: { ...character.staticValues, defenseModifier: value },
                    });
                  }}
                  className="w-12 text-center text-xs"
                  min={DEFAULT_MODIFIER_MIN}
                  max={DEFAULT_MODIFIER_MAX}
                />
              </div>
            </div>

            {/* Evasion */}
            <div className="space-y-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{calculations.evasion}</div>
                <div className="text-sm font-medium text-gray-700">Evasion</div>
              </div>
              <div className="text-xs text-gray-500 text-center">
                <div>⌈(Athletics + Max Attr) / 2⌉</div>
              </div>
              <div className="flex items-center justify-center gap-1">
                <Label className="text-xs text-gray-600">Mod:</Label>
                <Input
                  type="number"
                  value={character?.staticValues?.evasionModifier || 0}
                  onChange={e => {
                    const value = Math.max(
                      DEFAULT_MODIFIER_MIN,
                      Math.min(DEFAULT_MODIFIER_MAX, Number.parseInt(e.target.value) || 0)
                    );
                    updateCharacter({
                      staticValues: { ...character.staticValues, evasionModifier: value },
                    });
                  }}
                  className="w-12 text-center text-xs"
                  min={DEFAULT_MODIFIER_MIN}
                  max={DEFAULT_MODIFIER_MAX}
                />
              </div>
            </div>

            {/* Parry */}
            <div className="space-y-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{calculations.parry}</div>
                <div className="text-sm font-medium text-gray-700">Parry</div>
              </div>
              <div className="text-xs text-gray-500 text-center">
                <div>⌈(Close Combat + Max Attr) / 2⌉</div>
              </div>
              <div className="flex items-center justify-center gap-1">
                <Label className="text-xs text-gray-600">Mod:</Label>
                <Input
                  type="number"
                  value={character?.staticValues?.parryModifier || 0}
                  onChange={e => {
                    const value = Math.max(
                      DEFAULT_MODIFIER_MIN,
                      Math.min(DEFAULT_MODIFIER_MAX, Number.parseInt(e.target.value) || 0)
                    );
                    updateCharacter({
                      staticValues: { ...character.staticValues, parryModifier: value },
                    });
                  }}
                  className="w-12 text-center text-xs"
                  min={DEFAULT_MODIFIER_MIN}
                  max={DEFAULT_MODIFIER_MAX}
                />
              </div>
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-3 gap-6">
            {/* Resolve */}
            <div className="space-y-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{calculations.resolve}</div>
                <div className="text-sm font-medium text-gray-700">Resolve</div>
              </div>
              <div className="text-xs text-gray-500 text-center">
                <div>2 + Integrity bonuses</div>
                <div>Integrity 1+ = +1, Integrity 3+ = +2</div>
              </div>
              <div className="flex items-center justify-center gap-1">
                <Label className="text-xs text-gray-600">Mod:</Label>
                <Input
                  type="number"
                  value={character?.staticValues?.resolveModifier || 0}
                  onChange={e => {
                    const value = Math.max(
                      DEFAULT_MODIFIER_MIN,
                      Math.min(DEFAULT_MODIFIER_MAX, Number.parseInt(e.target.value) || 0)
                    );
                    updateCharacter({
                      staticValues: { ...character.staticValues, resolveModifier: value },
                    });
                  }}
                  className="w-12 text-center text-xs"
                  min={DEFAULT_MODIFIER_MIN}
                  max={DEFAULT_MODIFIER_MAX}
                />
              </div>
            </div>

            {/* Soak */}
            <div className="space-y-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{calculations.soak}</div>
                <div className="text-sm font-medium text-gray-700">Soak</div>
              </div>
              <div className="text-xs text-gray-500 text-center">
                <div>1 + Physique + Armor</div>
                <div>
                  Armor: +
                  {(character?.armor || []).reduce(
                    (total: number, armor) => total + (armor.soak || 0),
                    0
                  )}
                </div>
              </div>
              <div className="flex items-center justify-center gap-1">
                <Label className="text-xs text-gray-600">Mod:</Label>
                <Input
                  type="number"
                  value={character?.staticValues?.soakModifier || 0}
                  onChange={e => {
                    const value = Math.max(
                      DEFAULT_MODIFIER_MIN,
                      Math.min(DEFAULT_MODIFIER_MAX, Number.parseInt(e.target.value) || 0)
                    );
                    updateCharacter({
                      staticValues: { ...character.staticValues, soakModifier: value },
                    });
                  }}
                  className="w-12 text-center text-xs"
                  min={DEFAULT_MODIFIER_MIN}
                  max={DEFAULT_MODIFIER_MAX}
                />
              </div>
            </div>

            {/* Hardness */}
            <div className="space-y-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{calculations.hardness}</div>
                <div className="text-sm font-medium text-gray-700">Hardness</div>
              </div>
              <div className="text-xs text-gray-500 text-center">
                <div>Essence + 2 + Armor</div>
                <div>
                  Armor: +
                  {(character?.armor || []).reduce(
                    (total: number, armor) => total + (armor.hardness || 0),
                    0
                  )}
                </div>
              </div>
              <div className="flex items-center justify-center gap-1">
                <Label className="text-xs text-gray-600">Mod:</Label>
                <Input
                  type="number"
                  value={character?.staticValues?.hardnessModifier || 0}
                  onChange={e => {
                    const value = Math.max(
                      DEFAULT_MODIFIER_MIN,
                      Math.min(DEFAULT_MODIFIER_MAX, Number.parseInt(e.target.value) || 0)
                    );
                    updateCharacter({
                      staticValues: { ...character.staticValues, hardnessModifier: value },
                    });
                  }}
                  className="w-12 text-center text-xs"
                  min={DEFAULT_MODIFIER_MIN}
                  max={DEFAULT_MODIFIER_MAX}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

StaticValuesPanel.displayName = "StaticValuesPanel";

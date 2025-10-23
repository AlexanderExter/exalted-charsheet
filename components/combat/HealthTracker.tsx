"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HealthLevelsSchema,
  HealthSchema,
  type Character,
  type ExaltType,
  type DramaticInjury,
} from "@/lib/character-types";
import type { CharacterCalculations } from "@/hooks/useCharacterCalculations";
import { DramaticInjuriesList } from "@/components/combat/DramaticInjuriesList";
import { z } from "zod";

interface HealthTrackerProps {
  character: Character;
  updateCharacter: (updates: Partial<Character>) => void;
  calculations: CharacterCalculations;
  getTotalHealthLevels: () => number;
  addDramaticInjury: () => void;
  updateDramaticInjury: <K extends keyof DramaticInjury>(
    id: string,
    field: K,
    value: DramaticInjury[K]
  ) => void;
  deleteDramaticInjury: (id: string) => void;
}

export const HealthTracker: React.FC<HealthTrackerProps> = ({
  character,
  updateCharacter,
  calculations,
  getTotalHealthLevels,
  addDramaticInjury,
  updateDramaticInjury,
  deleteDramaticInjury,
}) => {
  const [values, setValues] = React.useState({
    zero: String(character?.health?.baseline?.zero || 1),
    minusOne: String(character?.health?.baseline?.minusOne || 2),
    minusTwo: String(character?.health?.baseline?.minusTwo || 2),
    incap: String(character?.health?.baseline?.incap || 1),
    oxBodyLevels: String(character?.health?.oxBodyLevels || 0),
    bashingDamage: String(character?.health?.bashingDamage || 0),
    lethalDamage: String(character?.health?.lethalDamage || 0),
    aggravatedDamage: String(character?.health?.aggravatedDamage || 0),
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    setValues({
      zero: String(character?.health?.baseline?.zero || 1),
      minusOne: String(character?.health?.baseline?.minusOne || 2),
      minusTwo: String(character?.health?.baseline?.minusTwo || 2),
      incap: String(character?.health?.baseline?.incap || 1),
      oxBodyLevels: String(character?.health?.oxBodyLevels || 0),
      bashingDamage: String(character?.health?.bashingDamage || 0),
      lethalDamage: String(character?.health?.lethalDamage || 0),
      aggravatedDamage: String(character?.health?.aggravatedDamage || 0),
    });
  }, [character]);

  const baselineSchemas: Record<string, z.ZodTypeAny> = {
    zero: HealthLevelsSchema.shape.zero,
    minusOne: HealthLevelsSchema.shape.minusOne,
    minusTwo: HealthLevelsSchema.shape.minusTwo,
    incap: HealthLevelsSchema.shape.incap,
  };

  const handleBaselineChange =
    (field: keyof typeof baselineSchemas) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setValues(prev => ({ ...prev, [field]: val }));
      const result = baselineSchemas[field].safeParse(Number(val));
      if (result.success) {
        setErrors(prev => ({ ...prev, [field]: "" }));
        updateCharacter({
          health: {
            ...character.health,
            baseline: { ...character.health?.baseline, [field]: result.data },
          },
        });
      } else {
        setErrors(prev => ({
          ...prev,
          [field]: result.error.issues[0]?.message || "Invalid value",
        }));
      }
    };

  const handleOxBodyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValues(prev => ({ ...prev, oxBodyLevels: val }));
    const result = HealthSchema.shape.oxBodyLevels.safeParse(Number(val));
    if (result.success) {
      setErrors(prev => ({ ...prev, oxBodyLevels: "" }));
      updateCharacter({
        health: { ...character.health, oxBodyLevels: result.data },
      });
    } else {
      setErrors(prev => ({
        ...prev,
        oxBodyLevels: result.error.issues[0]?.message || "Invalid value",
      }));
    }
  };

  const handleDamageChange =
    (field: "bashingDamage" | "lethalDamage" | "aggravatedDamage") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setValues(prev => ({ ...prev, [field]: val }));
      const total = getTotalHealthLevels();
      const otherDamage =
        field === "bashingDamage"
          ? (character?.health?.lethalDamage || 0) + (character?.health?.aggravatedDamage || 0)
          : field === "lethalDamage"
            ? (character?.health?.bashingDamage || 0) + (character?.health?.aggravatedDamage || 0)
            : (character?.health?.bashingDamage || 0) + (character?.health?.lethalDamage || 0);
      const maxAllowed = Math.max(0, total - otherDamage);
      const schema = z.number().int().min(0).max(maxAllowed);
      const result = schema.safeParse(Number(val));
      if (result.success) {
        setErrors(prev => ({ ...prev, [field]: "" }));
        updateCharacter({
          health: { ...character.health, [field]: result.data },
        });
      } else {
        setErrors(prev => ({
          ...prev,
          [field]: result.error.issues[0]?.message || `Must be between 0 and ${maxAllowed}`,
        }));
      }
    };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Health Track
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium text-muted-foreground">Exalt Type:</Label>
              <Select
                value={character?.health?.exaltType || "lunar"}
                onValueChange={(value: ExaltType) =>
                  updateCharacter({
                    health: { ...character.health, exaltType: value },
                  })
                }
              >
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lunar">Lunar</SelectItem>
                  <SelectItem value="solar">Solar</SelectItem>
                  <SelectItem value="dragon-blood">Dragon-Blood</SelectItem>
                  <SelectItem value="sidereal">Sidereal</SelectItem>
                  <SelectItem value="abyssal">Abyssal</SelectItem>
                  <SelectItem value="liminal">Liminal</SelectItem>
                  <SelectItem value="exigent">Exigent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Health Levels Grid */}
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label className="text-sm font-medium text-foreground/80">Zero Penalty</Label>
              <Input
                type="number"
                value={values.zero}
                onChange={handleBaselineChange("zero")}
                className="text-center"
                min={0}
              />
              {errors.zero && <p className="text-xs text-destructive mt-1">{errors.zero}</p>}
            </div>

            <div>
              <Label className="text-sm font-medium text-foreground/80">-1 Penalty</Label>
              <Input
                type="number"
                value={values.minusOne}
                onChange={handleBaselineChange("minusOne")}
                className="text-center"
                min={0}
              />
              {errors.minusOne && <p className="text-xs text-destructive mt-1">{errors.minusOne}</p>}
            </div>

            <div>
              <Label className="text-sm font-medium text-foreground/80">-2 Penalty</Label>
              <Input
                type="number"
                value={values.minusTwo}
                onChange={handleBaselineChange("minusTwo")}
                className="text-center"
                min={0}
              />
              {errors.minusTwo && <p className="text-xs text-destructive mt-1">{errors.minusTwo}</p>}
            </div>

            <div>
              <Label className="text-sm font-medium text-foreground/80">Incapacitated</Label>
              <Input
                type="number"
                value={values.incap}
                onChange={handleBaselineChange("incap")}
                className="text-center"
                min={0}
              />
              {errors.incap && <p className="text-xs text-destructive mt-1">{errors.incap}</p>}
            </div>
          </div>

          {/* Ox-Body Levels */}
          <div className="mt-4">
            <Label className="text-sm font-medium text-foreground/80">
              Ox-Body Levels (adds health levels)
            </Label>
            <Input
              type="number"
              value={values.oxBodyLevels}
              onChange={handleOxBodyChange}
              className="text-center"
              min={0}
            />
            {errors.oxBodyLevels && (
              <p className="text-xs text-destructive mt-1">{errors.oxBodyLevels}</p>
            )}
            <div className="mt-3 p-2 bg-muted/50 rounded">
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-medium text-success">0 Penalty</div>
                  <div className="text-lg font-bold">{calculations.healthLevels.zero}</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-warning">-1 Penalty</div>
                  <div className="text-lg font-bold">{calculations.healthLevels.minusOne}</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-warning">-2 Penalty</div>
                  <div className="text-lg font-bold">{calculations.healthLevels.minusTwo}</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-destructive">Incapacitated</div>
                  <div className="text-lg font-bold">{calculations.healthLevels.incap}</div>
                </div>
              </div>
            </div>

            {/* Incapacitation Rules */}
            {calculations.healthPenalty === -4 && (
              <div className="mt-3 border-t pt-3 bg-destructive/10 p-2 rounded">
                <div className="text-xs font-medium text-destructive mb-1">Incapacitation Rules:</div>
                <div className="text-xs text-destructive space-y-1">
                  <p>
                    Incapacitated characters have their Power reduced to 0 and cannot Build Power or
                    flurry. Allies can recover them by Building their Power to 10, which resets the
                    track to 0.
                  </p>
                  <p>
                    A player may ignore incapacitation by accepting a dramatic injury to an
                    Attribute or Primary Merit, applying a -1 die penalty or losing access to that
                    trait.
                  </p>
                  <p>
                    See
                    <a
                      href="https://exalted.fandom.com/wiki/Exalted_Essence"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline ml-1"
                    >
                      Exalted Essence
                    </a>
                    for full rules.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Damage Tracking */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-foreground/80">Bashing Damage</Label>
              <Input
                type="number"
                value={values.bashingDamage}
                onChange={handleDamageChange("bashingDamage")}
                className="text-center"
                min={0}
                max={Math.max(
                  0,
                  getTotalHealthLevels() -
                    ((character?.health?.lethalDamage || 0) +
                      (character?.health?.aggravatedDamage || 0))
                )}
              />
              {errors.bashingDamage && (
                <p className="text-xs text-destructive mt-1">{errors.bashingDamage}</p>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium text-foreground/80">Lethal Damage</Label>
              <Input
                type="number"
                value={values.lethalDamage}
                onChange={handleDamageChange("lethalDamage")}
                className="text-center"
                min={0}
                max={Math.max(
                  0,
                  getTotalHealthLevels() -
                    ((character?.health?.bashingDamage || 0) +
                      (character?.health?.aggravatedDamage || 0))
                )}
              />
              {errors.lethalDamage && (
                <p className="text-xs text-destructive mt-1">{errors.lethalDamage}</p>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium text-foreground/80">Aggravated Damage</Label>
              <Input
                type="number"
                value={values.aggravatedDamage}
                onChange={handleDamageChange("aggravatedDamage")}
                className="text-center"
                min={0}
                max={Math.max(
                  0,
                  getTotalHealthLevels() -
                    ((character?.health?.bashingDamage || 0) +
                      (character?.health?.lethalDamage || 0))
                )}
              />
              {errors.aggravatedDamage && (
                <p className="text-xs text-destructive mt-1">{errors.aggravatedDamage}</p>
              )}
            </div>
          </div>

          {/* Dramatic Injuries */}
          <DramaticInjuriesList
            injuries={character.health?.dramaticInjuries || []}
            addDramaticInjury={addDramaticInjury}
            updateDramaticInjury={updateDramaticInjury}
            deleteDramaticInjury={deleteDramaticInjury}
          />
        </div>
      </CardContent>
    </Card>
  );
};

HealthTracker.displayName = "HealthTracker";

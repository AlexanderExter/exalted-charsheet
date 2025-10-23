"use client";

// Social Tab Component - Virtues, intimacies, and resolve management

import React, { useCallback } from "react";
import { Plus, Trash2 } from "lucide-react";
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
import type {
  VirtueType,
  Intimacy,
  Background,
  BackgroundType,
  BackgroundLevel,
} from "@/lib/character-types";
import { useCharacterContext } from "@/hooks/CharacterContext";
import { useNestedEntityCRUD } from "@/hooks/useEntityCRUD";
import { DEFAULT_MODIFIER_MAX, DEFAULT_MODIFIER_MIN } from "@/lib/character-defaults";

const virtueOptions: Array<NonNullable<VirtueType>> = [
  "ambition",
  "compassion",
  "courage",
  "discipline",
  "justice",
  "loyalty",
  "wonder",
];

export const SocialTab: React.FC = React.memo(() => {
  const { character, updateCharacter, calculations } = useCharacterContext();
  const resolve = calculations.resolve;

  // Virtue management
  const setVirtue = useCallback(
    (type: "major" | "minor", virtue: VirtueType) => {
      updateCharacter({
        social: {
          ...character.social,
          virtues: {
            ...character.social?.virtues,
            [type]: virtue,
          },
        },
      });
    },
    [character, updateCharacter]
  );

  // Intimacies CRUD
  const intimaciesEntity = useNestedEntityCRUD<Intimacy>(
    character,
    updateCharacter,
    "social",
    "intimacies",
    () => ({
      id: crypto.randomUUID(),
      description: "",
      intensity: "minor",
    })
  );

  // Backgrounds CRUD
  const backgroundsEntity = useNestedEntityCRUD<Background>(
    character,
    updateCharacter,
    "social",
    "backgrounds",
    () => ({
      id: crypto.randomUUID(),
      type: "artifact",
      level: "tertiary",
      description: "",
    })
  );

  return (
    <div className="space-y-6">
      {/* Social Influence Reference */}
      <div className="bg-info/10 rounded-lg p-4 text-xs text-info">
        <div className="font-semibold mb-1">Social Influence Steps:</div>
        <div>Step 1: The player declares her intention for the influence.</div>
        <div>
          Step 2: Form the dice pool for the action using an appropriate Attribute + Ability and
          adding any modifiers.
        </div>
        <div>Step 3: The target determines if any Virtues or Intimacies adjust his Resolve.</div>
        <div>
          Step 4: On success, the player utilizes extra successes to determine the extent of her
          influence action on the target. The target may choose to resist the social influence.
        </div>
        <div className="mt-2 font-semibold">
          Resolve Modifiers: Minor = ±2, Major = ±3. Minimum Resolve against social action = 1.
        </div>
      </div>

      {/* Resolve Display */}
      <Card>
        <CardHeader>
          <CardTitle>Base Resolve</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-center">
              <div className="text-2xl font-bold text-info">{resolve}</div>
              <div className="text-sm font-medium text-foreground/80">Resolve</div>
            </div>
            <div className="text-xs text-muted-foreground/80 text-center">
              <div>2 + Integrity bonuses</div>
              <div>Integrity 1+ = +1, Integrity 3+ = +2</div>
            </div>
            <div className="flex items-center justify-center gap-1">
              <Label className="text-xs text-muted-foreground">Mod:</Label>
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
        </CardContent>
      </Card>

      {/* Intimacies */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Intimacies</CardTitle>
            {/* Virtues Header */}
            <div className="flex items-center gap-3">
              <Label className="text-sm font-medium text-muted-foreground">Virtues:</Label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Label className="text-xs text-info">Major:</Label>
                  <Select
                    value={character?.social?.virtues?.major || "none"}
                    onValueChange={(value: string) =>
                      setVirtue("major", value === "none" ? null : (value as VirtueType))
                    }
                  >
                    <SelectTrigger className="w-24 h-7 text-xs">
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {virtueOptions
                        .filter(v => v !== character?.social?.virtues?.minor)
                        .map(virtue => (
                          <SelectItem key={virtue} value={virtue}>
                            {virtue.charAt(0).toUpperCase() + virtue.slice(1)}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-1">
                  <Label className="text-xs text-info">Minor:</Label>
                  <Select
                    value={character?.social?.virtues?.minor || "none"}
                    onValueChange={(value: string) =>
                      setVirtue("minor", value === "none" ? null : (value as VirtueType))
                    }
                  >
                    <SelectTrigger className="w-24 h-7 text-xs">
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {virtueOptions
                        .filter(v => v !== character?.social?.virtues?.major)
                        .map(virtue => (
                          <SelectItem key={virtue} value={virtue}>
                            {virtue.charAt(0).toUpperCase() + virtue.slice(1)}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">
              Intimacies represent emotional connections and core beliefs that motivate your
              character.
            </p>
            <Button onClick={intimaciesEntity.add} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              Add Intimacy
            </Button>
          </div>

          {intimaciesEntity.items.length === 0 ? (
            <p className="text-muted-foreground/80 italic text-sm">No intimacies yet.</p>
          ) : (
            <div className="space-y-2">
              {intimaciesEntity.items.map(intimacy => (
                <div key={intimacy.id} className="flex items-center gap-2">
                  <Input
                    type="text"
                    value={intimacy.description}
                    onChange={e =>
                      intimaciesEntity.update(intimacy.id, "description", e.target.value)
                    }
                    className="flex-1"
                    placeholder="Intimacy description..."
                  />
                  <Select
                    value={intimacy.intensity}
                    onValueChange={(value: "minor" | "major") =>
                      intimaciesEntity.update(intimacy.id, "intensity", value)
                    }
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minor">Minor</SelectItem>
                      <SelectItem value="major">Major</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={() => intimaciesEntity.remove(intimacy.id)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Backgrounds */}
      <Card>
        <CardHeader>
          <CardTitle>Backgrounds</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">
              Backgrounds represent resources, allies, and supernatural assets available to your
              character.
            </p>
            <Button onClick={backgroundsEntity.add} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              Add Background
            </Button>
          </div>

          {backgroundsEntity.items.length === 0 ? (
            <p className="text-muted-foreground/80 italic text-sm">No backgrounds yet.</p>
          ) : (
            <div className="space-y-2">
              {backgroundsEntity.items.map(background => (
                <div key={background.id} className="flex items-center gap-2">
                  <Select
                    value={background.type}
                    onValueChange={(value: BackgroundType) =>
                      backgroundsEntity.update(background.id, "type", value)
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="artifact">Artifact</SelectItem>
                      <SelectItem value="resources">Resources</SelectItem>
                      <SelectItem value="followers">Followers</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={background.level}
                    onValueChange={(value: BackgroundLevel) =>
                      backgroundsEntity.update(background.id, "level", value)
                    }
                  >
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tertiary">Tertiary</SelectItem>
                      <SelectItem value="secondary">Secondary</SelectItem>
                      <SelectItem value="primary">Primary</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="text"
                    value={background.description}
                    onChange={e =>
                      backgroundsEntity.update(background.id, "description", e.target.value)
                    }
                    className="flex-1"
                    placeholder="Background description..."
                  />
                  <Button
                    onClick={() => backgroundsEntity.remove(background.id)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
});

SocialTab.displayName = "SocialTab";

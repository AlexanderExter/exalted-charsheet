'use client';

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { Weapon, WeaponRange } from "@/lib/character-types";
import { parseTagsFromString, stringifyTags } from "@/components/equipment/tag-utils";

interface WeaponEditorProps {
  weapon: Weapon;
  updateWeapon: (id: string, field: keyof Weapon, value: Weapon[keyof Weapon]) => void;
  deleteWeapon: (id: string) => void;
}

export const WeaponEditor: React.FC<WeaponEditorProps> = ({
  weapon,
  updateWeapon,
  deleteWeapon,
}) => {
  return (
    <div className="p-4 bg-white rounded border border-gray-200 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <Label htmlFor={`weapon-name-${weapon.id}`}>Name</Label>
          <Input
            id={`weapon-name-${weapon.id}`}
            value={weapon.name}
            onChange={e => updateWeapon(weapon.id, "name", e.target.value)}
            placeholder="Weapon name..."
          />
        </div>
        <div>
          <Label htmlFor={`weapon-accuracy-${weapon.id}`}>Accuracy</Label>
          <Input
            id={`weapon-accuracy-${weapon.id}`}
            type="number"
            value={weapon.accuracy}
            onChange={e =>
              updateWeapon(weapon.id, "accuracy", Number.parseInt(e.target.value) || 0)
            }
          />
        </div>
        <div>
          <Label htmlFor={`weapon-damage-${weapon.id}`}>Damage</Label>
          <Input
            id={`weapon-damage-${weapon.id}`}
            type="number"
            value={weapon.damage}
            onChange={e => updateWeapon(weapon.id, "damage", Number.parseInt(e.target.value) || 0)}
            min={0}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <Label htmlFor={`weapon-defence-${weapon.id}`}>Defence</Label>
          <Input
            id={`weapon-defence-${weapon.id}`}
            type="number"
            value={weapon.defence}
            onChange={e => updateWeapon(weapon.id, "defence", Number.parseInt(e.target.value) || 0)}
          />
        </div>
        <div>
          <Label htmlFor={`weapon-overwhelming-${weapon.id}`}>Overwhelming</Label>
          <Input
            id={`weapon-overwhelming-${weapon.id}`}
            type="number"
            value={weapon.overwhelming}
            onChange={e =>
              updateWeapon(weapon.id, "overwhelming", Number.parseInt(e.target.value) || 0)
            }
            min={0}
          />
        </div>
        <div>
          <Label htmlFor={`weapon-range-${weapon.id}`}>Range</Label>
          <Select
            value={weapon.range}
            onValueChange={(value: WeaponRange) => updateWeapon(weapon.id, "range", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="close">Close</SelectItem>
              <SelectItem value="short">Short</SelectItem>
              <SelectItem value="mid">Mid</SelectItem>
              <SelectItem value="long">Long</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor={`weapon-tags-${weapon.id}`}>Tags</Label>
          <Input
            id={`weapon-tags-${weapon.id}`}
            value={stringifyTags(weapon.tags)}
            onChange={e => updateWeapon(weapon.id, "tags", parseTagsFromString(e.target.value))}
            placeholder="e.g., Lethal, Thrown"
          />
        </div>
      </div>

      <div>
        <Label htmlFor={`weapon-description-${weapon.id}`}>Description</Label>
        <Textarea
          id={`weapon-description-${weapon.id}`}
          value={weapon.description || ""}
          onChange={e => updateWeapon(weapon.id, "description", e.target.value)}
          placeholder="Weapon description and special properties..."
          rows={2}
          className="resize-none"
        />
      </div>

      <div className="flex items-center justify-end">
        <Button onClick={() => deleteWeapon(weapon.id)} size="sm" variant="destructive">
          Delete
        </Button>
      </div>
    </div>
  );
};

WeaponEditor.displayName = "WeaponEditor";

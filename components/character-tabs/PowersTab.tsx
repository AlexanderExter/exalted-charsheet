"use client";

// Powers Tab Component - Charms and Spells management

import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import type { Charm, Spell, SpellCircle } from "@/lib/character-types";
import { useCharacterContext } from "@/hooks/CharacterContext";
import { useEntityCRUD } from "@/hooks/useEntityCRUD";
import { GenericList } from "@/components/common/GenericList";

export const PowersTab: React.FC = () => {
  const { character, updateCharacter } = useCharacterContext();

  // Charms CRUD
  const charmsEntity = useEntityCRUD<Charm>(character, updateCharacter, "charms", () => ({
    id: crypto.randomUUID(),
    name: "",
    cost: "",
    keywords: [],
    description: "",
    step: null,
    pageReference: "",
    prerequisites: [],
    dateAdded: new Date().toLocaleDateString(),
  }));

  // Spells CRUD
  const spellsEntity = useEntityCRUD<Spell>(character, updateCharacter, "spells", () => ({
    id: crypto.randomUUID(),
    name: "",
    circle: "terrestrial",
    cost: "",
    description: "",
    step: null,
    pageReference: "",
    dateAdded: new Date().toLocaleDateString(),
    components: [],
  }));

  return (
    <div className="space-y-6">
      {/* Charms */}
      <GenericList
        title="Charms"
        items={charmsEntity.items}
        emptyMessage="No charms yet."
        addButtonText="Add Charm"
        buttonColor="bg-amber-600 hover:bg-amber-700"
        onAdd={charmsEntity.add}
        onReorder={charmsEntity.reorder}
        renderItem={(charm: Charm) => (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label htmlFor={`charm-name-${charm.id}`}>Name</Label>
                <Input
                  id={`charm-name-${charm.id}`}
                  value={charm.name}
                  onChange={e => charmsEntity.update(charm.id, "name", e.target.value)}
                  placeholder="Charm name..."
                />
              </div>
              <div>
                <Label htmlFor={`charm-cost-${charm.id}`}>Cost</Label>
                <Input
                  id={`charm-cost-${charm.id}`}
                  value={charm.cost}
                  onChange={e => charmsEntity.update(charm.id, "cost", e.target.value)}
                  placeholder="e.g., 3m, 1wp"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label htmlFor={`charm-step-${charm.id}`}>Combat Step</Label>
                <Select
                  value={charm.step?.toString() || "none"}
                  onValueChange={value =>
                    charmsEntity.update(charm.id, "step", value === "none" ? null : parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Step</SelectItem>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(step => (
                      <SelectItem key={step} value={step.toString()}>
                        Step {step}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor={`charm-page-${charm.id}`}>Page Reference</Label>
                <Input
                  id={`charm-page-${charm.id}`}
                  value={charm.pageReference}
                  onChange={e => charmsEntity.update(charm.id, "pageReference", e.target.value)}
                  placeholder="p.123"
                />
              </div>
            </div>

            <div>
              <Label htmlFor={`charm-description-${charm.id}`}>Description</Label>
              <Textarea
                id={`charm-description-${charm.id}`}
                value={charm.description}
                onChange={e => charmsEntity.update(charm.id, "description", e.target.value)}
                placeholder="Charm description and mechanics..."
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground/80">Added: {charm.dateAdded}</div>
              <Button onClick={() => charmsEntity.remove(charm.id)} size="sm" variant="destructive">
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        )}
      />

      {/* Spells */}
      <GenericList
        title="Spells"
        items={spellsEntity.items}
        emptyMessage="No spells yet."
        addButtonText="Add Spell"
        buttonColor="bg-indigo-600 hover:bg-indigo-700"
        onAdd={spellsEntity.add}
        onReorder={spellsEntity.reorder}
        renderItem={(spell: Spell) => (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label htmlFor={`spell-name-${spell.id}`}>Name</Label>
                <Input
                  id={`spell-name-${spell.id}`}
                  value={spell.name}
                  onChange={e => spellsEntity.update(spell.id, "name", e.target.value)}
                  placeholder="Spell name..."
                />
              </div>
              <div>
                <Label htmlFor={`spell-circle-${spell.id}`}>Circle</Label>
                <Select
                  value={spell.circle}
                  onValueChange={(value: SpellCircle) =>
                    spellsEntity.update(spell.id, "circle", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="terrestrial">Terrestrial</SelectItem>
                    <SelectItem value="celestial">Celestial</SelectItem>
                    <SelectItem value="solar">Solar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor={`spell-cost-${spell.id}`}>Cost</Label>
                <Input
                  id={`spell-cost-${spell.id}`}
                  value={spell.cost}
                  onChange={e => spellsEntity.update(spell.id, "cost", e.target.value)}
                  placeholder="e.g., 5m, 1wp"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor={`spell-step-${spell.id}`}>Combat Step</Label>
                <Select
                  value={spell.step?.toString() || "none"}
                  onValueChange={value =>
                    spellsEntity.update(spell.id, "step", value === "none" ? null : parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Step</SelectItem>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(step => (
                      <SelectItem key={step} value={step.toString()}>
                        Step {step}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor={`spell-page-${spell.id}`}>Page Reference</Label>
                <Input
                  id={`spell-page-${spell.id}`}
                  value={spell.pageReference}
                  onChange={e => spellsEntity.update(spell.id, "pageReference", e.target.value)}
                  placeholder="p.123"
                />
              </div>
            </div>

            <div>
              <Label htmlFor={`spell-description-${spell.id}`}>Description</Label>
              <Textarea
                id={`spell-description-${spell.id}`}
                value={spell.description}
                onChange={e => spellsEntity.update(spell.id, "description", e.target.value)}
                placeholder="Spell description and effects..."
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground/80">Added: {spell.dateAdded}</div>
              <Button onClick={() => spellsEntity.remove(spell.id)} size="sm" variant="destructive">
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        )}
      />
    </div>
  );
};


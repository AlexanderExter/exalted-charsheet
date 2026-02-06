"use client";

import React from "react";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import type { SideCharacter, DicePoolWithAction, DicePoolType, Quality } from "@/lib/character-types";

interface SideCharacterEditorProps {
  sideCharacter: SideCharacter;
  onUpdate: (updates: Partial<SideCharacter>) => void;
  onBack: () => void;
}

export const SideCharacterEditor: React.FC<SideCharacterEditorProps> = ({
  sideCharacter,
  onUpdate,
  onBack,
}) => {
  // Add a new pool
  const addPool = () => {
    const newPool: DicePoolWithAction = {
      id: crypto.randomUUID(),
      value: 5,
      action: "",
      type: "primary",
    };

    onUpdate({ pools: [...sideCharacter.pools, newPool] });
  };

  const updatePool = (id: string, field: keyof DicePoolWithAction, value: string | number) => {
    onUpdate({
      pools: sideCharacter.pools.map(p => (p.id === id ? { ...p, [field]: value } : p)),
    });
  };

  const deletePool = (id: string) => {
    onUpdate({ pools: sideCharacter.pools.filter(p => p.id !== id) });
  };

  // Add a new quality
  const addQuality = () => {
    const newQuality: Quality = {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      category: "trait",
      dateCreated: new Date().toLocaleDateString(),
    };
    onUpdate({ qualities: [...sideCharacter.qualities, newQuality] });
  };

  const updateQuality = (id: string, field: keyof Quality, value: string) => {
    onUpdate({
      qualities: sideCharacter.qualities.map(q => (q.id === id ? { ...q, [field]: value } : q)),
    });
  };

  const deleteQuality = (id: string) => {
    onUpdate({ qualities: sideCharacter.qualities.filter(q => q.id !== id) });
  };

  const isBattlegroup = sideCharacter.battlegroup !== null;

  const toggleBattlegroup = (checked: boolean) => {
    if (checked) {
      onUpdate({ battlegroup: { size: 3, drill: 1 } });
    } else {
      onUpdate({ battlegroup: null });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to List
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{sideCharacter.name}</h1>
          <p className="text-sm text-muted-foreground">Side Character Editor</p>
        </div>
      </div>

      {/* Main content grid - two columns on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - main character data */}
        <div className="lg:col-span-2 space-y-6">
          {/* Name and Battlegroup */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={sideCharacter.name}
                  onChange={e => onUpdate({ name: e.target.value })}
                  placeholder="Character name..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="battlegroup"
                  checked={isBattlegroup}
                  onCheckedChange={toggleBattlegroup}
                />
                <label
                  htmlFor="battlegroup"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  This is a Battlegroup
                </label>
              </div>

              {isBattlegroup && sideCharacter.battlegroup && (
                <div className="grid grid-cols-2 gap-4 pl-6">
                  <div>
                    <Label>Size (0-5)</Label>
                    <Input
                      type="number"
                      value={sideCharacter.battlegroup.size}
                      onChange={e =>
                        onUpdate({
                          battlegroup: {
                            ...sideCharacter.battlegroup!,
                            size: Math.max(0, Math.min(5, parseInt(e.target.value) || 0)),
                          },
                        })
                      }
                      min={0}
                      max={5}
                    />
                  </div>
                  <div>
                    <Label>Drill (0-5)</Label>
                    <Input
                      type="number"
                      value={sideCharacter.battlegroup.drill}
                      onChange={e =>
                        onUpdate({
                          battlegroup: {
                            ...sideCharacter.battlegroup!,
                            drill: Math.max(0, Math.min(5, parseInt(e.target.value) || 0)),
                          },
                        })
                      }
                      min={0}
                      max={5}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dice Pools */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Dice Pools</CardTitle>
                <Button onClick={addPool} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Pool
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {sideCharacter.pools.map(pool => (
                <div key={pool.id} className="space-y-2 p-3 border rounded">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label className="text-xs">Type</Label>
                      <Select
                        value={pool.type}
                        onValueChange={(v: DicePoolType) => updatePool(pool.id, "type", v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="primary">Primary</SelectItem>
                          <SelectItem value="secondary">Secondary</SelectItem>
                          <SelectItem value="tertiary">Tertiary</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Dice</Label>
                      <Input
                        type="number"
                        value={pool.value}
                        onChange={e => updatePool(pool.id, "value", parseInt(e.target.value) || 0)}
                        min={0}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deletePool(pool.id)}
                        className="w-full"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Action</Label>
                    <Input
                      value={pool.action}
                      onChange={e => updatePool(pool.id, "action", e.target.value)}
                      placeholder="e.g., fighting, persuasion, stealth..."
                    />
                  </div>
                </div>
              ))}
              {sideCharacter.pools.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No pools yet. Add one above.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Combat Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Combat Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label>Defense</Label>
                  <Input
                    type="number"
                    value={sideCharacter.defense}
                    onChange={e => onUpdate({ defense: Math.max(0, parseInt(e.target.value) || 0) })}
                    min={0}
                  />
                </div>
                <div>
                  <Label>Hardness</Label>
                  <Input
                    type="number"
                    value={sideCharacter.hardness}
                    onChange={e => onUpdate({ hardness: Math.max(0, parseInt(e.target.value) || 0) })}
                    min={0}
                  />
                </div>
                <div>
                  <Label>Soak</Label>
                  <Input
                    type="number"
                    value={sideCharacter.soak}
                    onChange={e => onUpdate({ soak: Math.max(0, parseInt(e.target.value) || 0) })}
                    min={0}
                  />
                </div>
                <div>
                  <Label>Resolve</Label>
                  <Input
                    type="number"
                    value={sideCharacter.resolve}
                    onChange={e => onUpdate({ resolve: Math.max(0, parseInt(e.target.value) || 0) })}
                    min={0}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Weapon Notes</Label>
                  <Textarea
                    value={sideCharacter.weaponNotes || ""}
                    onChange={e => onUpdate({ weaponNotes: e.target.value })}
                    placeholder="Weapon details..."
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Armor Notes</Label>
                  <Textarea
                    value={sideCharacter.armorNotes || ""}
                    onChange={e => onUpdate({ armorNotes: e.target.value })}
                    placeholder="Armor details..."
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Essence */}
          <Card>
            <CardHeader>
              <CardTitle>Essence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label>Rating</Label>
                  <Input
                    type="number"
                    value={sideCharacter.essence.rating}
                    onChange={e =>
                      onUpdate({
                        essence: {
                          ...sideCharacter.essence,
                          rating: Math.max(1, parseInt(e.target.value) || 1),
                        },
                      })
                    }
                    min={1}
                  />
                </div>
                <div>
                  <Label>Motes</Label>
                  <Input
                    type="number"
                    value={sideCharacter.essence.motes}
                    onChange={e =>
                      onUpdate({
                        essence: {
                          ...sideCharacter.essence,
                          motes: Math.max(0, parseInt(e.target.value) || 0),
                        },
                      })
                    }
                    min={0}
                  />
                </div>
                <div>
                  <Label>Commitments</Label>
                  <Input
                    type="number"
                    value={sideCharacter.essence.commitments}
                    onChange={e =>
                      onUpdate({
                        essence: {
                          ...sideCharacter.essence,
                          commitments: Math.max(0, parseInt(e.target.value) || 0),
                        },
                      })
                    }
                    min={0}
                  />
                </div>
                <div>
                  <Label>Spent</Label>
                  <Input
                    type="number"
                    value={sideCharacter.essence.spent}
                    onChange={e =>
                      onUpdate({
                        essence: {
                          ...sideCharacter.essence,
                          spent: Math.max(0, parseInt(e.target.value) || 0),
                        },
                      })
                    }
                    min={0}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Levels */}
          <Card>
            <CardHeader>
              <CardTitle>Health Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label>Zero Penalty</Label>
                  <Input
                    type="number"
                    value={sideCharacter.healthLevels.zero}
                    onChange={e =>
                      onUpdate({
                        healthLevels: {
                          ...sideCharacter.healthLevels,
                          zero: Math.max(0, parseInt(e.target.value) || 0),
                        },
                      })
                    }
                    min={0}
                  />
                </div>
                <div>
                  <Label>-1 Penalty</Label>
                  <Input
                    type="number"
                    value={sideCharacter.healthLevels.minusOne}
                    onChange={e =>
                      onUpdate({
                        healthLevels: {
                          ...sideCharacter.healthLevels,
                          minusOne: Math.max(0, parseInt(e.target.value) || 0),
                        },
                      })
                    }
                    min={0}
                  />
                </div>
                <div>
                  <Label>-2 Penalty</Label>
                  <Input
                    type="number"
                    value={sideCharacter.healthLevels.minusTwo}
                    onChange={e =>
                      onUpdate({
                        healthLevels: {
                          ...sideCharacter.healthLevels,
                          minusTwo: Math.max(0, parseInt(e.target.value) || 0),
                        },
                      })
                    }
                    min={0}
                  />
                </div>
                <div>
                  <Label>Incapacitated</Label>
                  <Input
                    type="number"
                    value={sideCharacter.healthLevels.incap}
                    onChange={e =>
                      onUpdate({
                        healthLevels: {
                          ...sideCharacter.healthLevels,
                          incap: Math.max(0, parseInt(e.target.value) || 0),
                        },
                      })
                    }
                    min={0}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Qualities */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Qualities</CardTitle>
                <Button onClick={addQuality} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {sideCharacter.qualities.map(quality => (
                <div key={quality.id} className="border rounded p-3 space-y-3">
                  <div>
                    <Label className="text-xs">Title</Label>
                    <Input
                      value={quality.title}
                      onChange={e => updateQuality(quality.id, "title", e.target.value)}
                      placeholder="Quality title..."
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Category</Label>
                    <Select
                      value={quality.category}
                      onValueChange={v => updateQuality(quality.id, "category", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="trait">Trait</SelectItem>
                        <SelectItem value="ability">Ability</SelectItem>
                        <SelectItem value="limitation">Limitation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Description</Label>
                    <Textarea
                      value={quality.description}
                      onChange={e => updateQuality(quality.id, "description", e.target.value)}
                      placeholder="Quality description..."
                      rows={2}
                    />
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs text-muted-foreground">Added: {quality.dateCreated}</span>
                    <Button variant="destructive" size="sm" onClick={() => deleteQuality(quality.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
              {sideCharacter.qualities.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No qualities yet. Click + to add one.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SideCharacterEditor;

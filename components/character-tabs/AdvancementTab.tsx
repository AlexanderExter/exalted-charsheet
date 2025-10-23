"use client";

// Advancement Tab Component - Milestones and character progression management

import React, { useCallback, useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import type { AdvancementEntry, AdvancementStatus } from "@/lib/character-types";
import { useCharacterContext } from "@/hooks/CharacterContext";
import { SortableList } from "@/components/common/SortableList";

export const AdvancementTab: React.FC = React.memo(() => {
  const { character, updateCharacter } = useCharacterContext();
  const [showAdvancementLog, setShowAdvancementLog] = useState(false);

  // Advancement entry management functions
  const addAdvancementEntry = useCallback(() => {
    const newEntry: AdvancementEntry = {
      id: crypto.randomUUID(),
      item: "",
      status: "Planned",
      timestamp: new Date().toLocaleDateString(),
      description: "",
    };

    updateCharacter({
      advancement: [...(character.advancement || []), newEntry],
    });
  }, [character, updateCharacter]);

  const updateAdvancementEntry = useCallback(
    (
      id: string,
      field: keyof AdvancementEntry,
      value: AdvancementEntry[keyof AdvancementEntry]
    ) => {
      updateCharacter({
        advancement: (character.advancement || []).map(entry =>
          entry.id === id ? { ...entry, [field]: value } : entry
        ),
      });
    },
    [character, updateCharacter]
  );

  const deleteAdvancementEntry = useCallback(
    (id: string) => {
      updateCharacter({
        advancement: (character.advancement || []).filter(entry => entry.id !== id),
      });
    },
    [character, updateCharacter]
  );

  // Milestone calculation helpers
  const getSpentCount = (status: AdvancementStatus) => {
    return (character?.advancement || []).filter(entry => entry.status === status).length;
  };

  const getRemainingCount = (
    milestoneType: "personal" | "exalt" | "minor" | "major",
    status: AdvancementStatus
  ) => {
    const accrued = character?.milestones?.[milestoneType] || 0;
    const spent = getSpentCount(status);
    return accrued - spent;
  };

  return (
    <div className="space-y-6">
      {/* Milestone Budget */}
      <Card>
        <CardHeader>
          <CardTitle>Milestone Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Personal Milestones */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-info">Personal Milestones</Label>
              <div className="space-y-2">
                <div>
                  <Label htmlFor="personal-accrued" className="text-xs text-muted-foreground">
                    Accrued
                  </Label>
                  <Input
                    id="personal-accrued"
                    type="number"
                    value={character?.milestones?.personal || 0}
                    onChange={e => {
                      const value = Number.parseInt(e.target.value) || 0;
                      updateCharacter({
                        milestones: { ...character.milestones, personal: value },
                      });
                    }}
                    className={`text-center ${(character?.milestones?.personal || 0) < 0 ? "text-destructive border-destructive/30" : ""}`}
                  />
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">
                    Spent:{" "}
                    <span className="font-bold text-info">
                      {getSpentCount("Paid with Personal")}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Remaining:{" "}
                    <span className="font-bold">
                      {getRemainingCount("personal", "Paid with Personal")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Exalt Milestones */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-info">Exalt Milestones</Label>
              <div className="space-y-2">
                <div>
                  <Label htmlFor="exalt-accrued" className="text-xs text-muted-foreground">
                    Accrued
                  </Label>
                  <Input
                    id="exalt-accrued"
                    type="number"
                    value={character?.milestones?.exalt || 0}
                    onChange={e => {
                      const value = Number.parseInt(e.target.value) || 0;
                      updateCharacter({
                        milestones: { ...character.milestones, exalt: value },
                      });
                    }}
                    className={`text-center ${(character?.milestones?.exalt || 0) < 0 ? "text-destructive border-destructive/30" : ""}`}
                  />
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">
                    Spent:{" "}
                    <span className="font-bold text-info">
                      {getSpentCount("Paid with Exalt")}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Remaining:{" "}
                    <span className="font-bold">
                      {getRemainingCount("exalt", "Paid with Exalt")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Minor Milestones */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-success">Minor Milestones</Label>
              <div className="space-y-2">
                <div>
                  <Label htmlFor="minor-accrued" className="text-xs text-muted-foreground">
                    Accrued
                  </Label>
                  <Input
                    id="minor-accrued"
                    type="number"
                    value={character?.milestones?.minor || 0}
                    onChange={e => {
                      const value = Number.parseInt(e.target.value) || 0;
                      updateCharacter({
                        milestones: { ...character.milestones, minor: value },
                      });
                    }}
                    className={`text-center ${(character?.milestones?.minor || 0) < 0 ? "text-destructive border-destructive/30" : ""}`}
                  />
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">
                    Spent:{" "}
                    <span className="font-bold text-success">
                      {getSpentCount("Paid with Minor")}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Remaining:{" "}
                    <span className="font-bold">
                      {getRemainingCount("minor", "Paid with Minor")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Major Milestones */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-destructive">Major Milestones</Label>
              <div className="space-y-2">
                <div>
                  <Label htmlFor="major-accrued" className="text-xs text-muted-foreground">
                    Accrued
                  </Label>
                  <Input
                    id="major-accrued"
                    type="number"
                    value={character?.milestones?.major || 0}
                    onChange={e => {
                      const value = Number.parseInt(e.target.value) || 0;
                      updateCharacter({
                        milestones: { ...character.milestones, major: value },
                      });
                    }}
                    className={`text-center ${(character?.milestones?.major || 0) < 0 ? "text-destructive border-destructive/30" : ""}`}
                  />
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">
                    Spent:{" "}
                    <span className="font-bold text-destructive">
                      {getSpentCount("Paid with Major")}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Remaining:{" "}
                    <span className="font-bold">
                      {getRemainingCount("major", "Paid with Major")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Planned Advancements:</span>
              <span className="font-bold text-lg">{getSpentCount("Planned")}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advancement Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <button
              onClick={() => setShowAdvancementLog(!showAdvancementLog)}
              className="flex items-center gap-2 text-xl font-bold text-foreground/80 hover:text-foreground"
            >
              {showAdvancementLog ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
              Advancement Log ({(character?.advancement || []).length} entries)
            </button>
            <Button
              onClick={addAdvancementEntry}
              size="sm"
              className="bg-warning hover:bg-warning"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Entry
            </Button>
          </CardTitle>
        </CardHeader>
        {showAdvancementLog && (
          <CardContent>
            {(character?.advancement || []).length === 0 ? (
              <p className="text-muted-foreground/80 italic">No advancement entries yet.</p>
            ) : (
              <SortableList
                items={character?.advancement || []}
                onReorder={items => updateCharacter({ advancement: items })}
                renderItem={entry => (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`entry-item-${entry.id}`}>Advancement Item</Label>
                        <Input
                          id={`entry-item-${entry.id}`}
                          value={entry.item}
                          onChange={e => updateAdvancementEntry(entry.id, "item", e.target.value)}
                          placeholder="e.g., Increase Awareness to 3, Learn Flying Blade Technique"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`entry-status-${entry.id}`}>Status</Label>
                        <Select
                          value={entry.status}
                          onValueChange={(value: AdvancementStatus) =>
                            updateAdvancementEntry(entry.id, "status", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Planned">Planned</SelectItem>
                            <SelectItem value="Paid with Personal">Paid with Personal</SelectItem>
                            <SelectItem value="Paid with Exalt">Paid with Exalt</SelectItem>
                            <SelectItem value="Paid with Minor">Paid with Minor</SelectItem>
                            <SelectItem value="Paid with Major">Paid with Major</SelectItem>
                            <SelectItem value="Initial">Initial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {entry.description !== undefined && (
                      <div>
                        <Label htmlFor={`entry-description-${entry.id}`}>Description</Label>
                        <Textarea
                          id={`entry-description-${entry.id}`}
                          value={entry.description || ""}
                          onChange={e =>
                            updateAdvancementEntry(entry.id, "description", e.target.value)
                          }
                          placeholder="Additional notes about this advancement..."
                          rows={2}
                          className="resize-none"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground/80">Added: {entry.timestamp}</div>
                      <Button
                        onClick={() => deleteAdvancementEntry(entry.id)}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              />
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
});

AdvancementTab.displayName = "AdvancementTab";

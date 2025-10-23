"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DramaticInjury } from "@/lib/character-types";

interface DramaticInjuriesListProps {
  injuries: DramaticInjury[];
  addDramaticInjury: () => void;
  updateDramaticInjury: <K extends keyof DramaticInjury>(
    id: string,
    field: K,
    value: DramaticInjury[K]
  ) => void;
  deleteDramaticInjury: (id: string) => void;
}

export const DramaticInjuriesList: React.FC<DramaticInjuriesListProps> = ({
  injuries,
  addDramaticInjury,
  updateDramaticInjury,
  deleteDramaticInjury,
}) => {
  return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-foreground/80">Dramatic Injuries</Label>
          <Button onClick={addDramaticInjury} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-1" />
            Add Injury
          </Button>
        </div>

        {injuries.length === 0 ? (
          <p className="text-muted-foreground/80 italic text-sm">No dramatic injuries.</p>
        ) : (
          <div className="space-y-2">
            {injuries.map(injury => (
              <div
                key={injury.id}
                className={`flex items-center gap-2 p-2 rounded ${
                  injury.isHealed
                    ? "bg-success/10 border border-success/20"
                    : "bg-destructive/10 border border-destructive/20"
                }`}
              >
                <Input
                  value={injury.description}
                  onChange={e => updateDramaticInjury(injury.id, "description", e.target.value)}
                  placeholder="Injury description..."
                  className={`flex-1 ${
                    injury.isHealed ? "text-success bg-success/10" : "text-destructive bg-destructive/10"
                  }`}
                />
                <Button
                  onClick={() => updateDramaticInjury(injury.id, "isHealed", !injury.isHealed)}
                  size="sm"
                  variant={injury.isHealed ? "default" : "outline"}
                  className={
                    injury.isHealed
                      ? "bg-success hover:bg-success"
                      : "text-destructive border-destructive/30 hover:bg-destructive/10"
                  }
                >
                  {injury.isHealed ? "Healed" : "Heal"}
                </Button>
                <Button
                  onClick={() => deleteDramaticInjury(injury.id)}
                  size="sm"
                  variant="destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
};

DramaticInjuriesList.displayName = "DramaticInjuriesList";

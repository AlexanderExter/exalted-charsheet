"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DramaticInjury } from "@/lib/character-types";
import type { Draft } from "immer";

interface DramaticInjuriesListProps {
  injuries: DramaticInjury[];
  addDramaticInjury: () => void;
  updateDramaticInjury: <K extends keyof DramaticInjury>(
    id: string,
    field: K,
    value: Draft<DramaticInjury>[K]
  ) => void;
  deleteDramaticInjury: (id: string) => void;
}

export const DramaticInjuriesList: React.FC<DramaticInjuriesListProps> = React.memo(({
  injuries,
  addDramaticInjury,
  updateDramaticInjury,
  deleteDramaticInjury,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-gray-700">Dramatic Injuries</Label>
        <Button onClick={addDramaticInjury} size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-1" />
          Add Injury
        </Button>
      </div>

      {injuries.length === 0 ? (
        <p className="text-gray-500 italic text-sm">No dramatic injuries.</p>
      ) : (
        <div className="space-y-2">
          {injuries.map(injury => (
            <div
              key={injury.id}
              className={`flex items-center gap-2 p-2 rounded ${
                injury.isHealed
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <Input
                value={injury.description}
                onChange={e => updateDramaticInjury(injury.id, "description", e.target.value)}
                placeholder="Injury description..."
                className={`flex-1 ${
                  injury.isHealed ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"
                }`}
              />
              <Button
                onClick={() => updateDramaticInjury(injury.id, "isHealed", !injury.isHealed)}
                size="sm"
                variant={injury.isHealed ? "default" : "outline"}
                className={
                  injury.isHealed
                    ? "bg-green-600 hover:bg-green-700"
                    : "text-red-600 border-red-300 hover:bg-red-50"
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
});

DramaticInjuriesList.displayName = "DramaticInjuriesList";

"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ArmorPiece } from "@/lib/character-types";
import { ArmorEditor } from "@/components/equipment/ArmorEditor";
import { SortableList } from "@/components/common/SortableList";

interface ArmorListProps {
  armor: ArmorPiece[];
  addArmor: () => void;
  updateArmor: (id: string, field: keyof ArmorPiece, value: ArmorPiece[keyof ArmorPiece]) => void;
  deleteArmor: (id: string) => void;
  reorderArmor: (armor: ArmorPiece[]) => void;
}

export const ArmorList: React.FC<ArmorListProps> = React.memo(({
  armor,
  addArmor,
  updateArmor,
  deleteArmor,
  reorderArmor,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Armor
          <Button onClick={addArmor} size="sm" className="bg-gray-600 hover:bg-gray-700">
            <Plus className="w-4 h-4 mr-1" />
            Add Armor
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {armor.length === 0 ? (
          <p className="text-gray-500 italic">No armor equipped.</p>
        ) : (
          <SortableList
            items={armor}
            onReorder={reorderArmor}
            renderItem={piece => (
              <ArmorEditor
                armor={piece}
                updateArmor={updateArmor}
                deleteArmor={deleteArmor}
              />
            )}
          />
        )}
      </CardContent>
    </Card>
  );
});

ArmorList.displayName = "ArmorList";

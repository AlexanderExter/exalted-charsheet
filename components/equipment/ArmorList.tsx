import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ArmorPiece } from "@/lib/character-types";
import { ArmorEditor } from "@/components/equipment/ArmorEditor";

interface ArmorListProps {
  armor: ArmorPiece[];
  addArmor: () => void;
  updateArmor: (id: string, field: keyof ArmorPiece, value: ArmorPiece[keyof ArmorPiece]) => void;
  deleteArmor: (id: string) => void;
}

export const ArmorList: React.FC<ArmorListProps> = ({
  armor,
  addArmor,
  updateArmor,
  deleteArmor,
}) => (
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
        <div className="space-y-4">
          {armor.map(piece => (
            <ArmorEditor
              key={piece.id}
              armor={piece}
              updateArmor={updateArmor}
              deleteArmor={deleteArmor}
            />
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

ArmorList.displayName = "ArmorList";

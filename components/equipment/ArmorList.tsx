import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ArmorPiece } from "@/lib/character-types";
import { ArmorEditor } from "@/components/equipment/ArmorEditor";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface ArmorListProps {
  armor: ArmorPiece[];
  addArmor: () => void;
  updateArmor: (id: string, field: keyof ArmorPiece, value: ArmorPiece[keyof ArmorPiece]) => void;
  deleteArmor: (id: string) => void;
  reorderArmor: (armor: ArmorPiece[]) => void;
}

const SortableArmorItem: React.FC<{
  piece: ArmorPiece;
  updateArmor: (id: string, field: keyof ArmorPiece, value: ArmorPiece[keyof ArmorPiece]) => void;
  deleteArmor: (id: string) => void;
}> = ({ piece, updateArmor, deleteArmor }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: piece.id,
  });
  const style: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ArmorEditor armor={piece} updateArmor={updateArmor} deleteArmor={deleteArmor} />
    </div>
  );
};

export const ArmorList: React.FC<ArmorListProps> = ({
  armor,
  addArmor,
  updateArmor,
  deleteArmor,
  reorderArmor,
}) => {
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const oldIndex = armor.findIndex(a => a.id === active.id);
    const newIndex = armor.findIndex(a => a.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      reorderArmor(arrayMove(armor, oldIndex, newIndex));
    }
  };

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
          <DndContext onDragEnd={handleDragEnd}>
            <SortableContext items={armor.map(a => a.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {armor.map(piece => (
                  <SortableArmorItem
                    key={piece.id}
                    piece={piece}
                    updateArmor={updateArmor}
                    deleteArmor={deleteArmor}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </CardContent>
    </Card>
  );
};

ArmorList.displayName = "ArmorList";

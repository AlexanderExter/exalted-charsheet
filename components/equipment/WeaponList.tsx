'use client';

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Weapon } from "@/lib/character-types";
import { WeaponEditor } from "@/components/equipment/WeaponEditor";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface WeaponListProps {
  weapons: Weapon[];
  addWeapon: () => void;
  updateWeapon: (id: string, field: keyof Weapon, value: Weapon[keyof Weapon]) => void;
  deleteWeapon: (id: string) => void;
  reorderWeapons: (weapons: Weapon[]) => void;
}

const SortableWeaponItem: React.FC<{
  weapon: Weapon;
  updateWeapon: (id: string, field: keyof Weapon, value: Weapon[keyof Weapon]) => void;
  deleteWeapon: (id: string) => void;
}> = ({ weapon, updateWeapon, deleteWeapon }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: weapon.id,
  });
  const style: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <WeaponEditor weapon={weapon} updateWeapon={updateWeapon} deleteWeapon={deleteWeapon} />
    </div>
  );
};

export const WeaponList: React.FC<WeaponListProps> = ({
  weapons,
  addWeapon,
  updateWeapon,
  deleteWeapon,
  reorderWeapons,
}) => {
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const oldIndex = weapons.findIndex(w => w.id === active.id);
    const newIndex = weapons.findIndex(w => w.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      reorderWeapons(arrayMove(weapons, oldIndex, newIndex));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Weapons
          <Button onClick={addWeapon} size="sm" className="bg-red-600 hover:bg-red-700">
            <Plus className="w-4 h-4 mr-1" />
            Add Weapon
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {weapons.length === 0 ? (
          <p className="text-gray-500 italic">No weapons equipped.</p>
        ) : (
          <DndContext onDragEnd={handleDragEnd}>
            <SortableContext items={weapons.map(w => w.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {weapons.map(w => (
                  <SortableWeaponItem
                    key={w.id}
                    weapon={w}
                    updateWeapon={updateWeapon}
                    deleteWeapon={deleteWeapon}
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

WeaponList.displayName = "WeaponList";

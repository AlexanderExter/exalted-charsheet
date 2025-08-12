"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Weapon } from "@/lib/character-types";
import { WeaponEditor } from "@/components/equipment/WeaponEditor";
import { SortableList } from "@/components/common/SortableList";

interface WeaponListProps {
  weapons: Weapon[];
  addWeapon: () => void;
  updateWeapon: (id: string, field: keyof Weapon, value: Weapon[keyof Weapon]) => void;
  deleteWeapon: (id: string) => void;
  reorderWeapons: (weapons: Weapon[]) => void;
}

export const WeaponList: React.FC<WeaponListProps> = ({
  weapons,
  addWeapon,
  updateWeapon,
  deleteWeapon,
  reorderWeapons,
}) => {
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
          <SortableList
            items={weapons}
            onReorder={reorderWeapons}
            renderItem={w => (
              <WeaponEditor
                weapon={w}
                updateWeapon={updateWeapon}
                deleteWeapon={deleteWeapon}
              />
            )}
          />
        )}
      </CardContent>
    </Card>
  );
};

WeaponList.displayName = "WeaponList";

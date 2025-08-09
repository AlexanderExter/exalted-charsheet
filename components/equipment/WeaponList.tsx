import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Weapon } from "@/lib/character-types";
import { WeaponEditor } from "@/components/equipment/WeaponEditor";

interface WeaponListProps {
  weapons: Weapon[];
  addWeapon: () => void;
  updateWeapon: (id: string, field: keyof Weapon, value: Weapon[keyof Weapon]) => void;
  deleteWeapon: (id: string) => void;
}

export const WeaponList: React.FC<WeaponListProps> = ({
  weapons,
  addWeapon,
  updateWeapon,
  deleteWeapon,
}) => (
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
        <div className="space-y-4">
          {weapons.map(w => (
            <WeaponEditor
              key={w.id}
              weapon={w}
              updateWeapon={updateWeapon}
              deleteWeapon={deleteWeapon}
            />
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

WeaponList.displayName = "WeaponList";

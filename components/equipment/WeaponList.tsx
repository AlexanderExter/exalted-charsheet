"use client";

import React from "react";
import type { Weapon } from "@/lib/character-types";
import { WeaponEditor } from "@/components/equipment/WeaponEditor";
import { GenericList } from "@/components/common/GenericList";

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
    <GenericList
      title="Weapons"
      items={weapons}
      emptyMessage="No weapons equipped."
      addButtonText="Add Weapon"
      buttonColor="bg-red-600 hover:bg-red-700"
      onAdd={addWeapon}
      onReorder={reorderWeapons}
      renderItem={w => (
        <WeaponEditor weapon={w} updateWeapon={updateWeapon} deleteWeapon={deleteWeapon} />
      )}
    />
  );
};

WeaponList.displayName = "WeaponList";

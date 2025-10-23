"use client";

import React from "react";
import type { ArmorPiece } from "@/lib/character-types";
import { ArmorEditor } from "@/components/equipment/ArmorEditor";
import { GenericList } from "@/components/common/GenericList";

interface ArmorListProps {
  armor: ArmorPiece[];
  addArmor: () => void;
  updateArmor: (id: string, field: keyof ArmorPiece, value: ArmorPiece[keyof ArmorPiece]) => void;
  deleteArmor: (id: string) => void;
  reorderArmor: (armor: ArmorPiece[]) => void;
}

export const ArmorList: React.FC<ArmorListProps> = ({
  armor,
  addArmor,
  updateArmor,
  deleteArmor,
  reorderArmor,
}) => {
  return (
    <GenericList
      title="Armor"
      items={armor}
      emptyMessage="No armor equipped."
      addButtonText="Add Armor"
      buttonColor="bg-gray-600 hover:bg-gray-700"
      onAdd={addArmor}
      onReorder={reorderArmor}
      renderItem={piece => (
        <ArmorEditor armor={piece} updateArmor={updateArmor} deleteArmor={deleteArmor} />
      )}
    />
  );
};

ArmorList.displayName = "ArmorList";

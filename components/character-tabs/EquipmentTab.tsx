"use client";

// Equipment Tab Component - Armor, weapons, and equipment management

import React from "react";
import type { ArmorPiece, Weapon } from "@/lib/character-types";
import { useCharacterContext } from "@/hooks/CharacterContext";
import { ArmorList } from "@/components/equipment/ArmorList";
import { WeaponList } from "@/components/equipment/WeaponList";
import { EquipmentTagReference } from "@/components/equipment/EquipmentTagReference";

export const EquipmentTab: React.FC = () => {
  const { character, updateCharacter } = useCharacterContext();

  const addArmor = () => {
    const newArmor: ArmorPiece = {
      id: crypto.randomUUID(),
      name: "",
      type: "light",
      soak: 0,
      hardness: 0,
      mobility: 0,
      tags: [],
      description: "",
    };

    updateCharacter({
      armor: [...(character.armor || []), newArmor],
    });
  };

  const updateArmor = (id: string, field: keyof ArmorPiece, value: ArmorPiece[keyof ArmorPiece]) => {
    updateCharacter({
      armor: (character.armor || []).map(armor =>
        armor.id === id ? { ...armor, [field]: value } : armor
      ),
    });
  };

  const deleteArmor = (id: string) => {
    updateCharacter({
      armor: (character.armor || []).filter(armor => armor.id !== id),
    });
  };

  const reorderArmor = (armorList: ArmorPiece[]) => {
    updateCharacter({ armor: armorList });
  };

  const addWeapon = () => {
    const newWeapon: Weapon = {
      id: crypto.randomUUID(),
      name: "",
      accuracy: 0,
      damage: 0,
      defense: 0,
      overwhelming: 0,
      range: "close",
      tags: [],
      description: "",
    };

    updateCharacter({
      weapons: [...(character.weapons || []), newWeapon],
    });
  };

  const updateWeapon = (id: string, field: keyof Weapon, value: Weapon[keyof Weapon]) => {
    updateCharacter({
      weapons: (character.weapons || []).map(weapon =>
        weapon.id === id ? { ...weapon, [field]: value } : weapon
      ),
    });
  };

  const deleteWeapon = (id: string) => {
    updateCharacter({
      weapons: (character.weapons || []).filter(weapon => weapon.id !== id),
    });
  };

  const reorderWeapons = (weaponList: Weapon[]) => {
    updateCharacter({ weapons: weaponList });
  };

  return (
    <div className="space-y-6">
      <ArmorList
        armor={character.armor || []}
        addArmor={addArmor}
        updateArmor={updateArmor}
        deleteArmor={deleteArmor}
        reorderArmor={reorderArmor}
      />

      <WeaponList
        weapons={character.weapons || []}
        addWeapon={addWeapon}
        updateWeapon={updateWeapon}
        deleteWeapon={deleteWeapon}
        reorderWeapons={reorderWeapons}
      />

      <EquipmentTagReference armor={character.armor || []} weapons={character.weapons || []} />
    </div>
  );
};


// Equipment Tab Component - Armor, weapons, and equipment management

import React, { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import type { ArmorPiece, Weapon } from "@/lib/character-types";
import { useCharacterContext } from "@/hooks/CharacterContext";
import { ArmorList } from "@/components/equipment/ArmorList";
import { WeaponList } from "@/components/equipment/WeaponList";
import { EquipmentTagReference } from "@/components/equipment/EquipmentTagReference";

export const EquipmentTab: React.FC = React.memo(() => {
  const { character, updateCharacter } = useCharacterContext();

  const addArmor = useCallback(() => {
    const newArmor: ArmorPiece = {
      id: uuidv4(),
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
  }, [character, updateCharacter]);

  const updateArmor = useCallback(
    (id: string, field: keyof ArmorPiece, value: ArmorPiece[keyof ArmorPiece]) => {
      updateCharacter({
        armor: (character.armor || []).map(armor =>
          armor.id === id ? { ...armor, [field]: value } : armor
        ),
      });
    },
    [character, updateCharacter]
  );

  const deleteArmor = useCallback(
    (id: string) => {
      updateCharacter({
        armor: (character.armor || []).filter(armor => armor.id !== id),
      });
    },
    [character, updateCharacter]
  );

  const addWeapon = useCallback(() => {
    const newWeapon: Weapon = {
      id: uuidv4(),
      name: "",
      accuracy: 0,
      damage: 0,
      defence: 0,
      overwhelming: 0,
      range: "close",
      tags: [],
      description: "",
    };

    updateCharacter({
      weapons: [...(character.weapons || []), newWeapon],
    });
  }, [character, updateCharacter]);

  const updateWeapon = useCallback(
    (id: string, field: keyof Weapon, value: Weapon[keyof Weapon]) => {
      updateCharacter({
        weapons: (character.weapons || []).map(weapon =>
          weapon.id === id ? { ...weapon, [field]: value } : weapon
        ),
      });
    },
    [character, updateCharacter]
  );

  const deleteWeapon = useCallback(
    (id: string) => {
      updateCharacter({
        weapons: (character.weapons || []).filter(weapon => weapon.id !== id),
      });
    },
    [character, updateCharacter]
  );

  return (
    <div className="space-y-6">
      <ArmorList
        armor={character.armor || []}
        addArmor={addArmor}
        updateArmor={updateArmor}
        deleteArmor={deleteArmor}
      />

      <WeaponList
        weapons={character.weapons || []}
        addWeapon={addWeapon}
        updateWeapon={updateWeapon}
        deleteWeapon={deleteWeapon}
      />

      <EquipmentTagReference armor={character.armor || []} weapons={character.weapons || []} />
    </div>
  );
});

EquipmentTab.displayName = "EquipmentTab";

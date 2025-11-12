// Default values and factory functions for Side Characters

import type { SideCharacter, SideCharacterEssence, HealthLevels } from "./character-types";

export function createDefaultSideCharacter(name: string): SideCharacter {
  return {
    id: crypto.randomUUID(),
    name,
    pools: [],
    essence: {
      motes: 10,
      commitments: 0,
      spent: 0,
      rating: 1,
    },
    healthLevels: {
      zero: 1,
      minusOne: 2,
      minusTwo: 2,
      incap: 1,
    },
    defense: 2,
    hardness: 0,
    soak: 2,
    resolve: 1,
    weaponNotes: "",
    armorNotes: "",
    qualities: [],
    battlegroup: null,
    bashingDamage: 0,
    lethalDamage: 0,
    aggravatedDamage: 0,
  };
}

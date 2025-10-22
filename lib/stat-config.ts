import type { AttributeType, AbilityType } from "./character-types";

export interface StatConfig<T extends string> {
  key: T;
  label: string;
  colorClass?: string;
}

export const attributeConfig: StatConfig<AttributeType>[] = [
  { key: "fortitude", label: "Fortitude", colorClass: "text-fortitude" },
  { key: "finesse", label: "Finesse", colorClass: "text-finesse" },
  { key: "force", label: "Force", colorClass: "text-force" },
];

export const abilityConfig: StatConfig<AbilityType>[] = [
  { key: "athletics", label: "Athletics" },
  { key: "awareness", label: "Awareness" },
  { key: "closeCombat", label: "Close Combat" },
  { key: "craft", label: "Craft" },
  { key: "embassy", label: "Embassy" },
  { key: "integrity", label: "Integrity" },
  { key: "navigate", label: "Navigate" },
  { key: "physique", label: "Physique" },
  { key: "presence", label: "Presence" },
  { key: "performance", label: "Performance" },
  { key: "rangedCombat", label: "Ranged Combat" },
  { key: "sagacity", label: "Sagacity" },
  { key: "stealth", label: "Stealth" },
  { key: "war", label: "War" },
];

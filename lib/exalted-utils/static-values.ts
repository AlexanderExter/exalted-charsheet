import type { StatBlock, Attributes, ArmorPiece } from "../character-types";
import { calculateStatTotal, getHighestAttributeValue } from ".";
import { clampModifier } from "./validation";

export const calculateEvasion = (
  athletics: StatBlock,
  attributes: Attributes,
  evasionModifier: number = 0,
): number => {
  const athleticsTotal = calculateStatTotal(athletics);
  const highestAttr = getHighestAttributeValue(attributes);
  const base = Math.ceil((athleticsTotal + highestAttr) / 2);
  return Math.max(0, base + clampModifier(evasionModifier));
};

export const calculateParry = (
  closeCombat: StatBlock,
  attributes: Attributes,
  parryModifier: number = 0,
): number => {
  const closeCombatTotal = calculateStatTotal(closeCombat);
  const highestAttr = getHighestAttributeValue(attributes);
  const base = Math.ceil((closeCombatTotal + highestAttr) / 2);
  return Math.max(0, base + clampModifier(parryModifier));
};

export const calculateDefense = (
  evasion: number,
  parry: number,
  defenseModifier: number = 0,
): number => {
  const base = Math.max(evasion, parry);
  return Math.max(0, base + clampModifier(defenseModifier));
};

export const calculateResolve = (
  integrity: StatBlock,
  resolveModifier: number = 0,
): number => {
  const integrityTotal = calculateStatTotal(integrity);
  let base = 2;
  if (integrityTotal >= 1) base += 1;
  if (integrityTotal >= 3) base += 2;
  if (integrityTotal >= 5) base += 3;
  return Math.max(0, base + clampModifier(resolveModifier));
};

export const calculateSoak = (
  physique: StatBlock,
  armor: ArmorPiece[],
  soakModifier: number = 0,
): number => {
  const physiqueTotal = calculateStatTotal(physique);
  let base = 1;
  if (physiqueTotal >= 3) base += 1;

  const armorSoak = armor.reduce(
    (total, armorPiece) => total + armorPiece.soak,
    0,
  );

  return Math.max(0, base + armorSoak + clampModifier(soakModifier));
};

export const calculateHardness = (
  essenceRating: number,
  armor: ArmorPiece[],
  hardnessModifier: number = 0,
): number => {
  const base = essenceRating + 2;
  const armorHardness = armor.reduce(
    (total, armorPiece) => total + armorPiece.hardness,
    0,
  );
  return Math.max(0, base + armorHardness + clampModifier(hardnessModifier));
};


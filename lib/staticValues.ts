import type { StatBlock, Attributes, ArmorPiece } from "./character-types"

export const calculateStatTotal = (stat: StatBlock): number => {
  return (stat?.base || 0) + (stat?.added || 0) + (stat?.bonus || 0)
}

export const getHighestAttributeValue = (attributes: Attributes): number => {
  const fortitude = calculateStatTotal(attributes.fortitude)
  const finesse = calculateStatTotal(attributes.finesse)
  const force = calculateStatTotal(attributes.force)
  return Math.max(fortitude, finesse, force)
}

export const clampModifier = (value: number): number => {
  return Math.max(-5, Math.min(5, value))
}

export const calculateEvasion = (
  athletics: StatBlock,
  attributes: Attributes,
  evasionModifier: number = 0
): number => {
  const athleticsTotal = calculateStatTotal(athletics)
  const highestAttr = getHighestAttributeValue(attributes)
  const base = Math.ceil((athleticsTotal + highestAttr) / 2)
  return Math.max(0, base + clampModifier(evasionModifier))
}

export const calculateParry = (
  closeCombat: StatBlock,
  attributes: Attributes,
  parryModifier: number = 0
): number => {
  const closeCombatTotal = calculateStatTotal(closeCombat)
  const highestAttr = getHighestAttributeValue(attributes)
  const base = Math.ceil((closeCombatTotal + highestAttr) / 2)
  return Math.max(0, base + clampModifier(parryModifier))
}

export const calculateDefense = (
  evasion: number,
  parry: number,
  defenseModifier: number = 0
): number => {
  const base = Math.max(evasion, parry)
  return Math.max(0, base + clampModifier(defenseModifier))
}

export const calculateResolve = (
  integrity: StatBlock,
  resolveModifier: number = 0
): number => {
  const integrityTotal = calculateStatTotal(integrity)
  let base = 2
  if (integrityTotal >= 1) base += 1
  if (integrityTotal >= 3) base += 2
  if (integrityTotal >= 5) base += 3
  return Math.max(0, base + clampModifier(resolveModifier))
}

export const calculateSoak = (
  physique: StatBlock,
  armor: ArmorPiece[],
  soakModifier: number = 0
): number => {
  const physiqueTotal = calculateStatTotal(physique)
  let base = 1
  if (physiqueTotal >= 3) base += 1

  const armorSoak = armor.reduce(
    (total, armorPiece) => total + (Number.parseInt(armorPiece.soak.toString()) || 0),
    0
  )

  return Math.max(0, base + armorSoak + clampModifier(soakModifier))
}

export const calculateHardness = (
  essenceRating: number,
  armor: ArmorPiece[],
  hardnessModifier: number = 0
): number => {
  const base = essenceRating + 2
  const armorHardness = armor.reduce(
    (total, armorPiece) => total + (Number.parseInt(armorPiece.hardness.toString()) || 0),
    0
  )
  return Math.max(0, base + armorHardness + clampModifier(hardnessModifier))
}

export const validateStatValue = (value: number): number => {
  return Math.max(0, value)
}

export const validateEssenceRating = (rating: number): number => {
  return Math.max(1, Math.min(10, rating))
}

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}


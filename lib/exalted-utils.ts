// Pure utility functions for Exalted: Essence mechanics

import type { 
  AnimaLevel, 
  StatBlock, 
  Attributes, 
  Health, 
  HealthLevels, 
  ExaltType,
  Character,
  ArmorPiece 
} from './character-types'

// Core calculation utilities
export const calculateStatTotal = (stat: StatBlock): number => {
  return (stat?.base || 0) + (stat?.added || 0) + (stat?.bonus || 0)
}

export const getHighestAttributeValue = (attributes: Attributes): number => {
  const fortitude = calculateStatTotal(attributes.fortitude)
  const finesse = calculateStatTotal(attributes.finesse)
  const force = calculateStatTotal(attributes.force)
  return Math.max(fortitude, finesse, force)
}

// Anima system functions
export const getAnimaLevel = (anima: number): AnimaLevel => {
  if (anima <= 4) return "Dim"
  if (anima <= 6) return "Burning"
  if (anima <= 9) return "Bonfire"
  return "Iconic"
}

export const getActiveAnimaRulings = (anima: number): string[] => {
  const rulings: string[] = []
  if (anima >= 3) rulings.push("Anima Active Effect available")
  if (anima >= 5) rulings.push("Exalted nature can't be hidden")
  if (anima >= 10) rulings.push("Iconic effect available")
  return rulings
}

// Static value calculations
export const calculateEvasion = (
  athletics: StatBlock,
  attributes: Attributes,
  evasionModifier: number = 0
): number => {
  const athleticsTotal = calculateStatTotal(athletics)
  const highestAttr = getHighestAttributeValue(attributes)
  const base = Math.ceil((athleticsTotal + highestAttr) / 2)
  return Math.max(0, base + Math.max(-5, Math.min(5, evasionModifier)))
}

export const calculateParry = (
  closeCombat: StatBlock,
  attributes: Attributes,
  parryModifier: number = 0
): number => {
  const closeCombatTotal = calculateStatTotal(closeCombat)
  const highestAttr = getHighestAttributeValue(attributes)
  const base = Math.ceil((closeCombatTotal + highestAttr) / 2)
  return Math.max(0, base + Math.max(-5, Math.min(5, parryModifier)))
}

export const calculateDefense = (
  evasion: number,
  parry: number,
  defenseModifier: number = 0
): number => {
  const base = Math.max(evasion, parry)
  return Math.max(0, base + Math.max(-5, Math.min(5, defenseModifier)))
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
  return Math.max(0, base + Math.max(-5, Math.min(5, resolveModifier)))
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
  
  return Math.max(0, base + armorSoak + Math.max(-5, Math.min(5, soakModifier)))
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
  return Math.max(0, base + armorHardness + Math.max(-5, Math.min(5, hardnessModifier)))
}

// Health system calculations
export const calculateHealthLevels = (
  baseline: HealthLevels,
  oxBodyLevels: number,
  exaltType: ExaltType
): HealthLevels => {
  const clampedOxBody = Math.max(0, Math.min(5, oxBodyLevels))
  
  let oxBodyZero = 0
  let oxBodyMinusOne = 0
  let oxBodyMinusTwo = 0
  let oxBodyIncap = 0

  // Ox-Body calculations based on Exalt type
  switch (exaltType) {
    case "lunar":
      // Lunar Ox-Body: +1 -0, +2 -1, +2 -2
      if (clampedOxBody >= 1) { oxBodyZero += 1; oxBodyMinusOne += 2; oxBodyMinusTwo += 2 }
      if (clampedOxBody >= 2) { oxBodyZero += 1; oxBodyMinusOne += 2; oxBodyMinusTwo += 2 }
      if (clampedOxBody >= 3) { oxBodyZero += 1; oxBodyMinusOne += 2; oxBodyMinusTwo += 2 }
      if (clampedOxBody >= 4) { oxBodyZero += 1; oxBodyMinusOne += 2; oxBodyMinusTwo += 2 }
      if (clampedOxBody >= 5) { oxBodyZero += 1; oxBodyMinusOne += 2; oxBodyMinusTwo += 2 }
      break
    default:
      // Generic Ox-Body: +1 -1, +2 -2
      for (let i = 0; i < clampedOxBody; i++) {
        oxBodyMinusOne += 1
        oxBodyMinusTwo += 2
      }
  }

  return {
    zero: baseline.zero + oxBodyZero,
    minusOne: baseline.minusOne + oxBodyMinusOne,
    minusTwo: baseline.minusTwo + oxBodyMinusTwo,
    incap: baseline.incap + oxBodyIncap
  }
}

export const calculateHealthPenalty = (
  healthLevels: HealthLevels,
  bashingDamage: number,
  lethalDamage: number,
  aggravatedDamage: number
): number => {
  const totalDamage = bashingDamage + lethalDamage + aggravatedDamage
  
  // Determine penalty based on filled health levels
  let penalty = 0
  let damageCounter = totalDamage
  
  // -0 levels don't cause penalty
  damageCounter -= healthLevels.zero
  if (damageCounter <= 0) return 0
  
  // -1 levels cause -1 penalty
  if (damageCounter > 0) {
    penalty = -1
    damageCounter -= healthLevels.minusOne
    if (damageCounter <= 0) return penalty
  }
  
  // -2 levels cause -2 penalty
  if (damageCounter > 0) {
    penalty = -2
    damageCounter -= healthLevels.minusTwo
    if (damageCounter <= 0) return penalty
  }
  
  // Incapacitated
  if (damageCounter > 0) {
    penalty = -4
  }
  
  return penalty
}

// Dice pool calculations
export interface DicePoolResult {
  basePool: number
  extraDice: number
  totalPool: number
  cappedBonusDice: number
  actionPhrase: string
}

export const calculateDicePool = (
  attributeValue: number,
  abilityValue: number,
  targetNumber: number,
  doublesThreshold: number,
  extraDiceBonus: number,
  extraDiceNonBonus: number,
  extraSuccessBonus: number,
  extraSuccessNonBonus: number
): DicePoolResult => {
  const basePool = attributeValue + abilityValue
  const bonusDice = extraDiceBonus + extraDiceNonBonus
  const cappedBonusDice = Math.min(bonusDice, basePool)
  const totalPool = basePool + cappedBonusDice
  const extraDice = cappedBonusDice
  
  const bonusSuccesses = extraSuccessBonus + extraSuccessNonBonus
  const bonusText = bonusSuccesses > 0 ? ` +${bonusSuccesses} successes` : ""
  const actionPhrase = `Roll ${totalPool}, TN ${targetNumber} Double ${doublesThreshold}s${bonusText}`
  
  return {
    basePool,
    extraDice,
    totalPool,
    cappedBonusDice,
    actionPhrase
  }
}

// Validation utilities
export const clampModifier = (value: number): number => {
  return Math.max(-5, Math.min(5, value))
}

export const validateStatValue = (value: number): number => {
  return Math.max(0, value)
}

export const validateEssenceRating = (rating: number): number => {
  return Math.max(1, Math.min(10, rating))
}

// String formatting utilities
export const formatHealthLevel = (current: number, max: number): string => {
  return `${current}/${max}`
}

export const formatDicePool = (attribute: string, ability: string, pool: number): string => {
  return `${attribute} + ${ability} (${pool})`
}

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
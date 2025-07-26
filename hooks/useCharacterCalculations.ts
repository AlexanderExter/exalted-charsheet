// Character calculation hook for derived values

import { useMemo } from "react"
import type { Character } from "@/lib/character-types"
import {
  calculateStatTotal,
  getHighestAttributeValue,
  calculateEvasion,
  calculateParry,
  calculateDefense,
  calculateResolve,
  calculateSoak,
  calculateHardness,
  calculateHealthLevels,
  calculateHealthPenalty,
  calculateDicePool,
  type DicePoolResult,
} from "@/lib/exalted-utils"

export interface CharacterCalculations {
  // Static values
  defense: number
  evasion: number
  parry: number
  resolve: number
  soak: number
  hardness: number

  // Health calculations
  healthLevels: {
    zero: number
    minusOne: number
    minusTwo: number
    incap: number
  }
  healthPenalty: number

  // Attribute/ability helpers
  highestAttribute: number
  getAttributeTotal: (attributeKey: string) => number
  getAbilityTotal: (abilityKey: string) => number

  // Dice pool calculation
  dicePoolResult: DicePoolResult
}

export const useCharacterCalculations = (character: Character | null): CharacterCalculations => {
  return useMemo(() => {
    // Default values when no character
    if (!character) {
      return {
        defense: 0,
        evasion: 0,
        parry: 0,
        resolve: 2,
        soak: 1,
        hardness: 3,
        healthLevels: { zero: 2, minusOne: 2, minusTwo: 2, incap: 1 },
        healthPenalty: 0,
        highestAttribute: 1,
        getAttributeTotal: () => 0,
        getAbilityTotal: () => 0,
        dicePoolResult: {
          basePool: 0,
          extraDice: 0,
          totalPool: 0,
          cappedBonusDice: 0,
          actionPhrase: "Roll 0, TN 7 Double 10s",
        },
      }
    }

    // Helper functions
    const getAttributeTotal = (attributeKey: string): number => {
      const attribute = (character.attributes as any)[attributeKey]
      return attribute ? calculateStatTotal(attribute) : 0
    }

    const getAbilityTotal = (abilityKey: string): number => {
      const ability = (character.abilities as any)[abilityKey]
      return ability ? calculateStatTotal(ability) : 0
    }

    // Calculate highest attribute value
    const highestAttribute = getHighestAttributeValue(character.attributes)

    // Calculate static values
    const evasion = calculateEvasion(
      character.abilities.athletics,
      character.attributes,
      character.staticValues.evasionModifier
    )

    const parry = calculateParry(
      character.abilities.closeCombat,
      character.attributes,
      character.staticValues.parryModifier
    )

    const defense = calculateDefense(evasion, parry, character.staticValues.defenseModifier)

    const resolve = calculateResolve(
      character.abilities.integrity,
      character.staticValues.resolveModifier
    )

    const soak = calculateSoak(
      character.abilities.physique,
      character.armor,
      character.staticValues.soakModifier
    )

    const hardness = calculateHardness(
      character.essence.rating,
      character.armor,
      character.staticValues.hardnessModifier
    )

    // Calculate health
    const healthLevels = calculateHealthLevels(
      character.health.baseline,
      character.health.oxBodyLevels,
      character.health.exaltType
    )

    const healthPenalty = calculateHealthPenalty(
      healthLevels,
      character.health.bashingDamage,
      character.health.lethalDamage,
      character.health.aggravatedDamage
    )

    // Calculate dice pool
    const attributeValue = getAttributeTotal(character.dicePool.attribute)
    const abilityValue = getAbilityTotal(character.dicePool.ability)

    const dicePoolResult = calculateDicePool(
      attributeValue,
      abilityValue,
      character.dicePool.targetNumber,
      character.dicePool.doublesThreshold,
      character.dicePool.extraDiceBonus,
      character.dicePool.extraDiceNonBonus,
      character.dicePool.extraSuccessBonus,
      character.dicePool.extraSuccessNonBonus,
      character.dicePool.isStunted
    )

    return {
      defense,
      evasion,
      parry,
      resolve,
      soak,
      hardness,
      healthLevels,
      healthPenalty,
      highestAttribute,
      getAttributeTotal,
      getAbilityTotal,
      dicePoolResult,
    }
  }, [character])
}

// Specialized hooks for specific calculations
export const useStaticValues = (character: Character | null) => {
  return useMemo(() => {
    if (!character) {
      return { defense: 0, evasion: 0, parry: 0, resolve: 2, soak: 1, hardness: 3 }
    }

    const evasion = calculateEvasion(
      character.abilities.athletics,
      character.attributes,
      character.staticValues.evasionModifier
    )

    const parry = calculateParry(
      character.abilities.closeCombat,
      character.attributes,
      character.staticValues.parryModifier
    )

    const defense = calculateDefense(evasion, parry, character.staticValues.defenseModifier)
    const resolve = calculateResolve(
      character.abilities.integrity,
      character.staticValues.resolveModifier
    )
    const soak = calculateSoak(
      character.abilities.physique,
      character.armor,
      character.staticValues.soakModifier
    )
    const hardness = calculateHardness(
      character.essence.rating,
      character.armor,
      character.staticValues.hardnessModifier
    )

    return { defense, evasion, parry, resolve, soak, hardness }
  }, [character])
}

export const useHealthCalculations = (character: Character | null) => {
  return useMemo(() => {
    if (!character) {
      return {
        healthLevels: { zero: 2, minusOne: 2, minusTwo: 2, incap: 1 },
        healthPenalty: 0,
        totalHealthLevels: 7,
        damageTotal: 0,
      }
    }

    const healthLevels = calculateHealthLevels(
      character.health.baseline,
      character.health.oxBodyLevels,
      character.health.exaltType
    )

    const healthPenalty = calculateHealthPenalty(
      healthLevels,
      character.health.bashingDamage,
      character.health.lethalDamage,
      character.health.aggravatedDamage
    )

    const totalHealthLevels =
      healthLevels.zero + healthLevels.minusOne + healthLevels.minusTwo + healthLevels.incap
    const damageTotal =
      character.health.bashingDamage +
      character.health.lethalDamage +
      character.health.aggravatedDamage

    return {
      healthLevels,
      healthPenalty,
      totalHealthLevels,
      damageTotal,
    }
  }, [character])
}

export const useDicePoolCalculation = (character: Character | null) => {
  return useMemo(() => {
    if (!character) {
      return {
        basePool: 0,
        extraDice: 0,
        totalPool: 0,
        cappedBonusDice: 0,
        actionPhrase: "Roll 0, TN 7 Double 10s",
      }
    }

    const attributeValue = calculateStatTotal(
      (character.attributes as any)[character.dicePool.attribute]
    )
    const abilityValue = calculateStatTotal(
      (character.abilities as any)[character.dicePool.ability]
    )

    return calculateDicePool(
      attributeValue,
      abilityValue,
      character.dicePool.targetNumber,
      character.dicePool.doublesThreshold,
      character.dicePool.extraDiceBonus,
      character.dicePool.extraDiceNonBonus,
      character.dicePool.extraSuccessBonus,
      character.dicePool.extraSuccessNonBonus,
      character.dicePool.isStunted
    )
  }, [character])
}

// Default character templates and values for Exalted: Essence

import type {
  Character,
  StatBlock,
  Attributes,
  Abilities,
  Essence,
  StaticValues,
  Health,
  Milestones,
  DicePool,
  Combat,
  Social,
} from "./character-types"
import { v4 as uuidv4 } from "uuid"

// Default stat block
const createDefaultStatBlock = (baseValue: number = 0): StatBlock => ({
  base: baseValue,
  added: 0,
  bonus: 0,
})

// Default attributes (minimum 1 for all)
export const createDefaultAttributes = (): Attributes => ({
  fortitude: createDefaultStatBlock(1),
  finesse: createDefaultStatBlock(1),
  force: createDefaultStatBlock(1),
})

// Default abilities (all start at 0)
export const createDefaultAbilities = (): Abilities => ({
  athletics: createDefaultStatBlock(0),
  awareness: createDefaultStatBlock(0),
  closeCombat: createDefaultStatBlock(0),
  craft: createDefaultStatBlock(0),
  embassy: createDefaultStatBlock(0),
  integrity: createDefaultStatBlock(0),
  navigate: createDefaultStatBlock(0),
  physique: createDefaultStatBlock(0),
  presence: createDefaultStatBlock(0),
  performance: createDefaultStatBlock(0),
  rangedCombat: createDefaultStatBlock(0),
  sagacity: createDefaultStatBlock(0),
  stealth: createDefaultStatBlock(0),
  war: createDefaultStatBlock(0),
})

// Default essence pool
export const createDefaultEssence = (): Essence => ({
  motes: 5,
  commitments: 0,
  spent: 0,
  anima: 0,
  rating: 1,
})

// Default static value modifiers
export const createDefaultStaticValues = (): StaticValues => ({
  defenseModifier: 0,
  evasionModifier: 0,
  parryModifier: 0,
  resolveModifier: 0,
  soakModifier: 0,
  hardnessModifier: 0,
})

// Default health configuration
export const createDefaultHealth = (): Health => ({
  baseline: {
    zero: 2,
    minusOne: 2,
    minusTwo: 2,
    incap: 1,
  },
  oxBodyLevels: 0,
  exaltType: "lunar",
  bashingDamage: 0,
  lethalDamage: 0,
  aggravatedDamage: 0,
  dramaticInjuries: [],
})

// Default milestones
export const createDefaultMilestones = (): Milestones => ({
  personal: 0,
  exalt: 0,
  minor: 0,
  major: 0,
})

// Default dice pool configuration
export const createDefaultDicePool = (): DicePool => ({
  attribute: "fortitude",
  ability: "athletics",
  targetNumber: 7,
  doublesThreshold: 10,
  extraDiceBonus: 0,
  extraDiceNonBonus: 0,
  extraSuccessBonus: 0,
  extraSuccessNonBonus: 0,
  isStunted: false,
})

// Default combat bonuses
export const createDefaultCombat = (): Combat => ({
  power: 0,
  joinBattleBonus: 0,
  joinBattleDiceBonus: 0,
  joinBattleSuccessBonus: 0,
  decisiveExtraDice: 0,
  decisiveExtraSuccess: 0,
})

// Default social configuration
export const createDefaultSocial = (): Social => ({
  virtues: {
    major: null,
    minor: null,
  },
  intimacies: [],
  backgrounds: [],
})

// Complete character template
export const createNewCharacter = (name: string): Character => ({
  id: uuidv4(),
  name,
  attributes: createDefaultAttributes(),
  abilities: createDefaultAbilities(),
  essence: createDefaultEssence(),
  staticValues: createDefaultStaticValues(),
  health: createDefaultHealth(),
  armor: [],
  weapons: [],
  milestones: createDefaultMilestones(),
  advancement: [],
  dicePool: createDefaultDicePool(),
  charms: [],
  spells: [],
  combat: createDefaultCombat(),
  social: createDefaultSocial(),
  rulings: [],
})

// Preset character templates for different Exalt types
export const createSolarCharacter = (name: string): Character => {
  const character = createNewCharacter(name)
  character.health.exaltType = "solar"
  character.essence.motes = 7 // Solars start with more motes
  return character
}

export const createDragonBloodCharacter = (name: string): Character => {
  const character = createNewCharacter(name)
  character.health.exaltType = "dragon-blood"
  character.essence.motes = 4 // Dragon-Bloods start with fewer motes
  return character
}

export const createLunarCharacter = (name: string): Character => {
  const character = createNewCharacter(name)
  character.health.exaltType = "lunar"
  character.essence.motes = 5 // Default for Lunars
  return character
}

export const createSiderealCharacter = (name: string): Character => {
  const character = createNewCharacter(name)
  character.health.exaltType = "sidereal"
  character.essence.motes = 6
  return character
}

export const createAbyssalCharacter = (name: string): Character => {
  const character = createNewCharacter(name)
  character.health.exaltType = "abyssal"
  character.essence.motes = 7
  return character
}

export const createLiminalCharacter = (name: string): Character => {
  const character = createNewCharacter(name)
  character.health.exaltType = "liminal"
  character.essence.motes = 5
  return character
}

export const createExigentCharacter = (name: string): Character => {
  const character = createNewCharacter(name)
  character.health.exaltType = "exigent"
  character.essence.motes = 5
  return character
}

// Character template selector
export const createCharacterByType = (name: string, exaltType: string): Character => {
  switch (exaltType) {
    case "solar":
      return createSolarCharacter(name)
    case "dragon-blood":
      return createDragonBloodCharacter(name)
    case "lunar":
      return createLunarCharacter(name)
    case "sidereal":
      return createSiderealCharacter(name)
    case "abyssal":
      return createAbyssalCharacter(name)
    case "liminal":
      return createLiminalCharacter(name)
    case "exigent":
      return createExigentCharacter(name)
    default:
      return createLunarCharacter(name) // Default to Lunar
  }
}

// Validation defaults
export const DEFAULT_ATTRIBUTE_MIN = 1
export const DEFAULT_ATTRIBUTE_MAX = 5
export const DEFAULT_ABILITY_MIN = 0
export const DEFAULT_ABILITY_MAX = 5
export const DEFAULT_ESSENCE_MIN = 1
export const DEFAULT_ESSENCE_MAX = 10
export const DEFAULT_MODIFIER_MIN = -5
export const DEFAULT_MODIFIER_MAX = 5

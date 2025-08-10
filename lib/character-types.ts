// Exalted: Essence Character Type Definitions

export interface StatBlock {
  base: number;
  added: number;
  bonus: number;
}

export interface Attributes {
  fortitude: StatBlock;
  finesse: StatBlock;
  force: StatBlock;
}

export interface Abilities {
  athletics: StatBlock;
  awareness: StatBlock;
  closeCombat: StatBlock;
  craft: StatBlock;
  embassy: StatBlock;
  integrity: StatBlock;
  navigate: StatBlock;
  physique: StatBlock;
  presence: StatBlock;
  performance: StatBlock;
  rangedCombat: StatBlock;
  sagacity: StatBlock;
  stealth: StatBlock;
  war: StatBlock;
}

export interface Essence {
  motes: number;
  commitments: number;
  spent: number;
  anima: number;
  rating: number;
}

export interface StaticValues {
  defenseModifier: number;
  evasionModifier: number;
  parryModifier: number;
  resolveModifier: number;
  soakModifier: number;
  hardnessModifier: number;
}

export interface HealthLevels {
  zero: number;
  minusOne: number;
  minusTwo: number;
  incap: number;
}

export type ExaltType =
  | "lunar"
  | "solar"
  | "dragon-blood"
  | "sidereal"
  | "abyssal"
  | "liminal"
  | "exigent";

export interface DramaticInjury {
  id: string;
  description: string;
  isHealed: boolean;
}

export interface Health {
  baseline: HealthLevels;
  oxBodyLevels: number;
  exaltType: ExaltType;
  bashingDamage: number;
  lethalDamage: number;
  aggravatedDamage: number;
  dramaticInjuries: DramaticInjury[];
}

export type ArmorType = "light" | "heavy";
export type WeaponRange = "close" | "short" | "mid" | "long";

export interface ArmorPiece {
  id: string;
  name: string;
  type: ArmorType;
  soak: number;
  hardness: number;
  mobility: number;
  tags: string[];
  description?: string;
}

export interface Weapon {
  id: string;
  name: string;
  accuracy: number;
  damage: number;
  defence: number;
  overwhelming: number;
  range: WeaponRange;
  tags: string[];
  description?: string;
}

export interface Milestones {
  personal: number;
  exalt: number;
  minor: number;
  major: number;
}

export type AdvancementStatus =
  | "Planned"
  | "Paid with Personal"
  | "Paid with Exalt"
  | "Paid with Minor"
  | "Paid with Major"
  | "Initial";

export interface AdvancementEntry {
  id: string;
  item: string;
  status: AdvancementStatus;
  timestamp: string;
  description?: string;
}

export type AttributeType = keyof Attributes;
export type AbilityType = keyof Abilities;

export interface DicePool {
  attribute: AttributeType;
  ability: AbilityType;
  targetNumber: number;
  doublesThreshold: number;
  extraDiceBonus: number;
  extraDiceNonBonus: number;
  extraSuccessBonus: number;
  extraSuccessNonBonus: number;
  isStunted: boolean;
}

export type SpellCircle = "terrestrial" | "celestial" | "solar";

export interface Charm {
  id: string;
  name: string;
  cost: string;
  keywords: string[];
  description: string;
  step: number | null; // Combat step when used
  pageReference: string;
  prerequisites: string[];
  dateAdded: string;
}

export interface Spell {
  id: string;
  name: string;
  circle: SpellCircle;
  cost: string;
  description: string;
  step: number | null; // Combat step when cast
  pageReference: string;
  dateAdded: string;
  components: string[]; // Material components if any
}

export interface Combat {
  power: number;
  joinBattleDiceBonus: number;
  joinBattleSuccessBonus: number;
  decisiveExtraDice: number;
  decisiveExtraSuccess: number;
}

export type VirtueType =
  | "ambition"
  | "compassion"
  | "courage"
  | "discipline"
  | "justice"
  | "loyalty"
  | "wonder"
  | null;

export interface Virtues {
  major: VirtueType;
  minor: VirtueType;
}

export interface Intimacy {
  id: string;
  description: string;
  intensity: "minor" | "major";
}

export type BackgroundType = "artifact" | "resources" | "followers";
export type BackgroundLevel = "tertiary" | "secondary" | "primary";

export interface Background {
  id: string;
  type: BackgroundType;
  level: BackgroundLevel;
  description: string;
}

export interface Social {
  virtues: Virtues;
  intimacies: Intimacy[];
  backgrounds: Background[];
}

export interface Ruling {
  id: string;
  title: string;
  description: string;
  category: "house-rule" | "clarification" | "edge-case";
  dateCreated: string;
}

export interface Character {
  id: string;
  name: string;
  attributes: Attributes;
  abilities: Abilities;
  essence: Essence;
  staticValues: StaticValues;
  health: Health;
  armor: ArmorPiece[];
  weapons: Weapon[];
  milestones: Milestones;
  advancement: AdvancementEntry[];
  dicePool: DicePool;
  charms: Charm[];
  spells: Spell[];
  combat: Combat;
  social: Social;
  rulings: Ruling[];
}

// Utility types for updates
export type CharacterUpdate = Partial<Character>;
export type AttributeUpdate = Partial<Attributes>;
export type AbilityUpdate = Partial<Abilities>;

// Animation levels for essence system
export type AnimaLevel = "Dim" | "Glowing" | "Burning" | "Bonfire" | "Iconic";

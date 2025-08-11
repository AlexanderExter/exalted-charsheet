// Exalted: Essence Character Type Definitions
import { z } from "zod";
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

// Zod schemas mirroring the TypeScript interfaces above
export const StatBlockSchema = z.object({
  base: z.number(),
  added: z.number(),
  bonus: z.number(),
});

export const AttributesSchema = z.object({
  fortitude: StatBlockSchema,
  finesse: StatBlockSchema,
  force: StatBlockSchema,
});

export const AbilitiesSchema = z.object({
  athletics: StatBlockSchema,
  awareness: StatBlockSchema,
  closeCombat: StatBlockSchema,
  craft: StatBlockSchema,
  embassy: StatBlockSchema,
  integrity: StatBlockSchema,
  navigate: StatBlockSchema,
  physique: StatBlockSchema,
  presence: StatBlockSchema,
  performance: StatBlockSchema,
  rangedCombat: StatBlockSchema,
  sagacity: StatBlockSchema,
  stealth: StatBlockSchema,
  war: StatBlockSchema,
});

export const EssenceSchema = z.object({
  motes: z.number(),
  commitments: z.number(),
  spent: z.number(),
  anima: z.number(),
  rating: z.number(),
});

export const StaticValuesSchema = z.object({
  defenseModifier: z.number(),
  evasionModifier: z.number(),
  parryModifier: z.number(),
  resolveModifier: z.number(),
  soakModifier: z.number(),
  hardnessModifier: z.number(),
});

export const HealthLevelsSchema = z.object({
  zero: z.number(),
  minusOne: z.number(),
  minusTwo: z.number(),
  incap: z.number(),
});

export const ExaltTypeSchema = z.enum([
  "lunar",
  "solar",
  "dragon-blood",
  "sidereal",
  "abyssal",
  "liminal",
  "exigent",
]);

export const DramaticInjurySchema = z.object({
  id: z.string(),
  description: z.string(),
  isHealed: z.boolean(),
});

export const HealthSchema = z.object({
  baseline: HealthLevelsSchema,
  oxBodyLevels: z.number(),
  exaltType: ExaltTypeSchema,
  bashingDamage: z.number(),
  lethalDamage: z.number(),
  aggravatedDamage: z.number(),
  dramaticInjuries: DramaticInjurySchema.array(),
});

export const ArmorTypeSchema = z.enum(["light", "heavy"]);
export const WeaponRangeSchema = z.enum(["close", "short", "mid", "long"]);

export const ArmorPieceSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: ArmorTypeSchema,
  soak: z.number(),
  hardness: z.number(),
  mobility: z.number(),
  tags: z.array(z.string()),
  description: z.string().optional(),
});

export const WeaponSchema = z.object({
  id: z.string(),
  name: z.string(),
  accuracy: z.number(),
  damage: z.number(),
  defence: z.number(),
  overwhelming: z.number(),
  range: WeaponRangeSchema,
  tags: z.array(z.string()),
  description: z.string().optional(),
});

export const MilestonesSchema = z.object({
  personal: z.number(),
  exalt: z.number(),
  minor: z.number(),
  major: z.number(),
});

export const AdvancementStatusSchema = z.enum([
  "Planned",
  "Paid with Personal",
  "Paid with Exalt",
  "Paid with Minor",
  "Paid with Major",
  "Initial",
]);

export const AdvancementEntrySchema = z.object({
  id: z.string(),
  item: z.string(),
  status: AdvancementStatusSchema,
  timestamp: z.string(),
  description: z.string().optional(),
});

export const AttributeTypeSchema = AttributesSchema.keyof();
export const AbilityTypeSchema = AbilitiesSchema.keyof();

export const DicePoolSchema = z.object({
  attribute: AttributeTypeSchema,
  ability: AbilityTypeSchema,
  targetNumber: z.number(),
  doublesThreshold: z.number(),
  extraDiceBonus: z.number(),
  extraDiceNonBonus: z.number(),
  extraSuccessBonus: z.number(),
  extraSuccessNonBonus: z.number(),
  isStunted: z.boolean(),
});

export const SpellCircleSchema = z.enum(["terrestrial", "celestial", "solar"]);

export const CharmSchema = z.object({
  id: z.string(),
  name: z.string(),
  cost: z.string(),
  keywords: z.array(z.string()),
  description: z.string(),
  step: z.number().nullable(),
  pageReference: z.string(),
  prerequisites: z.array(z.string()),
  dateAdded: z.string(),
});

export const SpellSchema = z.object({
  id: z.string(),
  name: z.string(),
  circle: SpellCircleSchema,
  cost: z.string(),
  description: z.string(),
  step: z.number().nullable(),
  pageReference: z.string(),
  dateAdded: z.string(),
  components: z.array(z.string()),
});

export const CombatSchema = z.object({
  power: z.number(),
  joinBattleDiceBonus: z.number(),
  joinBattleSuccessBonus: z.number(),
  decisiveExtraDice: z.number(),
  decisiveExtraSuccess: z.number(),
});

export const VirtueTypeSchema = z
  .enum(["ambition", "compassion", "courage", "discipline", "justice", "loyalty", "wonder"])
  .nullable();

export const VirtuesSchema = z.object({
  major: VirtueTypeSchema,
  minor: VirtueTypeSchema,
});

export const IntimacySchema = z.object({
  id: z.string(),
  description: z.string(),
  intensity: z.enum(["minor", "major"]),
});

export const BackgroundTypeSchema = z.enum(["artifact", "resources", "followers"]);
export const BackgroundLevelSchema = z.enum(["tertiary", "secondary", "primary"]);

export const BackgroundSchema = z.object({
  id: z.string(),
  type: BackgroundTypeSchema,
  level: BackgroundLevelSchema,
  description: z.string(),
});

export const SocialSchema = z.object({
  virtues: VirtuesSchema,
  intimacies: IntimacySchema.array(),
  backgrounds: BackgroundSchema.array(),
});

export const RulingSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.enum(["house-rule", "clarification", "edge-case"]),
  dateCreated: z.string(),
});

export const CharacterSchema = z.object({
  id: z.string(),
  name: z.string(),
  attributes: AttributesSchema,
  abilities: AbilitiesSchema,
  essence: EssenceSchema,
  staticValues: StaticValuesSchema,
  health: HealthSchema,
  armor: ArmorPieceSchema.array(),
  weapons: WeaponSchema.array(),
  milestones: MilestonesSchema,
  advancement: AdvancementEntrySchema.array(),
  dicePool: DicePoolSchema,
  charms: CharmSchema.array(),
  spells: SpellSchema.array(),
  combat: CombatSchema,
  social: SocialSchema,
  rulings: RulingSchema.array(),
});

// Exalted: Essence Character Type Definitions
import { z } from "zod";

// Zod schemas
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
  zero: z.number().int().min(0),
  minusOne: z.number().int().min(0),
  minusTwo: z.number().int().min(0),
  incap: z.number().int().min(0),
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
  oxBodyLevels: z.number().int().min(0),
  exaltType: ExaltTypeSchema,
  bashingDamage: z.number().int().min(0),
  lethalDamage: z.number().int().min(0),
  aggravatedDamage: z.number().int().min(0),
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
  defense: z.number(),
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
  targetNumber: z.number().int().min(1).max(10),
  doublesThreshold: z.number().int().min(1).max(10),
  extraDiceBonus: z.number().int().min(0).max(10),
  extraDiceNonBonus: z.number().int().min(0),
  extraSuccessBonus: z.number().int().min(0).max(5),
  extraSuccessNonBonus: z.number().int().min(0),
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
  joinBattleAttribute: AttributeTypeSchema.optional(),
  joinBattleAbility: AbilityTypeSchema.optional(),
  selectedWeaponId: z.string().optional(),
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

export const AnimaLevelSchema = z.enum(["Dim", "Glowing", "Burning", "Bonfire", "Iconic"]);

// Inferred types
export type StatBlock = z.infer<typeof StatBlockSchema>;
export type Attributes = z.infer<typeof AttributesSchema>;
export type Abilities = z.infer<typeof AbilitiesSchema>;
export type Essence = z.infer<typeof EssenceSchema>;
export type StaticValues = z.infer<typeof StaticValuesSchema>;
export type HealthLevels = z.infer<typeof HealthLevelsSchema>;
export type ExaltType = z.infer<typeof ExaltTypeSchema>;
export type DramaticInjury = z.infer<typeof DramaticInjurySchema>;
export type Health = z.infer<typeof HealthSchema>;
export type ArmorType = z.infer<typeof ArmorTypeSchema>;
export type WeaponRange = z.infer<typeof WeaponRangeSchema>;
export type ArmorPiece = z.infer<typeof ArmorPieceSchema>;
export type Weapon = z.infer<typeof WeaponSchema>;
export type Milestones = z.infer<typeof MilestonesSchema>;
export type AdvancementStatus = z.infer<typeof AdvancementStatusSchema>;
export type AdvancementEntry = z.infer<typeof AdvancementEntrySchema>;
export type AttributeType = z.infer<typeof AttributeTypeSchema>;
export type AbilityType = z.infer<typeof AbilityTypeSchema>;
export type DicePool = z.infer<typeof DicePoolSchema>;
export type SpellCircle = z.infer<typeof SpellCircleSchema>;
export type Charm = z.infer<typeof CharmSchema>;
export type Spell = z.infer<typeof SpellSchema>;
export type Combat = z.infer<typeof CombatSchema>;
export type VirtueType = z.infer<typeof VirtueTypeSchema>;
export type Virtues = z.infer<typeof VirtuesSchema>;
export type Intimacy = z.infer<typeof IntimacySchema>;
export type BackgroundType = z.infer<typeof BackgroundTypeSchema>;
export type BackgroundLevel = z.infer<typeof BackgroundLevelSchema>;
export type Background = z.infer<typeof BackgroundSchema>;
export type Social = z.infer<typeof SocialSchema>;
export type Ruling = z.infer<typeof RulingSchema>;
export type Character = z.infer<typeof CharacterSchema>;
export type AnimaLevel = z.infer<typeof AnimaLevelSchema>;

// Utility types for updates
export type CharacterUpdate = Partial<Character>;
export type AttributeUpdate = Partial<Attributes>;
export type AbilityUpdate = Partial<Abilities>;

// Side Character Types
export const DicePoolTypeSchema = z.enum(["primary", "secondary", "tertiary"]);

export const DicePoolWithActionSchema = z.object({
  id: z.string(),
  value: z.number().int().min(0),
  action: z.string(),
  type: DicePoolTypeSchema,
});

export const BattlegroupSchema = z.object({
  size: z.number().int().min(0),
  drill: z.number().int().min(0),
});

export const QualitySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.enum(["trait", "ability", "limitation"]),
  dateCreated: z.string(),
});

export const SideCharacterEssenceSchema = z.object({
  motes: z.number().int().min(0),
  commitments: z.number().int().min(0),
  spent: z.number().int().min(0),
  rating: z.number().int().min(1),
});

export const SideCharacterSchema = z.object({
  id: z.string(),
  name: z.string(),
  pools: z.array(DicePoolWithActionSchema),
  essence: SideCharacterEssenceSchema,
  healthLevels: HealthLevelsSchema,
  defense: z.number().int().min(0),
  hardness: z.number().int().min(0),
  soak: z.number().int().min(0),
  resolve: z.number().int().min(0),
  weaponNotes: z.string().optional(),
  armorNotes: z.string().optional(),
  qualities: z.array(QualitySchema),
  battlegroup: BattlegroupSchema.nullable(),
  bashingDamage: z.number().int().min(0),
  lethalDamage: z.number().int().min(0),
  aggravatedDamage: z.number().int().min(0),
});

// Inferred types for Side Characters
export type DicePoolType = z.infer<typeof DicePoolTypeSchema>;
export type DicePoolWithAction = z.infer<typeof DicePoolWithActionSchema>;
export type Battlegroup = z.infer<typeof BattlegroupSchema>;
export type Quality = z.infer<typeof QualitySchema>;
export type SideCharacterEssence = z.infer<typeof SideCharacterEssenceSchema>;
export type SideCharacter = z.infer<typeof SideCharacterSchema>;

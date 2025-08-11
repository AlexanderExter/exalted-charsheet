import { z } from "zod";

// Stat blocks
export const StatBlockSchema = z.object({
  base: z.number(),
  added: z.number(),
  bonus: z.number(),
});

// Attributes and Abilities
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

// Essence and related values
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
  dramaticInjuries: z.array(DramaticInjurySchema),
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

const AttributeTypeSchema = z.enum(["fortitude", "finesse", "force"]);
const AbilityTypeSchema = z.enum([
  "athletics",
  "awareness",
  "closeCombat",
  "craft",
  "embassy",
  "integrity",
  "navigate",
  "physique",
  "presence",
  "performance",
  "rangedCombat",
  "sagacity",
  "stealth",
  "war",
]);

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
  intimacies: z.array(IntimacySchema),
  backgrounds: z.array(BackgroundSchema),
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
  armor: z.array(ArmorPieceSchema),
  weapons: z.array(WeaponSchema),
  milestones: MilestonesSchema,
  advancement: z.array(AdvancementEntrySchema),
  dicePool: DicePoolSchema,
  charms: z.array(CharmSchema),
  spells: z.array(SpellSchema),
  combat: CombatSchema,
  social: SocialSchema,
  rulings: z.array(RulingSchema),
});


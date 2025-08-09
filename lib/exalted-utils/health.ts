import type { HealthLevels, ExaltType } from "../character-types";

const GENERIC_OX_BODY_LEVELS: HealthLevels[] = Array.from({ length: 5 }, () => ({
  zero: 0,
  minusOne: 1,
  minusTwo: 2,
  incap: 0,
}));

const LUNAR_OX_BODY_LEVELS: HealthLevels[] = Array.from({ length: 5 }, () => ({
  zero: 1,
  minusOne: 2,
  minusTwo: 2,
  incap: 0,
}));

const OX_BODY_TABLE: Partial<Record<ExaltType, HealthLevels[]>> = {
  lunar: LUNAR_OX_BODY_LEVELS,
};

export const calculateHealthLevels = (
  baseline: HealthLevels,
  oxBodyLevels: number,
  exaltType: ExaltType,
): HealthLevels => {
  const clampedOxBody = Math.max(0, Math.min(5, oxBodyLevels));

  let oxBodyZero = 0;
  let oxBodyMinusOne = 0;
  let oxBodyMinusTwo = 0;
  let oxBodyIncap = 0;

  const levels = OX_BODY_TABLE[exaltType] ?? GENERIC_OX_BODY_LEVELS;
  for (let i = 0; i < clampedOxBody; i++) {
    const bonus = levels[i];
    oxBodyZero += bonus.zero;
    oxBodyMinusOne += bonus.minusOne;
    oxBodyMinusTwo += bonus.minusTwo;
    oxBodyIncap += bonus.incap;
  }

  return {
    zero: baseline.zero + oxBodyZero,
    minusOne: baseline.minusOne + oxBodyMinusOne,
    minusTwo: baseline.minusTwo + oxBodyMinusTwo,
    incap: baseline.incap + oxBodyIncap,
  };
};

export const calculateHealthPenalty = (
  healthLevels: HealthLevels,
  bashingDamage: number,
  lethalDamage: number,
  aggravatedDamage: number,
): number => {
  const totalDamage = bashingDamage + lethalDamage + aggravatedDamage;

  // Determine penalty based on filled health levels
  let penalty = 0;
  let damageCounter = totalDamage;

  // -0 levels don't cause penalty
  damageCounter -= healthLevels.zero;
  if (damageCounter <= 0) return 0;

  // -1 levels cause -1 penalty
  if (damageCounter > 0) {
    penalty = -1;
    damageCounter -= healthLevels.minusOne;
    if (damageCounter <= 0) return penalty;
  }

  // -2 levels cause -2 penalty
  if (damageCounter > 0) {
    penalty = -2;
    damageCounter -= healthLevels.minusTwo;
    if (damageCounter <= 0) return penalty;
  }

  // Incapacitated
  if (damageCounter > 0) {
    penalty = -4;
  }

  return penalty;
};


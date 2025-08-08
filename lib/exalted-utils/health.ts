import type { HealthLevels, ExaltType } from "../character-types";

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

  // Ox-Body calculations based on Exalt type
  switch (exaltType) {
    case "lunar":
      // Lunar Ox-Body: +1 -0, +2 -1, +2 -2
      if (clampedOxBody >= 1) {
        oxBodyZero += 1;
        oxBodyMinusOne += 2;
        oxBodyMinusTwo += 2;
      }
      if (clampedOxBody >= 2) {
        oxBodyZero += 1;
        oxBodyMinusOne += 2;
        oxBodyMinusTwo += 2;
      }
      if (clampedOxBody >= 3) {
        oxBodyZero += 1;
        oxBodyMinusOne += 2;
        oxBodyMinusTwo += 2;
      }
      if (clampedOxBody >= 4) {
        oxBodyZero += 1;
        oxBodyMinusOne += 2;
        oxBodyMinusTwo += 2;
      }
      if (clampedOxBody >= 5) {
        oxBodyZero += 1;
        oxBodyMinusOne += 2;
        oxBodyMinusTwo += 2;
      }
      break;
    default:
      // Generic Ox-Body: +1 -1, +2 -2
      for (let i = 0; i < clampedOxBody; i++) {
        oxBodyMinusOne += 1;
        oxBodyMinusTwo += 2;
      }
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


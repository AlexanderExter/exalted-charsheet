export interface DicePoolResult {
  basePool: number;
  extraDice: number;
  totalPool: number;
  cappedBonusDice: number;
  actionPhrase: string;
}

export const calculateDicePool = (
  attributeValue: number,
  abilityValue: number,
  targetNumber: number,
  doublesThreshold: number,
  extraDiceBonus: number,
  extraDiceNonBonus: number,
  extraSuccessBonus: number,
  extraSuccessNonBonus: number,
  isStunted: boolean = false
): DicePoolResult => {
  const basePool = attributeValue + abilityValue;

  // Bonus dice from Charms and other effects are capped at the base pool
  const cappedBonusDice = Math.min(extraDiceBonus, basePool);

  // Add stunt dice (+2 non-capped dice)
  const stuntDice = isStunted ? 2 : 0;

  // Non-bonus dice are added after capping
  const extraDice = cappedBonusDice + extraDiceNonBonus + stuntDice;
  const totalPool = basePool + cappedBonusDice + extraDiceNonBonus + stuntDice;

  const bonusSuccesses = extraSuccessBonus + extraSuccessNonBonus;
  const bonusText = bonusSuccesses > 0 ? ` +${bonusSuccesses} successes` : "";
  const stuntText = isStunted ? " (Stunted)" : "";
  const actionPhrase = `Roll ${totalPool}, TN ${targetNumber} Double ${doublesThreshold}s${bonusText}${stuntText}`;

  return {
    basePool,
    extraDice,
    totalPool,
    cappedBonusDice,
    actionPhrase,
  };
};

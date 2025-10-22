import { useMemo } from "react";
import type { Character, AttributeType, AbilityType } from "@/lib/character-types";
import { calculateStatTotal } from "@/lib/exalted-utils";
import { calculateDicePool, type DicePoolResult } from "@/lib/exalted-utils/dice";

export const useDicePoolCalculation = (character: Character | null): DicePoolResult => {
  return useMemo(() => {
    if (!character) {
      return {
        basePool: 0,
        extraDice: 0,
        totalPool: 0,
        cappedBonusDice: 0,
        actionPhrase: "Roll 0, TN 7 Double 10s",
      };
    }

    const getAttributeTotal = (attributeKey: AttributeType): number => {
      const attribute = character.attributes[attributeKey];
      return attribute ? calculateStatTotal(attribute) : 0;
    };

    const getAbilityTotal = (abilityKey: AbilityType): number => {
      const ability = character.abilities[abilityKey];
      return ability ? calculateStatTotal(ability) : 0;
    };

    const attributeValue = getAttributeTotal(character.dicePool.attribute);
    const abilityValue = getAbilityTotal(character.dicePool.ability);

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
    );
  }, [
    character?.attributes,
    character?.abilities,
    character?.dicePool.attribute,
    character?.dicePool.ability,
    character?.dicePool.targetNumber,
    character?.dicePool.doublesThreshold,
    character?.dicePool.extraDiceBonus,
    character?.dicePool.extraDiceNonBonus,
    character?.dicePool.extraSuccessBonus,
    character?.dicePool.extraSuccessNonBonus,
    character?.dicePool.isStunted,
  ]);
};

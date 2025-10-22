"use client";

import React, { useMemo } from "react";
import { useCharacterContext } from "@/hooks/CharacterContext";

export const DicePoolSummary: React.FC = React.memo(() => {
  const { character, calculateDicePool } = useCharacterContext();
  const dicePool = useMemo(() => calculateDicePool(), [calculateDicePool]);

  return (
    <div className="mt-6 p-4 bg-info/10 rounded-lg">
      <h3 className="font-semibold text-info mb-2">Dice Pool Summary</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
        <div>
          <div className="text-info font-medium">Base Pool</div>
          <div className="text-lg font-bold text-info">{dicePool.basePool}</div>
        </div>
        <div>
          <div className="text-info font-medium">Extra Dice</div>
          <div className="text-lg font-bold text-info">+{dicePool.extraDice}</div>
        </div>
        <div>
          <div className="text-info font-medium">Total Dice</div>
          <div className="text-lg font-bold text-info">{dicePool.totalPool}</div>
        </div>
        <div>
          <div className="text-info font-medium">Extra Success</div>
          <div className="text-lg font-bold text-info">
            +
            {(character?.dicePool?.extraSuccessBonus || 0) +
              (character?.dicePool?.extraSuccessNonBonus || 0)}
          </div>
        </div>
      </div>
      <div className="text-center p-2 bg-info/20 rounded font-medium text-info">
        {dicePool.actionPhrase}
      </div>
    </div>
  );
});

DicePoolSummary.displayName = "DicePoolSummary";

export default DicePoolSummary;

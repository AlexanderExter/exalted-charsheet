"use client";

import React, { useMemo } from "react";
import { useCharacterContext } from "@/hooks/CharacterContext";

export const DicePoolSummary: React.FC = () => {
  const { character, calculateDicePool } = useCharacterContext();
  const dicePool = useMemo(() => calculateDicePool(), [calculateDicePool]);

  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
      <h3 className="font-semibold text-blue-800 mb-2">Dice Pool Summary</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
        <div>
          <div className="text-blue-600 font-medium">Base Pool</div>
          <div className="text-lg font-bold text-blue-800">{dicePool.basePool}</div>
        </div>
        <div>
          <div className="text-blue-600 font-medium">Extra Dice</div>
          <div className="text-lg font-bold text-blue-800">+{dicePool.extraDice}</div>
        </div>
        <div>
          <div className="text-blue-600 font-medium">Total Dice</div>
          <div className="text-lg font-bold text-blue-800">{dicePool.totalPool}</div>
        </div>
        <div>
          <div className="text-blue-600 font-medium">Extra Success</div>
          <div className="text-lg font-bold text-blue-800">
            +
            {(character?.dicePool?.extraSuccessBonus || 0) +
              (character?.dicePool?.extraSuccessNonBonus || 0)}
          </div>
        </div>
      </div>
      <div className="text-center p-2 bg-blue-100 rounded font-medium text-blue-800">
        {dicePool.actionPhrase}
      </div>
    </div>
  );
};

export default DicePoolSummary;

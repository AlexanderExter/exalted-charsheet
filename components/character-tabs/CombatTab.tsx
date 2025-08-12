'use client';

// Combat Tab Component - Essence, health, static values, and combat mechanics

import React from "react";
import { CombatRolls } from "@/components/combat/CombatRolls";
import { StaticValuesPanel } from "@/components/combat/StaticValuesPanel";
import { HealthTracker } from "@/components/combat/HealthTracker";
import { useCombat } from "@/hooks/useCombat";
import { EssencePanel } from "@/components/character-tabs/common/EssencePanel";
import { createDefaultEssence } from "@/lib/character-defaults";
import { useCharacterContext } from "@/hooks/CharacterContext";

export const CombatTab: React.FC = React.memo(() => {
  const { character, updateCharacter, calculations } = useCharacterContext();

  const {
    getHighestAttribute,
    getTotalHealthLevels,
    addDramaticInjury,
    updateDramaticInjury,
    deleteDramaticInjury,
  } = useCombat({ character, updateCharacter, calculations });

  return (
    <div className="space-y-6">
      <EssencePanel
        essence={character.essence || createDefaultEssence()}
        onChange={essence => updateCharacter({ essence })}
      />

      <CombatRolls
        character={character}
        updateCharacter={updateCharacter}
        getHighestAttribute={getHighestAttribute}
      />

      <StaticValuesPanel
        character={character}
        updateCharacter={updateCharacter}
        calculations={calculations}
      />

      <HealthTracker
        character={character}
        updateCharacter={updateCharacter}
        calculations={calculations}
        getTotalHealthLevels={getTotalHealthLevels}
        addDramaticInjury={addDramaticInjury}
        updateDramaticInjury={updateDramaticInjury}
        deleteDramaticInjury={deleteDramaticInjury}
      />
    </div>
  );
});

CombatTab.displayName = "CombatTab";

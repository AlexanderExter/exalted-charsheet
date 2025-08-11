import "@testing-library/jest-dom";
import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { HealthTracker } from "@/components/combat/HealthTracker";
import { createDefaultHealth } from "@/lib/character-defaults";
import type { Character } from "@/lib/character-types";
import type { CharacterCalculations } from "@/hooks/useCharacterCalculations";

describe("HealthTracker", () => {
  it("renders incapacitation rules snapshot", () => {
    const character = { health: createDefaultHealth() } as unknown as Character;
    const calculations = {
      healthPenalty: -4,
      healthLevels: { zero: 2, minusOne: 2, minusTwo: 2, incap: 1 },
    } as unknown as CharacterCalculations;

    const { container } = render(
      <HealthTracker
        character={character}
        updateCharacter={() => {}}
        calculations={calculations}
        getTotalHealthLevels={() => 7}
        addDramaticInjury={() => {}}
        updateDramaticInjury={() => {}}
        deleteDramaticInjury={() => {}}
      />
    );

    expect(container).toMatchSnapshot();
  });
});


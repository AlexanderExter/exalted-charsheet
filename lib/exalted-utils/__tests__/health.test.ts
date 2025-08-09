import { describe, it, expect } from "vitest";
import { calculateHealthLevels } from "../health";
import type { HealthLevels } from "../../character-types";

describe("calculateHealthLevels", () => {
  const baseline: HealthLevels = { zero: 0, minusOne: 0, minusTwo: 0, incap: 0 };

  const lunarExpectations: HealthLevels[] = [
    { zero: 0, minusOne: 0, minusTwo: 0, incap: 0 },
    { zero: 1, minusOne: 2, minusTwo: 2, incap: 0 },
    { zero: 2, minusOne: 4, minusTwo: 4, incap: 0 },
    { zero: 3, minusOne: 6, minusTwo: 6, incap: 0 },
    { zero: 4, minusOne: 8, minusTwo: 8, incap: 0 },
    { zero: 5, minusOne: 10, minusTwo: 10, incap: 0 },
  ];

  lunarExpectations.forEach((expected, level) => {
    it(`lunar with ${level} Ox-Body ranks`, () => {
      expect(calculateHealthLevels(baseline, level, "lunar")).toEqual(expected);
    });
  });

  const genericExpectations: HealthLevels[] = [
    { zero: 0, minusOne: 0, minusTwo: 0, incap: 0 },
    { zero: 0, minusOne: 1, minusTwo: 2, incap: 0 },
    { zero: 0, minusOne: 2, minusTwo: 4, incap: 0 },
    { zero: 0, minusOne: 3, minusTwo: 6, incap: 0 },
    { zero: 0, minusOne: 4, minusTwo: 8, incap: 0 },
    { zero: 0, minusOne: 5, minusTwo: 10, incap: 0 },
  ];

  genericExpectations.forEach((expected, level) => {
    it(`generic with ${level} Ox-Body ranks`, () => {
      expect(calculateHealthLevels(baseline, level, "solar")).toEqual(expected);
    });
  });
});

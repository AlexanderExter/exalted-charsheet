import { describe, it, expect } from 'vitest';
import { calculateStatTotal, calculateDicePool } from '../exalted-utils';
import type { StatBlock } from '../character-types';

describe('calculateStatTotal', () => {
  it('should calculate total of base + added + bonus', () => {
    const stat: StatBlock = { base: 2, added: 1, bonus: 1 };
    expect(calculateStatTotal(stat)).toBe(4);
  });

  it('should handle zero values', () => {
    const stat: StatBlock = { base: 0, added: 0, bonus: 0 };
    expect(calculateStatTotal(stat)).toBe(0);
  });

  it('should handle negative bonuses', () => {
    const stat: StatBlock = { base: 3, added: 1, bonus: -1 };
    expect(calculateStatTotal(stat)).toBe(3);
  });

  it('should return negative if bonus makes total negative', () => {
    const stat: StatBlock = { base: 1, added: 0, bonus: -5 };
    const result = calculateStatTotal(stat);
    // The function doesn't clamp to 0, it returns the sum
    expect(result).toBe(-4);
  });
});

describe('calculateDicePool', () => {
  it('should calculate basic dice pool', () => {
    const result = calculateDicePool(
      3, // attribute
      2, // ability
      7, // target number
      10, // doubles threshold
      0, // extra dice bonus
      0, // extra dice non-bonus
      0, // extra success bonus
      0, // extra success non-bonus
      false // is stunted
    );

    expect(result.basePool).toBe(5);
    expect(result.totalPool).toBe(5);
    expect(result.extraDice).toBe(0);
  });

  it('should cap bonus dice at base pool', () => {
    const result = calculateDicePool(
      3, // attribute
      2, // ability
      7, // target
      10, // doubles
      10, // extra dice bonus (should be capped at 5)
      0,
      0,
      0,
      false
    );

    expect(result.basePool).toBe(5);
    expect(result.cappedBonusDice).toBe(5); // Capped at base pool
    expect(result.totalPool).toBe(10);
  });

  it('should add stunt dice when stunted', () => {
    const result = calculateDicePool(
      3, // attribute
      2, // ability
      7,
      10,
      0,
      0,
      0,
      0,
      true // is stunted
    );

    expect(result.basePool).toBe(5);
    expect(result.extraDice).toBe(2); // +2 stunt dice
    expect(result.totalPool).toBe(7);
    expect(result.actionPhrase).toContain('(Stunted)');
  });

  it('should generate correct action phrase', () => {
    const result = calculateDicePool(
      4, // attribute
      3, // ability
      7, // target
      10, // doubles
      2, // extra dice bonus
      1, // extra dice non-bonus
      1, // extra success bonus
      1, // extra success non-bonus
      false
    );

    expect(result.actionPhrase).toBe('Roll 10, TN 7 Double 10s +2 successes');
  });
});

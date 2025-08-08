import type { StatBlock, Attributes } from "../character-types";

export const calculateStatTotal = (stat: StatBlock): number => {
  return (stat?.base || 0) + (stat?.added || 0) + (stat?.bonus || 0);
};

export const getHighestAttributeValue = (attributes: Attributes): number => {
  const fortitude = calculateStatTotal(attributes.fortitude);
  const finesse = calculateStatTotal(attributes.finesse);
  const force = calculateStatTotal(attributes.force);
  return Math.max(fortitude, finesse, force);
};

export const formatHealthLevel = (current: number, max: number): string => {
  return `${current}/${max}`;
};

export const formatDicePool = (attribute: string, ability: string, pool: number): string => {
  return `${attribute} + ${ability} (${pool})`;
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export * from "./anima";
export * from "./static-values";
export * from "./health";
export * from "./dice";
export * from "./validation";


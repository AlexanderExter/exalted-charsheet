import type { AnimaLevel } from "../character-types";

export const getAnimaLevel = (anima: number): AnimaLevel => {
  if (anima <= 2) return "Dim";
  if (anima <= 4) return "Glowing";
  if (anima <= 6) return "Burning";
  if (anima <= 9) return "Bonfire";
  return "Iconic";
};

export const getActiveAnimaRulings = (anima: number): string[] => {
  const rulings: string[] = [];
  if (anima >= 3) rulings.push("Anima Active Effect available");
  if (anima >= 5) rulings.push("Exalted nature can't be hidden");
  if (anima >= 10) rulings.push("Iconic effect available");
  return rulings;
};

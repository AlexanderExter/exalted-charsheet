import {
  DEFAULT_MODIFIER_MAX,
  DEFAULT_MODIFIER_MIN,
} from "../character-defaults";

export const clampModifier = (value: number): number => {
  return Math.max(
    DEFAULT_MODIFIER_MIN,
    Math.min(DEFAULT_MODIFIER_MAX, value),
  );
};

export const validateStatValue = (value: number): number => {
  return Math.max(0, value);
};

export const validateEssenceRating = (rating: number): number => {
  return Math.max(1, Math.min(10, rating));
};


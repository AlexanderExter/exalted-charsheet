export const clampModifier = (value: number): number => {
  return Math.max(-5, Math.min(5, value));
};

export const validateStatValue = (value: number): number => {
  return Math.max(0, value);
};

export const validateEssenceRating = (rating: number): number => {
  return Math.max(1, Math.min(10, rating));
};


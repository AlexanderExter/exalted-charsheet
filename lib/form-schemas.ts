import { z } from "zod";
import { DicePoolSchema, CharacterSchema } from "./character-types";

export const dicePoolFormSchema = DicePoolSchema;
export type DicePoolFormValues = z.infer<typeof dicePoolFormSchema>;

export const characterFormSchema = CharacterSchema;
export type CharacterFormValues = z.infer<typeof characterFormSchema>;

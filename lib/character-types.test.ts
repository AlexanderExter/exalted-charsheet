import { describe, expect, it } from "vitest";
import { createNewCharacter } from "@/lib/character-defaults";
import { CharacterSchema } from "@/lib/character-types";

describe("CharacterSchema", () => {
  it("validates a default character", () => {
    const character = createNewCharacter("Test");
    expect(() => CharacterSchema.parse(character)).not.toThrow();
  });
});

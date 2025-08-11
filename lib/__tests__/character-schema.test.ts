import { describe, it, expect } from "vitest";
import { createNewCharacter } from "@/lib/character-defaults";
import { CharacterSchema } from "@/lib/character-schema";

describe("CharacterSchema", () => {
  it("validates a newly created character", () => {
    const char = createNewCharacter("Tester");
    expect(() => CharacterSchema.parse(char)).not.toThrow();
  });
});


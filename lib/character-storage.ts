import { CharacterSchema, type Character } from "@/lib/character-types";
import { createNewCharacter } from "@/lib/character-defaults";
import { v4 as uuidv4 } from "uuid";
import superjson from "superjson";

export async function exportCharacter(character: Character): Promise<void> {
  const dataStr = superjson.stringify(character, { space: 2 });
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const link = document.createElement("a");
  const url = window.URL.createObjectURL(dataBlob);
  link.href = url;
  link.download = `${character.name
    .replace(/[^a-z0-9]/gi, "_")
    .toLowerCase()}_exalted_character.json`;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, 100);
}

export async function exportCharacters(
  characters: Character[],
  filename = "all_exalted_characters.json"
): Promise<void> {
  const dataStr = superjson.stringify(characters, { space: 2 });
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const link = document.createElement("a");
  const url = window.URL.createObjectURL(dataBlob);
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, 100);
}

export async function importCharacters(file: File): Promise<Character[]> {
  const text = await file.text();
  let importedData: unknown;
  try {
    importedData = superjson.parse(text);
  } catch {
    importedData = JSON.parse(text);
  }
  const parsed: Character[] = Array.isArray(importedData)
    ? (CharacterSchema.array().parse(importedData) as Character[])
    : [CharacterSchema.parse(importedData) as Character];

  return parsed.map(char => ({
    ...createNewCharacter(char.name ?? "Unnamed"),
    ...char,
    id: uuidv4(),
  }));
}

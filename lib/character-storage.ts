import type { Character } from "@/lib/character-types";
import { createNewCharacter } from "@/lib/character-defaults";
import { v4 as uuidv4 } from "uuid";

export async function exportCharacter(character: Character): Promise<void> {
  const dataStr = JSON.stringify(character, null, 2);
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
  filename = "all_exalted_characters.json",
): Promise<void> {
  const dataStr = JSON.stringify(characters, null, 2);
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
  const importedData = JSON.parse(text);
  const charactersToImport = Array.isArray(importedData)
    ? importedData
    : [importedData];

  return charactersToImport.map((char: Partial<Character>) => ({
    ...createNewCharacter(char.name ?? "Unnamed"),
    ...char,
    id: uuidv4(),
  }));
}

import { CharacterSchema, type Character } from "@/lib/character-types";
import { db, getAllCharacters } from "@/lib/db";
import { waitForCharacterStoreSave } from "@/hooks/useCharacterStore";

/**
 * Triggers a browser download for a Blob with the specified filename
 */
function downloadBlob(blob: Blob, filename: string): void {
  const link = document.createElement("a");
  const url = window.URL.createObjectURL(blob);
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

export async function exportCharacter(character: Character): Promise<void> {
  const dataStr = JSON.stringify(character, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const filename = `${character.name
    .replace(/[^a-z0-9]/gi, "_")
    .toLowerCase()}_exalted_character.json`;
  downloadBlob(dataBlob, filename);
}

export async function exportCharacters(filename = "all_exalted_characters.json"): Promise<void> {
  await waitForCharacterStoreSave();
  const characters = await getAllCharacters();
  const dataStr = JSON.stringify(characters, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  downloadBlob(dataBlob, filename);
}

export async function importCharacters(file: File): Promise<Character[]> {
  const text = await file.text();
  let importedData: unknown;
  try {
    importedData = JSON.parse(text);
  } catch (err) {
    console.error("Failed to parse character data:", err);
    throw new Error("Unable to parse character data");
  }
  const parsed = Array.isArray(importedData)
    ? CharacterSchema.array().parse(importedData)
    : [CharacterSchema.parse(importedData)];

  const characters: Character[] = parsed.map(char => ({
    ...char,
    id: crypto.randomUUID(),
  }));

  if (db) {
    const database = db;
    await Promise.all(characters.map(char => database.characters.put(char)));
  }

  return characters;
}

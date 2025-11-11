import Dexie, { type Table } from "dexie";
import type { Character, SideCharacter } from "@/lib/character-types";

interface Meta {
  key: "currentCharacterId" | "currentSideCharacterId";
  value: string | null;
}

class ExaltedDB extends Dexie {
  characters!: Table<Character, string>;
  sideCharacters!: Table<SideCharacter, string>;
  meta!: Table<Meta, string>;

  constructor() {
    super("exalted-char-db");
    this.version(1).stores({
      characters: "id",
      meta: "key",
    });
    this.version(2).stores({
      characters: "id",
      sideCharacters: "id",
      meta: "key",
    });
  }
}

export const db = typeof window !== "undefined" ? new ExaltedDB() : null;

export async function getAllCharacters(): Promise<Character[]> {
  if (!db) return [];
  return db.characters.toArray();
}

export async function saveCharacter(character: Character): Promise<void> {
  if (!db) return;
  await db.characters.put(character);
}

export async function deleteCharacter(id: string): Promise<void> {
  if (!db) return;
  await db.characters.delete(id);
}

export async function getCurrentCharacterId(): Promise<string | null> {
  if (!db) return null;
  const entry = await db.meta.get("currentCharacterId");
  return entry?.value ?? null;
}

export async function setCurrentCharacterId(id: string | null): Promise<void> {
  if (!db) return;
  if (id === null) {
    await db.meta.delete("currentCharacterId");
  } else {
    await db.meta.put({ key: "currentCharacterId", value: id });
  }
}

// Side Character functions
export async function getAllSideCharacters(): Promise<SideCharacter[]> {
  if (!db) return [];
  return db.sideCharacters.toArray();
}

export async function saveSideCharacter(sideCharacter: SideCharacter): Promise<void> {
  if (!db) return;
  await db.sideCharacters.put(sideCharacter);
}

export async function deleteSideCharacter(id: string): Promise<void> {
  if (!db) return;
  await db.sideCharacters.delete(id);
}

export async function getCurrentSideCharacterId(): Promise<string | null> {
  if (!db) return null;
  const entry = await db.meta.get("currentSideCharacterId");
  return entry?.value ?? null;
}

export async function setCurrentSideCharacterId(id: string | null): Promise<void> {
  if (!db) return;
  if (id === null) {
    await db.meta.delete("currentSideCharacterId");
  } else {
    await db.meta.put({ key: "currentSideCharacterId", value: id });
  }
}

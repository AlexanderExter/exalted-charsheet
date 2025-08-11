import Dexie, { type Table } from "dexie";
import { CharacterSchema, type Character } from "@/lib/character-types";

interface Metadata {
  key: string;
  value: string | null;
}

class ExaltedDB extends Dexie {
  public characters!: Table<Character, string>;
  public metadata!: Table<Metadata, string>;

  constructor() {
    super("exalted-character-db");

    this.version(1)
      .stores({
        characters: "&id,name",
        metadata: "&key",
      })
      .upgrade(async tx => {
        if (typeof window === "undefined") return;
        const raw = window.localStorage.getItem("exalted-characters");
        if (!raw) return;
        try {
          const parsed = JSON.parse(raw) as {
            state?: { characters?: unknown[]; currentCharacterId?: string | null };
          };
          const characters = CharacterSchema.array().parse(parsed.state?.characters ?? []);
          await tx.table("characters").bulkPut(characters as Character[]);
          await tx
            .table("metadata")
            .put({ key: "currentCharacterId", value: parsed.state?.currentCharacterId ?? null });
          window.localStorage.removeItem("exalted-characters");
        } catch {
          // ignore invalid migrations
        }
      });
  }
}

export const db = new ExaltedDB();


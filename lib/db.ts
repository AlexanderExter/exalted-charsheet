import Dexie, { type Table } from "dexie";
import { type Character } from "@/lib/character-types";

interface Metadata {
  key: string;
  value: string | null;
}

class ExaltedDB extends Dexie {
  public characters!: Table<Character, string>;
  public metadata!: Table<Metadata, string>;

  constructor() {
    super("exalted-character-db");

    this.version(1).stores({
      characters: "&id,name",
      metadata: "&key",
    });
  }
}

export const db = new ExaltedDB();


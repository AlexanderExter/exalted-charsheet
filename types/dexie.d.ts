declare module "dexie" {
  export type Table<T, Key> = {
    toArray(): Promise<T[]>;
    put(item: T): Promise<Key>;
    delete(key: Key): Promise<void>;
    get(key: Key): Promise<T | undefined>;
  };

  export default class Dexie {
    constructor(name: string);
    version(versionNumber: number): { stores(schema: Record<string, string>): void };
    [prop: string]: any;
  }
}

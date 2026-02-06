import type { Character } from "@/lib/character-types";

interface EntityWithId {
  id: string;
}

type EntityKey = keyof Character;

interface UseEntityCRUDReturn<T extends EntityWithId> {
  items: T[];
  add: () => void;
  update: (id: string, field: keyof T, value: T[keyof T]) => void;
  remove: (id: string) => void;
  reorder: (items: T[]) => void;
}

/**
 * Generic CRUD hook for entity arrays in character data
 * Handles add, update, delete, and reorder operations
 */
export function useEntityCRUD<T extends EntityWithId>(
  character: Character,
  updateCharacter: (updates: Partial<Character>) => void,
  entityKey: EntityKey,
  createDefault: () => T
): UseEntityCRUDReturn<T> {
  // Get current items array (safely handle undefined)
  const items = (character[entityKey] as unknown as T[] | undefined) ?? [];

  const add = () => {
    const newItem = createDefault() as T;
    updateCharacter({
      [entityKey]: [...items, newItem],
    } as Partial<Character>);
  };

  const update = (id: string, field: keyof T, value: T[keyof T]) => {
    updateCharacter({
      [entityKey]: items.map(item => (item.id === id ? { ...item, [field]: value } : item)),
    } as Partial<Character>);
  };

  const remove = (id: string) => {
    updateCharacter({
      [entityKey]: items.filter(item => item.id !== id),
    } as Partial<Character>);
  };

  const reorder = (newItems: T[]) => {
    updateCharacter({
      [entityKey]: newItems,
    } as Partial<Character>);
  };

  return {
    items,
    add,
    update,
    remove,
    reorder,
  };
}

/**
 * Generic CRUD hook for nested entity arrays (e.g., social.intimacies)
 * Handles entities that are nested within another object
 */
export function useNestedEntityCRUD<T extends EntityWithId>(
  character: Character,
  updateCharacter: (updates: Partial<Character>) => void,
  parentKey: EntityKey,
  nestedKey: string,
  createDefault: () => T
): UseEntityCRUDReturn<T> {
  // Get parent object and nested items array
  const parent = character[parentKey] as Record<string, unknown>;
  const items = (parent?.[nestedKey] as T[] | undefined) ?? [];

  const add = () => {
    const newItem = createDefault() as T;
    updateCharacter({
      [parentKey]: {
        ...parent,
        [nestedKey]: [...items, newItem],
      },
    } as Partial<Character>);
  };

  const update = (id: string, field: keyof T, value: T[keyof T]) => {
    updateCharacter({
      [parentKey]: {
        ...parent,
        [nestedKey]: items.map(item => (item.id === id ? { ...item, [field]: value } : item)),
      },
    } as Partial<Character>);
  };

  const remove = (id: string) => {
    updateCharacter({
      [parentKey]: {
        ...parent,
        [nestedKey]: items.filter(item => item.id !== id),
      },
    } as Partial<Character>);
  };

  const reorder = (newItems: T[]) => {
    updateCharacter({
      [parentKey]: {
        ...parent,
        [nestedKey]: newItems,
      },
    } as Partial<Character>);
  };

  return {
    items,
    add,
    update,
    remove,
    reorder,
  };
}

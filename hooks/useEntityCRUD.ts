import { useCallback } from "react";
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
  const items = (character[entityKey] as T[] | undefined) ?? [];

  const add = useCallback(() => {
    const newItem = createDefault() as T;
    updateCharacter({
      [entityKey]: [...items, newItem],
    } as Partial<Character>);
  }, [character, updateCharacter, entityKey, createDefault, items]);

  const update = useCallback(
    (id: string, field: keyof T, value: T[keyof T]) => {
      updateCharacter({
        [entityKey]: items.map(item => (item.id === id ? { ...item, [field]: value } : item)),
      } as Partial<Character>);
    },
    [character, updateCharacter, entityKey, items]
  );

  const remove = useCallback(
    (id: string) => {
      updateCharacter({
        [entityKey]: items.filter(item => item.id !== id),
      } as Partial<Character>);
    },
    [character, updateCharacter, entityKey, items]
  );

  const reorder = useCallback(
    (newItems: T[]) => {
      updateCharacter({
        [entityKey]: newItems,
      } as Partial<Character>);
    },
    [updateCharacter, entityKey]
  );

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
  const parent = character[parentKey] as any;
  const items = (parent?.[nestedKey] as T[] | undefined) ?? [];

  const add = useCallback(() => {
    const newItem = createDefault() as T;
    updateCharacter({
      [parentKey]: {
        ...parent,
        [nestedKey]: [...items, newItem],
      },
    } as Partial<Character>);
  }, [character, updateCharacter, parentKey, nestedKey, parent, createDefault, items]);

  const update = useCallback(
    (id: string, field: keyof T, value: T[keyof T]) => {
      updateCharacter({
        [parentKey]: {
          ...parent,
          [nestedKey]: items.map(item => (item.id === id ? { ...item, [field]: value } : item)),
        },
      } as Partial<Character>);
    },
    [character, updateCharacter, parentKey, nestedKey, parent, items]
  );

  const remove = useCallback(
    (id: string) => {
      updateCharacter({
        [parentKey]: {
          ...parent,
          [nestedKey]: items.filter(item => item.id !== id),
        },
      } as Partial<Character>);
    },
    [character, updateCharacter, parentKey, nestedKey, parent, items]
  );

  const reorder = useCallback(
    (newItems: T[]) => {
      updateCharacter({
        [parentKey]: {
          ...parent,
          [nestedKey]: newItems,
        },
      } as Partial<Character>);
    },
    [updateCharacter, parentKey, nestedKey, parent]
  );

  return {
    items,
    add,
    update,
    remove,
    reorder,
  };
}

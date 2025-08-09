export const parseTagsFromString = (tagString: string): string[] =>
  tagString
    .split(",")
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)

export const stringifyTags = (tags: string[]): string => tags.join(", ")


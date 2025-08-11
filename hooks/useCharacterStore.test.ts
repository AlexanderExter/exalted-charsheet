import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/db", () => ({
  getAllCharacters: vi.fn().mockResolvedValue([]),
  saveCharacter: vi.fn().mockResolvedValue(undefined),
  deleteCharacter: vi.fn().mockResolvedValue(undefined),
  getCurrentCharacterId: vi.fn().mockResolvedValue(null),
  setCurrentCharacterId: vi.fn().mockResolvedValue(undefined),
}));

import { useCharacterStore, waitForCharacterStoreSave } from "@/hooks/useCharacterStore";
import { saveCharacter } from "@/lib/db";

describe("useCharacterStore autosave", () => {
  it("saves characters only when data changes", async () => {
    // Ensure store initialization completes
    await new Promise(res => setTimeout(res, 0));

    useCharacterStore.getState().addCharacter("Test");
    await waitForCharacterStoreSave();
    expect(saveCharacter).toHaveBeenCalledTimes(1);

    vi.mocked(saveCharacter).mockClear();

    const currentName = useCharacterStore.getState().currentCharacter!.name;
    useCharacterStore.getState().updateCurrentCharacter({ name: currentName });
    await waitForCharacterStoreSave();
    expect(saveCharacter).not.toHaveBeenCalled();

    useCharacterStore.getState().updateCurrentCharacter({ name: "Updated" });
    await waitForCharacterStoreSave();
    expect(saveCharacter).toHaveBeenCalledTimes(1);
  });
});

/**
 * @file Unit tests for languageTable.
 *
 * Covers:
 * - Table name built from the store's contentLanguage and the table kind
 * - Waits for the profile before answering
 */
import { useUserStore } from "~/stores/user";

import { languageTable } from "./languageTables";

// The store is the boundary: it owns the profile and its loading state.
jest.mock("~/stores/user");

/** Fakes the store with the given language; waitForProfile resolves when `ready` does. */
function mockStore(contentLanguage: string, ready: Promise<void> = Promise.resolve()) {
  const store = { contentLanguage, waitForProfile: jest.fn(() => ready) };
  jest.mocked(useUserStore).mockReturnValue(store as unknown as ReturnType<typeof useUserStore>);
  return store;
}

describe("languageTable", () => {
  it.each([
    ["en", "content", "en_content"],
    ["es", "vocabulary", "es_vocabulary"],
    ["fr", "quiz_results", "fr_quiz_results"],
  ] as const)('targets the %s table for "%s"', async (language, kind, expected) => {
    mockStore(language);

    await expect(languageTable(kind)).resolves.toBe(expected);
  });

  it("waits for the profile before answering", async () => {
    let markReady!: () => void;
    const store = mockStore("en", new Promise<void>((resolve) => (markReady = resolve)));
    const onTable = jest.fn();

    const pending = languageTable("content").then(onTable);
    await Promise.resolve();
    expect(store.waitForProfile).toHaveBeenCalled();
    expect(onTable).not.toHaveBeenCalled();

    markReady();
    await pending;
    expect(onTable).toHaveBeenCalledWith("en_content");
  });
});

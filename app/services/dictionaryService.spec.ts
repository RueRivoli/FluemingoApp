/**
 * @file Unit tests for dictionaryService.
 *
 * Covers:
 * - lookupWord: calls the dictionary-lookup Edge Function with the word and
 *   languages, returns its translations, an empty list without data, throws on error
 */
import { useSupabase } from "~/composables/useSupabase";
import type { DictionaryTranslation } from "~/types/dictionary";

import { lookupWord } from "./dictionaryService";

jest.mock("~/composables/useSupabase");

const TRANSLATIONS: DictionaryTranslation[] = [
  { text: "house", partOfSpeech: "noun", confidence: 0.6 },
];

/** Fakes supabase.functions.invoke resolving to `result`. */
function mockInvoke(result: { data: unknown; error: unknown }) {
  const invoke = jest.fn(() => Promise.resolve(result));
  jest.mocked(useSupabase).mockReturnValue({ functions: { invoke } } as unknown as ReturnType<
    typeof useSupabase
  >);
  return invoke;
}

describe("dictionaryService", () => {
  describe("lookupWord", () => {
    it("calls the dictionary-lookup function with the word and languages", async () => {
      const invoke = mockInvoke({ data: { translations: TRANSLATIONS }, error: null });

      await lookupWord("maison", "fr", "en");

      expect(invoke).toHaveBeenCalledWith("dictionary-lookup", {
        body: { text: "maison", from: "fr", to: "en" },
      });
    });

    it("returns the translations", async () => {
      mockInvoke({ data: { translations: TRANSLATIONS }, error: null });

      await expect(lookupWord("maison", "fr", "en")).resolves.toEqual(TRANSLATIONS);
    });

    it("returns an empty list when the function sends no data", async () => {
      mockInvoke({ data: null, error: null });

      await expect(lookupWord("maison", "fr", "en")).resolves.toEqual([]);
    });

    it("throws the error of the function", async () => {
      const error = new Error("Rate limit exceeded");
      mockInvoke({ data: null, error });

      await expect(lookupWord("maison", "fr", "en")).rejects.toBe(error);
    });
  });
});

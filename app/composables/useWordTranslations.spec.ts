/**
 * @file Unit tests for useWordTranslations.
 *
 * Covers:
 * - Looks the base form up (or the word without one) from the target to the
 *   native language, and exposes the translations
 * - Loading state while the dictionary answers
 * - No lookup for proper names, without a native language, or when it is the
 *   learned language
 * - Cache: a word looked up again does not call the dictionary, unless forced
 * - Error flag when the lookup fails
 * - Only the last clicked word's answer is kept
 */
import { flushPromises } from "@vue/test-utils";
import * as dictionaryService from "~/services/dictionaryService";
import { useUserStore } from "~/stores/user";
import type { DictionaryTranslation } from "~/types/dictionary";
import type { WordDefinition } from "~/types/video";
import { useWordTranslations } from "./useWordTranslations";

jest.mock("~/services/dictionaryService");
jest.mock("~/stores/user");

const WORD: WordDefinition = {
  text: "les maisons",
  basis: "maison",
  type: "nfp",
  translation: "the houses",
  note: null,
  isProperName: false,
};
const TRANSLATIONS: DictionaryTranslation[] = [
  { text: "house", partOfSpeech: "noun", confidence: 0.6 },
  { text: "home", partOfSpeech: "noun", confidence: 0.38 },
];

/** Fakes the store: learning French, native language English by default. */
function mockStore(nativeLanguage: string | null = "en") {
  jest.mocked(useUserStore).mockReturnValue({
    contentLanguage: "fr",
    nativeLanguage,
  } as unknown as ReturnType<typeof useUserStore>);
}

const lookupWord = jest.mocked(dictionaryService.lookupWord);

beforeEach(() => {
  mockStore();
  lookupWord.mockResolvedValue(TRANSLATIONS);
});

describe("useWordTranslations", () => {
  describe("lookup", () => {
    it("looks the base form up from the learned to the native language", async () => {
      const { lookup } = useWordTranslations();

      await lookup(WORD);

      expect(lookupWord).toHaveBeenCalledWith("maison", "fr", "en");
    });

    it("looks the word itself up when it has no base form", async () => {
      const { lookup } = useWordTranslations();

      await lookup({ ...WORD, text: "café", basis: null });

      expect(lookupWord).toHaveBeenCalledWith("café", "fr", "en");
    });

    it("exposes the translations", async () => {
      const { lookup, translations } = useWordTranslations();

      await lookup(WORD);

      expect(translations.value).toEqual(TRANSLATIONS);
    });

    it("is loading until the dictionary answers", async () => {
      const { lookup, isLoading } = useWordTranslations();

      const pending = lookup(WORD);
      expect(isLoading.value).toBe(true);
      await pending;

      expect(isLoading.value).toBe(false);
    });
  });

  describe("skipped lookups", () => {
    it.each([
      ["a proper name", () => ({ ...WORD, isProperName: true }), "en"],
      ["no native language", () => WORD, null],
      ["the native language is the learned one", () => WORD, "fr"],
    ])("does not call the dictionary for %s", async (_label, word, nativeLanguage) => {
      mockStore(nativeLanguage);
      const { lookup, translations } = useWordTranslations();

      await lookup(word());

      expect(lookupWord).not.toHaveBeenCalled();
      expect(translations.value).toEqual([]);
    });
  });

  describe("cache", () => {
    it("does not call the dictionary again for a word already looked up", async () => {
      const { lookup, translations } = useWordTranslations();

      await lookup(WORD);
      await lookup({ ...WORD, text: "maison" });

      expect(lookupWord).toHaveBeenCalledTimes(1);
      expect(translations.value).toEqual(TRANSLATIONS);
    });

    it("calls the dictionary again when forced", async () => {
      const { lookup } = useWordTranslations();

      await lookup(WORD);
      await lookup(WORD, { force: true });

      expect(lookupWord).toHaveBeenCalledTimes(2);
    });
  });

  describe("edge cases", () => {
    it("flags the error when the lookup fails", async () => {
      lookupWord.mockRejectedValue(new Error("Rate limit exceeded"));
      const { lookup, hasError, translations, isLoading } = useWordTranslations();

      await lookup(WORD);

      expect(hasError.value).toBe(true);
      expect(translations.value).toEqual([]);
      expect(isLoading.value).toBe(false);
    });

    it("keeps the answer of the last clicked word only", async () => {
      let answerFirst: (value: DictionaryTranslation[]) => void = () => {};
      lookupWord.mockImplementationOnce(
        () => new Promise((resolve) => (answerFirst = resolve)),
      );
      const second: DictionaryTranslation[] = [
        { text: "coffee", partOfSpeech: "noun", confidence: 0.9 },
      ];
      lookupWord.mockResolvedValueOnce(second);
      const { lookup, translations } = useWordTranslations();

      const first = lookup(WORD);
      await lookup({ ...WORD, text: "café", basis: null });
      answerFirst(TRANSLATIONS);
      await first;
      await flushPromises();

      expect(translations.value).toEqual(second);
    });
  });
});

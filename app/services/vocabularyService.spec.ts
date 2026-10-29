/**
 * @file Unit tests for vocabularyService.
 *
 * Covers:
 * - getMainArticleVocabulary: queries the user's language vocabulary table with
 *   the flashcards embedded, filters on the article, translates in the user's
 *   native language, carries the flashcard status, throws on error
 * - getPersonalArticleVocabulary: queries the flashcards table, keeps the words
 *   added by the user on the article, oldest first, maps rows, throws on error
 * - getArticleVocabulary: returns both lists, throws if one query fails
 * - getVideoVocabulary: same query filtered on the video (content_type 3),
 *   maps rows, throws on error
 */
import { useSupabase } from "~/composables/useSupabase";
import { languageTable } from "~/services/languageTables";
import { useUserStore } from "~/stores/user";
import type { Flashcard, Vocabulary } from "~/types/vocabulary";
import type { LanguageTableKind } from "~/utils/languages";

import {
  getArticleVocabulary,
  getMainArticleVocabulary,
  getPersonalArticleVocabulary,
  getVideoVocabulary,
} from "./vocabularyService";

jest.mock("~/composables/useSupabase");
// The table choice is tested in languageTables.spec.ts; here it is a fixed answer.
jest.mock("~/services/languageTables");
// Only the native language is read from the store.
jest.mock("~/stores/user");

const ARTICLE_ID = 18;
const DB_ERROR = new Error("permission denied for table fr_flashcards");

interface QueryResult {
  data: unknown;
  error: unknown;
}

/** Fakes the chained, thenable query `from().select().eq().is().order()`; one result per table. */
function mockQuery(results: Record<string, QueryResult>) {
  const builders: Record<string, ReturnType<typeof builderFor>> = {};
  function builderFor(result: QueryResult) {
    const builder = {
      select: jest.fn(() => builder),
      eq: jest.fn(() => builder),
      is: jest.fn(() => builder),
      order: jest.fn(() => builder),
      then: (resolve: (value: QueryResult) => unknown) =>
        Promise.resolve(result).then(resolve),
    };
    return builder;
  }
  const from = jest.fn((table: string) => {
    builders[table] ??= builderFor(results[table] ?? { data: [], error: null });
    return builders[table];
  });
  jest.mocked(useSupabase).mockReturnValue({ from } as unknown as ReturnType<typeof useSupabase>);
  return { from, builders };
}

/** Builds a fr_vocabulary row with the user's flashcards embedded. */
function vocabularyRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 1191,
    audio_url: "audio/utiliser.mp3",
    basis: "utiliser",
    chapter_id: null,
    content_type: 1,
    created_at: "2026-10-01T09:00:00Z",
    example: "J'utilise un vélo.",
    example_en: "I use a bike.",
    function: "v",
    proper_name: null,
    reference_id: ARTICLE_ID,
    text: "utiliser",
    text_en: "to use",
    flashcards: [],
    ...overrides,
  } as unknown as Vocabulary & { flashcards: Pick<Flashcard, "id" | "status">[] };
}

/** Builds a fr_flashcards row of a word the user added on the article. */
function flashcardRow(overrides: Partial<Flashcard> = {}): Flashcard {
  return {
    id: 5,
    audio_url: null,
    basis: null,
    chapter_id: null,
    content_id: ARTICLE_ID,
    created_at: "2026-10-12T09:00:00Z",
    example: null,
    example_translation: null,
    finished_datetime: null,
    function: "nf",
    proper_name: false,
    status: "saved",
    text: "une crue",
    text_translation: "a flood",
    user_id: "user-1",
    vocabulary_id: null,
    ...overrides,
  };
}

beforeEach(() => {
  jest.mocked(languageTable).mockImplementation(
    async (kind: LanguageTableKind) => `fr_${kind}` as never,
  );
  jest.mocked(useUserStore).mockReturnValue({ nativeLanguage: "en" } as unknown as ReturnType<
    typeof useUserStore
  >);
});

describe("vocabularyService", () => {
  describe("getMainArticleVocabulary", () => {
    it("queries the article's vocabulary with the user's flashcards embedded", async () => {
      const { builders } = mockQuery({});

      await getMainArticleVocabulary(ARTICLE_ID);

      const builder = builders.fr_vocabulary!;
      expect(builder.select).toHaveBeenCalledWith("*, flashcards:fr_flashcards ( id, status )");
      expect(builder.eq).toHaveBeenCalledWith("reference_id", ARTICLE_ID);
      expect(builder.eq).toHaveBeenCalledWith("content_type", 1);
    });

    it("maps a word nobody saved, translated in the native language", async () => {
      mockQuery({ fr_vocabulary: { data: [vocabularyRow()], error: null } });

      const [word] = await getMainArticleVocabulary(ARTICLE_ID);

      expect(word).toEqual({
        id: 1191,
        text: "utiliser",
        type: "v",
        translation: "to use",
        audioUrl: "audio/utiliser.mp3",
        exampleSentence: "J'utilise un vélo.",
        exampleTranslation: "I use a bike.",
        basis: "utiliser",
        note: null,
        properName: false,
        flashcardId: undefined,
        status: null,
        isAddedByUser: false,
      });
    });

    it("carries the flashcard of a word the user saved", async () => {
      const row = vocabularyRow({ flashcards: [{ id: 7, status: "training" }] });
      mockQuery({ fr_vocabulary: { data: [row], error: null } });

      const [word] = await getMainArticleVocabulary(ARTICLE_ID);

      expect(word?.flashcardId).toBe(7);
      expect(word?.status).toBe("training");
    });

    it("has no translation when the native language is unknown", async () => {
      jest.mocked(useUserStore).mockReturnValue({ nativeLanguage: null } as unknown as ReturnType<
        typeof useUserStore
      >);
      mockQuery({ fr_vocabulary: { data: [vocabularyRow()], error: null } });

      const [word] = await getMainArticleVocabulary(ARTICLE_ID);

      expect(word?.translation).toBeNull();
      expect(word?.exampleTranslation).toBeNull();
    });

    it("throws the Supabase error", async () => {
      mockQuery({ fr_vocabulary: { data: null, error: DB_ERROR } });

      await expect(getMainArticleVocabulary(ARTICLE_ID)).rejects.toBe(DB_ERROR);
    });
  });

  describe("getVideoVocabulary", () => {
    const VIDEO_ID = 42;

    it("queries the video's vocabulary with the user's flashcards embedded", async () => {
      const { builders } = mockQuery({});

      await getVideoVocabulary(VIDEO_ID);

      const builder = builders.fr_vocabulary!;
      expect(builder.select).toHaveBeenCalledWith("*, flashcards:fr_flashcards ( id, status )");
      expect(builder.eq).toHaveBeenCalledWith("reference_id", VIDEO_ID);
      expect(builder.eq).toHaveBeenCalledWith("content_type", 3);
    });

    it("maps the words, translated in the native language", async () => {
      mockQuery({ fr_vocabulary: { data: [vocabularyRow()], error: null } });

      const [word] = await getVideoVocabulary(VIDEO_ID);

      expect(word).toMatchObject({ id: 1191, text: "utiliser", translation: "to use" });
    });

    it("throws the Supabase error", async () => {
      mockQuery({ fr_vocabulary: { data: null, error: DB_ERROR } });

      await expect(getVideoVocabulary(VIDEO_ID)).rejects.toBe(DB_ERROR);
    });
  });

  describe("getPersonalArticleVocabulary", () => {
    it("keeps the words the user added on the article, oldest first", async () => {
      const { builders } = mockQuery({});

      await getPersonalArticleVocabulary(ARTICLE_ID);

      const builder = builders.fr_flashcards!;
      expect(builder.eq).toHaveBeenCalledWith("content_id", ARTICLE_ID);
      expect(builder.is).toHaveBeenCalledWith("vocabulary_id", null);
      expect(builder.order).toHaveBeenCalledWith("created_at");
    });

    it("maps the rows to vocabulary items added by the user", async () => {
      mockQuery({ fr_flashcards: { data: [flashcardRow()], error: null } });

      const [word] = await getPersonalArticleVocabulary(ARTICLE_ID);

      expect(word).toEqual({
        id: 5,
        text: "une crue",
        type: "nf",
        translation: "a flood",
        audioUrl: null,
        exampleSentence: null,
        exampleTranslation: null,
        basis: null,
        note: null,
        properName: false,
        flashcardId: 5,
        status: "saved",
        isAddedByUser: true,
      });
    });

    it("uses an empty text when the row has none", async () => {
      mockQuery({ fr_flashcards: { data: [flashcardRow({ text: null })], error: null } });

      const [word] = await getPersonalArticleVocabulary(ARTICLE_ID);

      expect(word?.text).toBe("");
    });

    it("throws the Supabase error", async () => {
      mockQuery({ fr_flashcards: { data: null, error: DB_ERROR } });

      await expect(getPersonalArticleVocabulary(ARTICLE_ID)).rejects.toBe(DB_ERROR);
    });
  });

  describe("getArticleVocabulary", () => {
    it("returns the main and personal vocabulary of the article", async () => {
      mockQuery({
        fr_vocabulary: { data: [vocabularyRow()], error: null },
        fr_flashcards: { data: [flashcardRow()], error: null },
      });

      const { mainVocabulary, personalVocabulary } = await getArticleVocabulary(ARTICLE_ID);

      expect(mainVocabulary.map((word) => word.text)).toEqual(["utiliser"]);
      expect(personalVocabulary.map((word) => word.text)).toEqual(["une crue"]);
    });

    it("throws when one of the queries fails", async () => {
      mockQuery({ fr_flashcards: { data: null, error: DB_ERROR } });

      await expect(getArticleVocabulary(ARTICLE_ID)).rejects.toBe(DB_ERROR);
    });
  });
});

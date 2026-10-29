/**
 * @file Unit tests for flashcardService.
 *
 * Covers:
 * - getFlashcardCounts: one HEAD count request per status on the user's
 *   flashcards table, counts keyed by status, null count → 0, throws on error
 * - getFlashcardsByStatus: rows of one status on the user's flashcards table,
 *   newest first, mapped to VocabularyItem, throws on error
 * - flashcardToVocabularyItem: renamed columns, fallbacks, user-added words
 */
import { useSupabase } from "~/composables/useSupabase";
import { languageTable } from "~/services/languageTables";
import type { Flashcard } from "~/types/vocabulary";
import {
  flashcardToVocabularyItem,
  getFlashcardCounts,
  getFlashcardsByStatus,
} from "./flashcardService";

jest.mock("~/composables/useSupabase");
// The table choice is tested in languageTables.spec.ts; here it is a fixed answer.
jest.mock("~/services/languageTables");

const DB_ERROR = new Error("permission denied for table en_flashcards");

interface CountResult {
  count: number | null;
  error: unknown;
}

/**
 * Fakes `from(table).select(…).eq("status", status)`, answering with the
 * result given for that status.
 */
function mockCounts(results: Record<string, CountResult>) {
  const select = jest.fn();
  const eq = jest.fn((_column: string, status: string) => Promise.resolve(results[status]));
  const builder = { select: select.mockImplementation(() => builder), eq };
  const from = jest.fn(() => builder);
  jest.mocked(useSupabase).mockReturnValue({ from } as unknown as ReturnType<typeof useSupabase>);
  return { from, select, eq };
}

const ok = (count: number | null): CountResult => ({ count, error: null });

interface RowsResult {
  data: unknown;
  error: unknown;
}

/**
 * Fakes `from(table).select().eq().order()…`: every step returns the builder,
 * and awaiting it yields `result` (PostgREST builders are thenable).
 */
function mockRows(result: RowsResult) {
  const builder = {
    select: jest.fn(() => builder),
    eq: jest.fn(() => builder),
    order: jest.fn(() => builder),
    then: (resolve: (value: RowsResult) => unknown) => Promise.resolve(result).then(resolve),
  };
  const from = jest.fn(() => builder);
  jest.mocked(useSupabase).mockReturnValue({ from } as unknown as ReturnType<typeof useSupabase>);
  return { from, builder };
}

/** Builds a flashcards row with the columns the mapping reads. */
function flashcardRow(overrides: Partial<Flashcard> = {}): Flashcard {
  return {
    id: 12,
    text: "Des dizaines de touristes",
    function: null,
    text_translation: "Dozens of tourists",
    audio_url: "articles/fr/rap/vocabulary/touristes.mp3",
    example: null,
    example_translation: null,
    basis: "touriste",
    proper_name: false,
    status: "saved",
    vocabulary_id: 40,
    ...overrides,
  } as Flashcard;
}

beforeEach(() => {
  jest.mocked(languageTable).mockResolvedValue("en_flashcards");
});

describe("flashcardService", () => {
  describe("getFlashcardCounts", () => {
    it("sends one HEAD count request per status on the user's flashcards table", async () => {
      const { from, select, eq } = mockCounts({
        saved: ok(0),
        difficult: ok(0),
        training: ok(0),
        mastered: ok(0),
      });

      await getFlashcardCounts();

      expect(languageTable).toHaveBeenCalledWith("flashcards");
      expect(from).toHaveBeenCalledWith("en_flashcards");
      expect(select).toHaveBeenCalledWith("*", { count: "exact", head: true });
      expect(eq.mock.calls).toEqual([
        ["status", "saved"],
        ["status", "difficult"],
        ["status", "training"],
        ["status", "mastered"],
      ]);
    });

    it("returns the count of each status", async () => {
      mockCounts({ saved: ok(22), difficult: ok(0), training: ok(18), mastered: ok(2) });

      await expect(getFlashcardCounts()).resolves.toEqual({
        saved: 22,
        difficult: 0,
        training: 18,
        mastered: 2,
      });
    });

    it("counts 0 when Supabase returns no count", async () => {
      mockCounts({ saved: ok(null), difficult: ok(1), training: ok(1), mastered: ok(1) });

      const counts = await getFlashcardCounts();

      expect(counts.saved).toBe(0);
    });

    it("throws the Supabase error", async () => {
      mockCounts({
        saved: ok(1),
        difficult: { count: null, error: DB_ERROR },
        training: ok(1),
        mastered: ok(1),
      });

      await expect(getFlashcardCounts()).rejects.toBe(DB_ERROR);
    });
  });

  describe("getFlashcardsByStatus", () => {
    it("queries the rows of the status on the user's flashcards table", async () => {
      const { from, builder } = mockRows({ data: [], error: null });

      await getFlashcardsByStatus("difficult");

      expect(from).toHaveBeenCalledWith("en_flashcards");
      expect(builder.eq).toHaveBeenCalledWith("status", "difficult");
    });

    it("lists the most recently added words first, with a stable tie-break", async () => {
      const { builder } = mockRows({ data: [], error: null });

      await getFlashcardsByStatus("saved");

      expect(builder.order.mock.calls).toEqual([
        ["created_at", { ascending: false }],
        ["id", { ascending: false }],
      ]);
    });

    it("maps the rows to vocabulary items", async () => {
      mockRows({ data: [flashcardRow()], error: null });

      const [word] = await getFlashcardsByStatus("saved");

      expect(word).toMatchObject({ id: 12, text: "Des dizaines de touristes", basis: "touriste" });
    });

    it("returns an empty list when the deck is empty", async () => {
      mockRows({ data: [], error: null });

      await expect(getFlashcardsByStatus("mastered")).resolves.toEqual([]);
    });

    it("throws the Supabase error", async () => {
      mockRows({ data: null, error: DB_ERROR });

      await expect(getFlashcardsByStatus("saved")).rejects.toBe(DB_ERROR);
    });
  });

  describe("flashcardToVocabularyItem", () => {
    it("renames the columns to camelCase fields", () => {
      expect(flashcardToVocabularyItem(flashcardRow({ function: "nf" }))).toEqual({
        id: 12,
        text: "Des dizaines de touristes",
        type: "nf",
        translation: "Dozens of tourists",
        audioUrl: "articles/fr/rap/vocabulary/touristes.mp3",
        exampleSentence: null,
        exampleTranslation: null,
        basis: "touriste",
        note: null,
        properName: false,
        flashcardId: 12,
        status: "saved",
        isAddedByUser: false,
      });
    });

    it("falls back to an empty text and a common noun", () => {
      const word = flashcardToVocabularyItem(flashcardRow({ text: null, proper_name: null }));

      expect(word.text).toBe("");
      expect(word.properName).toBe(false);
    });

    it("flags the words the user added (no vocabulary row)", () => {
      expect(flashcardToVocabularyItem(flashcardRow({ vocabulary_id: null })).isAddedByUser).toBe(
        true,
      );
    });
  });
});

/**
 * @file Unit tests for flashcardService.
 *
 * Covers:
 * - getFlashcardCounts: one HEAD count request per status on the user's
 *   flashcards table, counts keyed by status, null count → 0, throws on error
 */
import { useSupabase } from "~/composables/useSupabase";
import { languageTable } from "~/services/languageTables";
import { getFlashcardCounts } from "./flashcardService";

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
});

/**
 * @file Unit tests for audiobookService.
 *
 * Covers:
 * - getAudiobooks: queries audiobook rows (content_type 2) of the user's
 *   language table, optional level filter ("All"/null = none), optional themes
 *   filter on category_2/category_3 (empty = none), throws on error,
 *   returns the audiobooks grouped by category_1
 * - Row → AudiobookInfo mapping: description, per-table translations,
 *   storage image URL, level, themes, isNew (null → false), category
 */
import { useSupabase } from "~/composables/useSupabase";
import { languageTable } from "~/services/languageTables";
import type { Content } from "~/types/article";
import { THEMES } from "~/utils/themes";

import { getAudiobooks } from "./audiobookService";

jest.mock("~/composables/useSupabase");
// The table choice is tested in languageTables.spec.ts; here it is a fixed answer.
jest.mock("~/services/languageTables");

const DB_ERROR = new Error("permission denied for table en_content");
const STORAGE_BASE = "https://project.supabase.co/storage/v1/object/public";

interface QueryResult {
  data: unknown;
  error: unknown;
}

/**
 * Fakes the chained query `from().select().eq()…` (thenable, like PostgREST
 * builders) and `storage.from(bucket).getPublicUrl(path)`.
 */
function mockQuery(result: QueryResult) {
  const builder = {
    select: jest.fn(() => builder),
    eq: jest.fn(() => builder),
    or: jest.fn(() => builder),
    then: (resolve: (value: QueryResult) => unknown) => Promise.resolve(result).then(resolve),
  };
  const from = jest.fn(() => builder);
  const storage = {
    from: jest.fn((bucket: string) => ({
      getPublicUrl: (path: string) => ({ data: { publicUrl: `${STORAGE_BASE}/${bucket}/${path}` } }),
    })),
  };
  jest.mocked(useSupabase).mockReturnValue({ from, storage } as unknown as ReturnType<
    typeof useSupabase
  >);
  return { from, builder };
}

/** Builds an en_content audiobook row; en_content has description_fr but no description_en. */
function row(overrides: Record<string, unknown> = {}): Content {
  return {
    id: 12,
    content_type: 2,
    title: "The Little Prince",
    description: "A pilot stranded in the desert…",
    description_de: "Ein Pilot…",
    description_es: null,
    description_fr: "Un aviateur…",
    description_it: null,
    description_ja: null,
    description_nl: null,
    description_pt: null,
    img_url: "audiobooks/en/little-prince/cover.jpg",
    published_at: "2026-10-07T12:00:00Z",
    level: "A2",
    category_1: "fiction",
    category_2: null,
    category_3: null,
    accent: null,
    author: "Antoine de Saint-Exupéry",
    is_new: true,
    ...overrides,
  } as unknown as Content;
}

beforeEach(() => {
  jest.mocked(languageTable).mockResolvedValue("en_content");
});

/** Loads rows through getAudiobooks and returns the audiobooks of every group. */
async function loadAll(rows: Content[]) {
  mockQuery({ data: rows, error: null });
  return Object.values(await getAudiobooks()).flat();
}

describe("audiobookService", () => {
  describe("getAudiobooks", () => {
    it("queries the audiobook rows of the user's language table", async () => {
      const { from, builder } = mockQuery({ data: [], error: null });

      await getAudiobooks();

      expect(languageTable).toHaveBeenCalledWith("content");
      expect(from).toHaveBeenCalledWith("en_content");
      expect(builder.eq).toHaveBeenCalledWith("content_type", 2);
    });

    it.each([
      ["by default", undefined],
      ['for "All"', "All"],
    ] as const)("does not filter on level %s", async (_label, level) => {
      const { builder } = mockQuery({ data: [], error: null });

      await getAudiobooks(level);

      const levelFilters = builder.eq.mock.calls.filter(([column]) => column === "level");
      expect(levelFilters).toEqual([]);
    });

    it("filters on the given level", async () => {
      const { builder } = mockQuery({ data: [], error: null });

      await getAudiobooks("B2");

      expect(builder.eq).toHaveBeenCalledWith("level", "B2");
    });

    it("does not filter on themes by default", async () => {
      const { builder } = mockQuery({ data: [], error: null });

      await getAudiobooks("B2", []);

      expect(builder.or).not.toHaveBeenCalled();
    });

    it("keeps the audiobooks whose category_2 or category_3 is one of the themes", async () => {
      const { builder } = mockQuery({ data: [], error: null });

      await getAudiobooks(null, ["sport", "japaneseCulture"]);

      expect(builder.or).toHaveBeenCalledWith(
        "category_2.ilike.sport,category_3.ilike.sport," +
          "category_2.ilike.japaneseCulture,category_3.ilike.japaneseCulture",
      );
    });

    it("combines the level and themes filters", async () => {
      const { builder } = mockQuery({ data: [], error: null });

      await getAudiobooks("A1", ["travel"]);

      expect(builder.eq).toHaveBeenCalledWith("level", "A1");
      expect(builder.or).toHaveBeenCalledWith("category_2.ilike.travel,category_3.ilike.travel");
    });

    it("throws the Supabase error", async () => {
      mockQuery({ data: null, error: DB_ERROR });

      await expect(getAudiobooks()).rejects.toBe(DB_ERROR);
    });

    it("groups the audiobooks by category_1", async () => {
      mockQuery({
        data: [
          row({ id: 1, category_1: "Novel" }),
          row({ id: 2, category_1: "Biography", category_2: "Sport" }),
          row({ id: 3, category_1: "Novel" }),
        ],
        error: null,
      });

      const groups = await getAudiobooks();

      expect(Object.keys(groups)).toEqual(["novel", "biography"]);
      expect(groups.novel?.map((audiobook) => audiobook.id)).toEqual([1, 3]);
      expect(groups.biography?.map((audiobook) => audiobook.id)).toEqual([2]);
    });

    it("returns an empty object when there are no audiobooks", async () => {
      mockQuery({ data: [], error: null });

      await expect(getAudiobooks()).resolves.toEqual({});
    });
  });

  describe("mapping", () => {
    it("maps a row to the AudiobookInfo the app displays", async () => {
      const [audiobook] = await loadAll([row()]);

      expect(audiobook).toEqual({
        id: 12,
        title: "The Little Prince",
        description: "A pilot stranded in the desert…",
        descriptionDe: "Ein Pilot…",
        descriptionEn: null,
        descriptionEs: null,
        descriptionFr: "Un aviateur…",
        descriptionIt: null,
        descriptionJa: null,
        descriptionNl: null,
        descriptionPt: null,
        imageUrl: `${STORAGE_BASE}/content/audiobooks/en/little-prince/cover.jpg`,
        publishedAt: "2026-10-07T12:00:00Z",
        level: "A2",
        themes: [{ id: "fiction", ...THEMES.fiction }],
        accent: null,
        author: "Antoine de Saint-Exupéry",
        isNew: true,
        category: "fiction",
      });
    });

    it("is not new when is_new is null", async () => {
      const [audiobook] = await loadAll([row({ is_new: null })]);

      expect(audiobook?.isNew).toBe(false);
    });

    it("has no category when category_1 is empty", async () => {
      const [audiobook] = await loadAll([row({ category_1: "" })]);

      expect(audiobook?.category).toBeNull();
    });

    it("uses an empty title when the row has none", async () => {
      const [audiobook] = await loadAll([row({ title: null })]);

      expect(audiobook?.title).toBe("");
    });
  });
});

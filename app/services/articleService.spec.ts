/**
 * @file Unit tests for articleService.
 *
 * Covers:
 * - getNewsArticles: queries news rows of the user's language table (via
 *   languageTable), optional level filter ("All"/null = none), throws on error
 * - Pagination: newest first with a stable tie-break, the requested page's
 *   range, the exact total count (0 when missing)
 * - Row → NewsArticleInfo mapping: renamed columns, null title fallback, level
 *   normalisation, themes built from category_1..3 without null/undefined,
 *   resolved against THEMES, img_url storage paths turned into public URLs
 */
import { useSupabase } from "~/composables/useSupabase";

import { languageTable } from "~/services/languageTables";
import type { Content } from "~/types/article";
import { ARTICLES_PAGE_SIZE } from "~/utils/articles";

import { getNewsArticles } from "./articleService";

jest.mock("~/composables/useSupabase");
// The table choice is tested in languageTables.spec.ts; here it is a fixed answer.
jest.mock("~/services/languageTables");

type Article = Content;

const DB_ERROR = new Error("permission denied for table fr_content");

interface QueryResult {
  data: unknown;
  error: unknown;
  count?: number | null;
}

const STORAGE_BASE = "https://project.supabase.co/storage/v1/object/public";

/**
 * Fakes the chained query `from().select().eq()…`: every step returns the
 * builder, and awaiting it yields `result` (PostgREST builders are thenable).
 * Also fakes `storage.from(bucket).getPublicUrl(path)`.
 */
function mockQuery(result: QueryResult) {
  const builder = {
    select: jest.fn(() => builder),
    eq: jest.fn(() => builder),
    or: jest.fn(() => builder),
    order: jest.fn(() => builder),
    range: jest.fn(() => builder),
    then: (resolve: (value: QueryResult) => unknown) =>
      Promise.resolve(result).then(resolve),
  };
  const from = jest.fn(() => builder);
  const storage = {
    from: jest.fn((bucket: string) => ({
      getPublicUrl: (path: string) => ({
        data: { publicUrl: `${STORAGE_BASE}/${bucket}/${path}` },
      }),
    })),
  };
  jest
    .mocked(useSupabase)
    .mockReturnValue({ from, storage } as unknown as ReturnType<
      typeof useSupabase
    >);
  return { from, builder, storage };
}

/** Builds an fr_content row with the columns the mapping reads. */
function row(overrides: Partial<Article> = {}): Article {
  return {
    id: 7,
    title: "Un lycéen blessé",
    description: "In Lens…",
    description_de: null,
    description_en: "In Lens (en)…",
    description_es: null,
    description_it: null,
    description_ja: null,
    description_nl: null,
    description_pt: null,
    img_url: "https://cdn.test/cover.jpg",
    published_at: "2026-10-07T12:00:00Z",
    level: "b1",
    category_1: "Politics",
    category_2: null,
    category_3: "Education",
    accent: null,
    author: "AFP",
    ...overrides,
  } as Article;
}

/** Loads a single row through getNewsArticles and returns the mapped article. */
async function mapRow(overrides: Partial<Article> = {}) {
  mockQuery({ data: [row(overrides)], error: null });
  const {
    articles: [article],
  } = await getNewsArticles();
  return article;
}

beforeEach(() => {
  jest.mocked(languageTable).mockResolvedValue("es_content");
});

describe("articleService", () => {
  describe("getNewsArticles", () => {
    it("queries the news rows of the user's language table", async () => {
      const { from, builder } = mockQuery({ data: [], error: null });

      await getNewsArticles();

      expect(languageTable).toHaveBeenCalledWith("content");
      expect(from).toHaveBeenCalledWith("es_content");
      expect(builder.eq).toHaveBeenCalledWith("content_type", 1);
    });

    it.each([
      ["by default", undefined],
      ['for "All"', "All"],
    ] as const)("does not filter on level %s", async (_label, level) => {
      const { builder } = mockQuery({ data: [], error: null });

      await getNewsArticles(level);

      // Checks the column only: expect.anything() would let a `level = null` filter through.
      const levelFilters = builder.eq.mock.calls.filter(
        ([column]) => column === "level",
      );
      expect(levelFilters).toEqual([]);
    });

    it("filters on the given level", async () => {
      const { builder } = mockQuery({ data: [], error: null });

      await getNewsArticles("B1");

      expect(builder.eq).toHaveBeenCalledWith("level", "B1");
    });

    it("returns an empty list when there are no articles", async () => {
      mockQuery({ data: [], error: null });

      await expect(getNewsArticles()).resolves.toEqual({
        articles: [],
        total: 0,
      });
    });

    it("throws the Supabase error", async () => {
      mockQuery({ data: null, error: DB_ERROR });

      await expect(getNewsArticles()).rejects.toBe(DB_ERROR);
    });
  });

  describe("pagination", () => {
    it("asks for the exact total count", async () => {
      const { builder } = mockQuery({ data: [], error: null });

      await getNewsArticles();

      expect(builder.select).toHaveBeenCalledWith("*", { count: "exact" });
    });

    it("sorts the newest articles first, then by id so pages never overlap", async () => {
      const { builder } = mockQuery({ data: [], error: null });

      await getNewsArticles();

      expect(builder.order.mock.calls).toEqual([
        ["published_at", { ascending: false, nullsFirst: false }],
        ["id", { ascending: false }],
      ]);
    });

    it("loads the first page of ARTICLES_PAGE_SIZE articles by default", async () => {
      const { builder } = mockQuery({ data: [], error: null });

      await getNewsArticles();

      expect(builder.range).toHaveBeenCalledWith(0, ARTICLES_PAGE_SIZE - 1);
    });

    it("loads the range of the requested page", async () => {
      const { builder } = mockQuery({ data: [], error: null });

      await getNewsArticles("All", [], 3, 10);

      expect(builder.range).toHaveBeenCalledWith(20, 29);
    });

    it("returns the total count across all pages", async () => {
      mockQuery({ data: [row()], error: null, count: 57 });

      const { articles, total } = await getNewsArticles();

      expect(articles).toHaveLength(1);
      expect(total).toBe(57);
    });
  });

  describe("mapping", () => {
    it("renames the columns to camelCase fields", async () => {
      const article = await mapRow();

      expect(article).toMatchObject({
        id: 7,
        title: "Un lycéen blessé",
        imageUrl: "https://cdn.test/cover.jpg",
        publishedAt: "2026-10-07T12:00:00Z",
        descriptionEn: "In Lens (en)…",
        author: "AFP",
      });
    });

    it("turns an img_url storage path into its public URL in the content bucket", async () => {
      const article = await mapRow({
        img_url: "articles/fr/rap/image-min.png",
      });

      expect(article.imageUrl).toBe(
        `${STORAGE_BASE}/content/articles/fr/rap/image-min.png`,
      );
    });

    it("keeps an img_url that is already a full URL", async () => {
      const article = await mapRow({ img_url: "https://cdn.test/cover.jpg" });

      expect(article.imageUrl).toBe("https://cdn.test/cover.jpg");
    });

    it("has no image URL when img_url is empty", async () => {
      const article = await mapRow({ img_url: null });

      expect(article.imageUrl).toBeNull();
    });

    it("uses an empty title when the row has none", async () => {
      const article = await mapRow({ title: null });

      expect(article.title).toBe("");
    });

    it("normalises the level to a CEFR level", async () => {
      const article = await mapRow({ level: "b1" });

      expect(article.level).toBe("B1");
    });

    it("builds themes from category_1..3, skipping null ones", async () => {
      const article = await mapRow();

      expect(article.themes.map((theme) => theme.id)).toEqual([
        "politics",
        "education",
      ]);
    });

    it("resolves each category to its theme label and icon", async () => {
      const article = await mapRow({
        category_1: "news",
        category_2: null,
        category_3: null,
      });

      expect(article.themes).toEqual([
        { id: "news", label: "News", icon: "fa-regular fa-newspaper" },
      ]);
    });

    it("skips undefined categories too", async () => {
      const article = await mapRow({
        category_1: undefined,
        category_2: "News",
        category_3: null,
      });

      expect(article.themes.map((theme) => theme.id)).toEqual(["news"]);
    });

    it("returns no themes when every category is empty", async () => {
      const article = await mapRow({
        category_1: null,
        category_2: null,
        category_3: null,
      });

      expect(article.themes).toEqual([]);
    });
  });
});

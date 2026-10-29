/**
 * @file Unit tests for contentStorage.
 *
 * Covers:
 * - toContentFileUrl: public URL of a content bucket path, full URLs kept,
 *   null for an empty path, leading "/" and "content/" prefixes dropped
 * - toContentImageUrl: same resolution for img_url paths
 */
import { useSupabase } from "~/composables/useSupabase";
import { toContentFileUrl, toContentImageUrl } from "./contentStorage";

jest.mock("~/composables/useSupabase");

const STORAGE_BASE = "https://project.supabase.co/storage/v1/object/public";

/** Fakes `storage.from(bucket).getPublicUrl(path)`. */
function mockStorage() {
  const from = jest.fn((bucket: string) => ({
    getPublicUrl: (path: string) => ({
      data: { publicUrl: `${STORAGE_BASE}/${bucket}/${path}` },
    }),
  }));
  jest
    .mocked(useSupabase)
    .mockReturnValue({ storage: { from } } as unknown as ReturnType<typeof useSupabase>);
  return { from };
}

beforeEach(() => {
  mockStorage();
});

describe("contentStorage", () => {
  describe("toContentFileUrl", () => {
    it("turns a path into its public URL in the content bucket", () => {
      expect(toContentFileUrl("videos/fr/abc/vocabulary/un-projet.mp3")).toBe(
        `${STORAGE_BASE}/content/videos/fr/abc/vocabulary/un-projet.mp3`,
      );
    });

    it.each([
      ["a leading slash", "/articles/fr/rap/word.mp3"],
      ["the bucket name", "content/articles/fr/rap/word.mp3"],
      ["both", "/content/articles/fr/rap/word.mp3"],
    ])("drops %s from the path", (_label, path) => {
      expect(toContentFileUrl(path)).toBe(`${STORAGE_BASE}/content/articles/fr/rap/word.mp3`);
    });

    it("keeps a full URL as-is", () => {
      expect(toContentFileUrl("https://cdn.test/word.mp3")).toBe("https://cdn.test/word.mp3");
    });

    it.each([null, ""])("returns null for %p", (path) => {
      expect(toContentFileUrl(path)).toBeNull();
    });
  });

  describe("toContentImageUrl", () => {
    it("resolves an img_url path like any content file", () => {
      expect(toContentImageUrl("articles/fr/rap/image.png")).toBe(
        `${STORAGE_BASE}/content/articles/fr/rap/image.png`,
      );
    });
  });
});

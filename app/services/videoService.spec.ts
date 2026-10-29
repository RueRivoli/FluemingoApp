/**
 * @file Unit tests for videoService and contentStorage.
 *
 * Covers:
 * - getVideos: queries fr_videos for French learners, most recent first,
 *   optional level filter ("All"/null = none), never selects the heavy
 *   content column, throws on error; no query and
 *   an empty list for languages without a video table
 * - Row → VideoInfo mapping: youtube id, channel and its avatar, thumbnail, level, category,
 *   featured flag, length, subtitles, speech rate, NEW from the publication date
 * - getVideo: one video by id with its subtitles (from content, empty when
 *   not transcribed), null when missing or for languages without a
 *   video table, throws on error
 * - toContentImageUrl: storage path → public URL, full URL kept, empty → null
 * - toContentFileUrl: audio storage path → public URL, full URL kept, empty → null
 */
import { useSupabase } from "~/composables/useSupabase";
import { toContentFileUrl, toContentImageUrl } from "~/services/contentStorage";
import { useUserStore } from "~/stores/user";
import type { VideoRow } from "~/types/video";

import { getVideo, getVideos } from "./videoService";

jest.mock("~/composables/useSupabase");
// The store is the boundary: it owns the profile and its target language.
jest.mock("~/stores/user");

const DB_ERROR = new Error("permission denied for table fr_videos");
const NOW = new Date("2026-10-19T12:00:00Z");
const STORAGE_BASE = "https://project.supabase.co/storage/v1/object/public";

interface QueryResult {
  data: unknown;
  error: unknown;
}

/**
 * Fakes the chained query `from().select().eq()…order()` (thenable, like
 * PostgREST builders) and `storage.from(bucket).getPublicUrl(path)`.
 */
function mockQuery(result: QueryResult) {
  const builder = {
    select: jest.fn((_columns?: string) => builder),
    eq: jest.fn(() => builder),
    order: jest.fn(() => builder),
    maybeSingle: jest.fn(() => builder),
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

/** Builds a fr_videos row; override what the test needs. */
function row(overrides: Partial<VideoRow> = {}): VideoRow {
  return {
    id: 7,
    youtube_id: "abc123",
    title: "Une journée à Paris",
    description: "Suivez Camille…",
    channel_title: "Slow French Café",
    channel_id: "UC123",
    channel_avatar_url: "channels/UC123.jpg",
    thumbnail_url: "https://i.ytimg.com/vi/abc123/hqdefault.jpg",
    level: "b1",
    category: "slow_french",
    is_featured: true,
    duration_seconds: 860,
    has_captions: true,
    caption_type: "manual",
    speech_rate: "Slow",
    published_at: "2026-10-12T12:00:00Z",
    ...overrides,
  } as VideoRow;
}

/** Fakes the store with the given target language (and native language, none by default). */
function mockStore(contentLanguage: string, nativeLanguage: string | null = null) {
  jest.mocked(useUserStore).mockReturnValue({
    contentLanguage,
    nativeLanguage,
    waitForProfile: jest.fn(() => Promise.resolve()),
  } as unknown as ReturnType<typeof useUserStore>);
}

beforeEach(() => {
  mockStore("fr");
  // isNew depends on the current date.
  jest.useFakeTimers({ now: NOW });
});

afterEach(() => {
  jest.useRealTimers();
});

describe("videoService", () => {
  describe("getVideos", () => {
    it("queries fr_videos for French learners, most recent first", async () => {
      const { from, builder } = mockQuery({ data: [], error: null });

      await getVideos();

      expect(from).toHaveBeenCalledWith("fr_videos");
      expect(builder.order).toHaveBeenCalledWith("published_at", { ascending: false });
    });

    it("does not load the transcript (content) of every video", async () => {
      const { builder } = mockQuery({ data: [], error: null });

      await getVideos();

      const columns = builder.select.mock.calls[0]?.[0] ?? "";
      expect(columns).not.toContain("*");
      expect(columns.split(",").map((column) => column.trim())).not.toContain("content");
    });

    it.each(["en", "es"])("returns no video, without querying, for %s learners", async (language) => {
      mockStore(language);
      const { from } = mockQuery({ data: [], error: null });

      await expect(getVideos()).resolves.toEqual([]);
      expect(from).not.toHaveBeenCalled();
    });

    it.each([
      ["by default", undefined],
      ['for "All"', "All"],
    ] as const)("does not filter on level %s", async (_label, level) => {
      const { builder } = mockQuery({ data: [], error: null });

      await getVideos(level);

      const levelFilters = builder.eq.mock.calls.filter(([column]) => column === "level");
      expect(levelFilters).toEqual([]);
    });

    it("filters on the given level", async () => {
      const { builder } = mockQuery({ data: [], error: null });

      await getVideos("B2");

      expect(builder.eq).toHaveBeenCalledWith("level", "B2");
    });

    it("throws the Supabase error", async () => {
      mockQuery({ data: null, error: DB_ERROR });

      await expect(getVideos()).rejects.toBe(DB_ERROR);
    });
  });

  describe("getVideo", () => {
    it("loads the video with this id from fr_videos", async () => {
      const { from, builder } = mockQuery({ data: row({ id: 42 }), error: null });

      const video = await getVideo(42);

      expect(from).toHaveBeenCalledWith("fr_videos");
      expect(builder.eq).toHaveBeenCalledWith("id", 42);
      expect(video).toMatchObject({ id: 42, youtubeId: "abc123" });
    });

    it("builds the subtitles from the content column", async () => {
      const content = { paragraphs: [{ sentences: [{ text: "Bonjour.", start: 0.5, end: 1.5 }] }] };
      mockQuery({ data: row({ content }), error: null });

      const video = await getVideo(42);

      expect(video?.subtitles).toEqual([
        {
          start: 0.5,
          end: 1.5,
          text: "Bonjour.",
          translation: null,
          segments: [{ text: "Bonjour.", word: null }],
        },
      ]);
    });

    it("translates the subtitles into the user's native language", async () => {
      const content = {
        paragraphs: [{ sentences: [{ text: "Bonjour.", start: 0, textEn: "Hello.", textEs: "Hola." }] }],
      };
      mockStore("fr", "es");
      mockQuery({ data: row({ content }), error: null });

      expect((await getVideo(42))?.subtitles[0]?.translation).toBe("Hola.");
    });

    it.each([
      ["has units", [{ text: "Bonjour" }], true],
      ["has no units", undefined, false],
    ])("tells whether the transcript %s", async (_label, units, hasUnits) => {
      const content = { paragraphs: [{ sentences: [{ text: "Bonjour.", start: 0, units }] }] };
      mockQuery({ data: row({ content }), error: null });

      expect((await getVideo(42))?.hasUnits).toBe(hasUnits);
    });

    it("has no subtitles while the video is not transcribed", async () => {
      mockQuery({ data: row({ content: null }), error: null });

      expect((await getVideo(42))?.subtitles).toEqual([]);
    });

    it("returns null when the video does not exist", async () => {
      mockQuery({ data: null, error: null });

      await expect(getVideo(42)).resolves.toBeNull();
    });

    it("returns null, without querying, for languages without a video table", async () => {
      mockStore("en");
      const { from } = mockQuery({ data: null, error: null });

      await expect(getVideo(42)).resolves.toBeNull();
      expect(from).not.toHaveBeenCalled();
    });

    it("throws the Supabase error", async () => {
      mockQuery({ data: null, error: DB_ERROR });

      await expect(getVideo(42)).rejects.toBe(DB_ERROR);
    });
  });

  describe("row mapping", () => {
    it("maps a row to a VideoInfo", async () => {
      mockQuery({ data: [row()], error: null });

      expect(await getVideos()).toEqual([
        {
          id: 7,
          youtubeId: "abc123",
          title: "Une journée à Paris",
          description: "Suivez Camille…",
          channel: "Slow French Café",
          channelAvatarUrl: `${STORAGE_BASE}/content/channels/UC123.jpg`,
          thumbnailUrl: "https://i.ytimg.com/vi/abc123/hqdefault.jpg",
          level: "B1",
          isNew: true,
          isFeatured: true,
          category: "SlowFrench",
          duration: 860,
          subtitles: "native",
          speechRate: "slow",
          publishedAt: "2026-10-12T12:00:00Z",
        },
      ]);
    });

    it("falls back on empty values for unknown or missing data", async () => {
      mockQuery({
        data: [
          row({
            channel_title: "",
            channel_avatar_url: null,
            category: "Cooking",
            thumbnail_url: null,
            has_captions: false,
            speech_rate: null,
            duration_seconds: null,
            published_at: "2026-01-01T00:00:00Z",
          }),
        ],
        error: null,
      });

      const [video] = await getVideos();

      expect(video).toMatchObject({
        channel: null,
        channelAvatarUrl: null,
        category: null,
        thumbnailUrl: null,
        subtitles: null,
        speechRate: null,
        duration: null,
        isNew: false,
      });
    });
  });
});

describe("toContentImageUrl", () => {
  it("keeps full URLs as-is", () => {
    expect(toContentImageUrl("https://cdn.test/a.jpg")).toBe("https://cdn.test/a.jpg");
  });

  it("returns null for an empty path", () => {
    expect(toContentImageUrl(null)).toBeNull();
    expect(toContentImageUrl("")).toBeNull();
  });

  it("turns a storage path into the public URL of the content bucket", () => {
    mockQuery({ data: [], error: null });

    expect(toContentImageUrl("a/b.png")).toBe(`${STORAGE_BASE}/content/a/b.png`);
  });
});

describe("toContentFileUrl", () => {
  it("turns an audio storage path into the public URL of the content bucket", () => {
    mockQuery({ data: [], error: null });

    expect(toContentFileUrl("videos/fr/abc/vocabulary/un-projet.mp3")).toBe(
      `${STORAGE_BASE}/content/videos/fr/abc/vocabulary/un-projet.mp3`,
    );
  });

  it("keeps full URLs as-is and returns null for an empty path", () => {
    expect(toContentFileUrl("https://cdn.test/a.mp3")).toBe("https://cdn.test/a.mp3");
    expect(toContentFileUrl(null)).toBeNull();
  });
});

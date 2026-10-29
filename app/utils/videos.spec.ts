/**
 * @file Unit tests for the video utils.
 *
 * Covers:
 * - VIDEO_CATEGORIES / VIDEO_CATEGORY_IDS: orderId order, Font Awesome icons
 * - toVideoCategory: case/separator-insensitive match, null for empty or unknown
 * - toSpeechRate / toSubtitlesKind: database values → display kinds
 * - isNewVideo: NEW_VIDEO_DAYS window, missing / invalid / future dates
 * - groupVideosByCategory: category order, empty and unknown categories left out
 * - pickFeaturedVideo: is_featured first, then most recent, missing dates, empty list
 * - formatVideoDuration / formatVideoMinutes: formats and invalid input
 * - buildVideoMetaItems: order, labels, unknown facts skipped
 * - groupVideosByChannel: most videos first, then name, unknown channel last, avatar
 * - buildVideoPageContent: featured not repeated in sections; a selected
 *   category is grouped by channel instead
 */
import { videoInfo } from "~~/tests/fixtures/video";
import {
  buildVideoMetaItems,
  buildVideoPageContent,
  formatVideoDuration,
  formatVideoMinutes,
  groupVideosByCategory,
  groupVideosByChannel,
  isNewVideo,
  NEW_VIDEO_DAYS,
  pickFeaturedVideo,
  toSpeechRate,
  toSubtitlesKind,
  toVideoCategory,
  VIDEO_CATEGORIES,
  VIDEO_CATEGORY_IDS,
} from "./videos";

describe("VIDEO_CATEGORIES", () => {
  it("lists the category ids in orderId order", () => {
    expect(VIDEO_CATEGORY_IDS).toEqual([
      "SlowFrench",
      "MovieClips",
      "MovieScenes",
      "Vlogs",
      "History",
      "Interviews",
      "Music",
    ]);
  });

  it.each(VIDEO_CATEGORY_IDS)("gives %s a Font Awesome icon", (category) => {
    expect(VIDEO_CATEGORIES[category].icon).toMatch(/^fa-(solid|regular) fa-[a-z-]+$/);
  });
});

describe("toVideoCategory", () => {
  it.each([
    ["SlowFrench", "SlowFrench"],
    ["slowfrench", "SlowFrench"],
    ["Slow French", "SlowFrench"],
    [" movie clips ", "MovieClips"],
    ["slow_french", "SlowFrench"],
    ["movie-clips", "MovieClips"],
  ])("resolves %p to %p", (value, expected) => {
    expect(toVideoCategory(value)).toBe(expected);
  });

  it.each([null, "", "   ", "Cooking"])("returns null for %p", (value) => {
    expect(toVideoCategory(value)).toBeNull();
  });
});

describe("toSpeechRate", () => {
  it.each([
    ["slow", "slow"],
    ["Normal", "normal"],
    ["FAST", "fast"],
  ])("resolves %p to %p", (value, expected) => {
    expect(toSpeechRate(value)).toBe(expected);
  });

  it.each([null, "", "medium"])("returns null for %p", (value) => {
    expect(toSpeechRate(value)).toBeNull();
  });
});

describe("toSubtitlesKind", () => {
  it("returns null when the video has no captions", () => {
    expect(toSubtitlesKind(false, "manual")).toBeNull();
  });

  it.each(["auto", "ASR", "auto_generated"])("treats %p as automatic captions", (type) => {
    expect(toSubtitlesKind(true, type)).toBe("auto");
  });

  it.each(["manual", "standard", null])("treats %p as French subtitles", (type) => {
    expect(toSubtitlesKind(true, type)).toBe("native");
  });
});

describe("isNewVideo", () => {
  const NOW = new Date("2026-10-19T12:00:00Z");
  const daysAgo = (days: number) => new Date(NOW.getTime() - days * 86_400_000).toISOString();

  it("is new within NEW_VIDEO_DAYS days", () => {
    expect(isNewVideo(daysAgo(NEW_VIDEO_DAYS), NOW)).toBe(true);
  });

  it("is not new after NEW_VIDEO_DAYS days", () => {
    expect(isNewVideo(daysAgo(NEW_VIDEO_DAYS + 1), NOW)).toBe(false);
  });

  it.each([null, "not a date", daysAgo(-1)])("is not new for %p", (publishedAt) => {
    expect(isNewVideo(publishedAt, NOW)).toBe(false);
  });

  it("defaults to the current date", () => {
    expect(isNewVideo(new Date().toISOString())).toBe(true);
  });
});

describe("groupVideosByCategory", () => {
  it("groups in category order, keeping the video order inside each group", () => {
    const vlog = videoInfo({ id: 1, category: "Vlogs" });
    const slow1 = videoInfo({ id: 2, category: "SlowFrench" });
    const slow2 = videoInfo({ id: 3, category: "SlowFrench" });

    expect(groupVideosByCategory([vlog, slow1, slow2])).toEqual([
      { category: "SlowFrench", videos: [slow1, slow2] },
      { category: "Vlogs", videos: [vlog] },
    ]);
  });

  it("leaves out videos without a category", () => {
    expect(groupVideosByCategory([videoInfo({ category: null })])).toEqual([]);
  });
});

describe("pickFeaturedVideo", () => {
  it("prefers the videos marked as featured", () => {
    const featured = videoInfo({ id: 1, isFeatured: true, publishedAt: "2026-01-01" });
    const newer = videoInfo({ id: 2, publishedAt: "2026-03-01" });

    expect(pickFeaturedVideo([featured, newer])).toBe(featured);
  });

  it("picks the most recently published video", () => {
    const older = videoInfo({ id: 1, publishedAt: "2026-01-01" });
    const newer = videoInfo({ id: 2, publishedAt: "2026-03-01" });

    expect(pickFeaturedVideo([older, newer])).toBe(newer);
  });

  it("prefers a dated video over undated ones", () => {
    const undated = videoInfo({ id: 1 });
    const dated = videoInfo({ id: 2, publishedAt: "2026-01-01" });

    expect(pickFeaturedVideo([undated, dated])).toBe(dated);
    expect(pickFeaturedVideo([dated, undated])).toBe(dated);
  });

  it("returns the first video when none is dated", () => {
    const first = videoInfo({ id: 1 });

    expect(pickFeaturedVideo([first, videoInfo({ id: 2 })])).toBe(first);
  });

  it("returns null for an empty list", () => {
    expect(pickFeaturedVideo([])).toBeNull();
  });
});

describe("formatVideoDuration", () => {
  it.each([
    [0, "0:00"],
    [522, "8:42"],
    [860.9, "14:20"],
    [3725, "1:02:05"],
  ])("formats %p seconds as %p", (seconds, expected) => {
    expect(formatVideoDuration(seconds)).toBe(expected);
  });

  it.each([null, undefined, -1, Number.NaN])("returns null for %p", (seconds) => {
    expect(formatVideoDuration(seconds)).toBeNull();
  });
});

describe("formatVideoMinutes", () => {
  it.each([
    [860, "14 min"],
    [20, "1 min"],
  ])("formats %p seconds as %p", (seconds, expected) => {
    expect(formatVideoMinutes(seconds)).toBe(expected);
  });

  it.each([null, -5, Number.POSITIVE_INFINITY])("returns null for %p", (seconds) => {
    expect(formatVideoMinutes(seconds)).toBeNull();
  });
});

describe("buildVideoMetaItems", () => {
  it("lists length, subtitles and speech rate in that order", () => {
    const items = buildVideoMetaItems("native", "slow", 860);

    expect(items.map((item) => item.label)).toEqual(["14 min", "FR subtitles", "Slow"]);
  });

  it("skips the unknown facts", () => {
    expect(buildVideoMetaItems(null, "fast")).toEqual([
      { id: "speechRate", icon: "fa-solid fa-person-walking", label: "Fast" },
    ]);
    expect(buildVideoMetaItems(null, null, null)).toEqual([]);
  });
});

describe("buildVideoPageContent", () => {
  const slow = videoInfo({ id: 1, category: "SlowFrench", publishedAt: "2026-02-01" });
  const vlog = videoInfo({ id: 2, category: "Vlogs", publishedAt: "2026-03-01" });
  const vlog2 = videoInfo({ id: 3, category: "Vlogs", publishedAt: "2026-01-01" });

  it("features the latest video and does not repeat it in its section", () => {
    const content = buildVideoPageContent([slow, vlog, vlog2], null);

    expect(content.featured).toBe(vlog);
    expect(content.sections).toEqual([
      { category: "SlowFrench", videos: [slow] },
      { category: "Vlogs", videos: [vlog2] },
    ]);
  });

  it("has no channel sections when no category is selected", () => {
    expect(buildVideoPageContent([slow, vlog, vlog2], null).channels).toEqual([]);
  });

  it("groups the selected category by channel, with no featured video", () => {
    const content = buildVideoPageContent([slow, vlog, vlog2], "Vlogs");

    expect(content.featured).toBeNull();
    expect(content.sections).toEqual([]);
    expect(content.channels).toEqual([
      { channel: null, avatarUrl: null, videos: [vlog, vlog2] },
    ]);
  });

  it("is empty when there are no videos", () => {
    expect(buildVideoPageContent([], null)).toEqual({
      featured: null,
      sections: [],
      channels: [],
    });
  });
});

describe("groupVideosByChannel", () => {
  it("puts the channels with the most videos first, keeping the video order", () => {
    const a1 = videoInfo({ id: 1, channel: "A" });
    const b1 = videoInfo({ id: 2, channel: "B" });
    const b2 = videoInfo({ id: 3, channel: "B" });

    expect(groupVideosByChannel([a1, b1, b2]).map((s) => s.videos)).toEqual([[b1, b2], [a1]]);
  });

  it("orders channels with as many videos by name", () => {
    const zed = videoInfo({ id: 1, channel: "Zed" });
    const alpha = videoInfo({ id: 2, channel: "Alpha" });

    expect(groupVideosByChannel([zed, alpha]).map((s) => s.channel)).toEqual(["Alpha", "Zed"]);
  });

  it("puts the videos with an unknown channel last", () => {
    const unknown1 = videoInfo({ id: 1, channel: null });
    const unknown2 = videoInfo({ id: 2, channel: null });
    const known = videoInfo({ id: 3, channel: "A" });

    expect(groupVideosByChannel([unknown1, unknown2, known]).map((s) => s.channel)).toEqual([
      "A",
      null,
    ]);
  });

  it("takes the avatar from the first video of the channel that has one", () => {
    const noAvatar = videoInfo({ id: 1, channel: "A" });
    const withAvatar = videoInfo({ id: 2, channel: "A", channelAvatarUrl: "a.jpg" });

    expect(groupVideosByChannel([noAvatar, withAvatar])[0]?.avatarUrl).toBe("a.jpg");
  });

  it("is empty when there are no videos", () => {
    expect(groupVideosByChannel([])).toEqual([]);
  });
});

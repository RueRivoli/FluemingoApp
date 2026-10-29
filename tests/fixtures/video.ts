import type { VideoInfo } from "~/types/video";

/** Builds a VideoInfo with neutral defaults; override what the test needs. */
export function videoInfo(overrides: Partial<VideoInfo> = {}): VideoInfo {
  return {
    id: 1,
    youtubeId: "dQw4w9WgXcQ",
    title: "Ma routine du matin, en français lent",
    description: null,
    channel: null,
    channelAvatarUrl: null,
    thumbnailUrl: null,
    level: null,
    isNew: false,
    isFeatured: false,
    category: "SlowFrench",
    duration: null,
    subtitles: null,
    speechRate: null,
    publishedAt: null,
    ...overrides,
  };
}

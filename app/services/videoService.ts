import { useSupabase } from "~/composables/useSupabase";
import { toContentImageUrl } from "~/services/contentStorage";
import { useUserStore } from "~/stores/user";
import type { VideoDetail, VideoInfo, VideoRow } from "~/types/video";
import { toLevel } from "~/utils/articles";
import { LEVELS, type Level } from "~/utils/constants";
import type { TargetLanguage } from "~/utils/languages";
import { buildSubtitleCues, hasTranscriptUnits } from "~/utils/subtitles";
import {
  isNewVideo,
  toSpeechRate,
  toSubtitlesKind,
  toVideoCategory,
} from "~/utils/videos";
import { VideoCategory } from "../utils/videos";

// Data access for the <language>_videos tables. Throws the Supabase error on
// failure: callers decide how to surface it.

/**
 * Video table of each target language. Only French has one for now, so this
 * is not a languageTable() kind: en_videos / es_videos do not exist.
 */
const VIDEO_TABLES: Partial<Record<TargetLanguage, "fr_videos">> = {
  fr: "fr_videos",
};

/**
 * Video table of the user's target language, once the profile is loaded.
 * @returns The table name, or null when that language has no videos
 */
async function videoTable(): Promise<"fr_videos" | null> {
  const userStore = useUserStore();
  await userStore.waitForProfile();
  return VIDEO_TABLES[userStore.contentLanguage] ?? null;
}

/**
 * Columns a video card needs. The list never selects `content` (the full
 * transcript JSON, heavy): only the single-video query loads it.
 * A string literal so supabase-js types the selected rows from it.
 */
const VIDEO_CARD_COLUMNS =
  "id, youtube_id, title, description, channel_title, channel_avatar_url, thumbnail_url, level, published_at, is_featured, category, theme_1, theme_2, duration_seconds, has_captions, caption_type, speech_rate";

/** The part of a <language>_videos row that VideoInfo is built from. */
type VideoCardRow = Pick<
  VideoRow,
  | "id"
  | "youtube_id"
  | "title"
  | "description"
  | "channel_title"
  | "channel_avatar_url"
  | "thumbnail_url"
  | "level"
  | "published_at"
  | "is_featured"
  | "category"
  | "theme_1"
  | "theme_2"
  | "duration_seconds"
  | "has_captions"
  | "caption_type"
  | "speech_rate"
>;

/** Maps a <language>_videos row to the VideoInfo the app displays. */
function toVideoInfo(row: VideoCardRow): VideoInfo {
  return {
    id: row.id,
    youtubeId: row.youtube_id,
    title: row.title,
    description: row.description,
    channel: row.channel_title || null,
    // Storage path filled by the sync-channel-avatars Edge Function.
    channelAvatarUrl: toContentImageUrl(row.channel_avatar_url),
    thumbnailUrl: toContentImageUrl(row.thumbnail_url),
    level: toLevel(row.level),
    isNew: isNewVideo(row.published_at),
    isFeatured: row.is_featured,
    category: toVideoCategory(row.category),
    theme1: row.theme_1,
    theme2: row.theme_2,
    duration: row.duration_seconds,
    subtitles: toSubtitlesKind(row.has_captions, row.caption_type),
    speechRate: toSpeechRate(row.speech_rate),
    publishedAt: row.published_at,
  };
}

/**
 * Loads the videos of the user's target language, optionally of a single
 * CEFR level, most recent first.
 * @param level - Only return videos of this level; every level when null or "All"
 * @returns The videos; an empty array when there are none or the language has no video table.
 */
export async function getVideos(
  level: Level | null = null,
): Promise<VideoInfo[]> {
  const table = await videoTable();
  if (!table) return [];

  let query = useSupabase().from(table).select(VIDEO_CARD_COLUMNS);
  // No filter for null or "All" (LEVELS[0]).
  if (level && level !== LEVELS[0]) query = query.eq("level", level);

  const { data, error } = await query.order("published_at", {
    ascending: false,
  });
  if (error) throw error;
  return data.map(toVideoInfo);
}

/**
 * Loads one video of the user's target language, with its subtitles.
 * @param id - Id of the video in its <language>_videos table
 * @returns The video, or null when it does not exist or the language has no video table
 */
export async function getVideo(id: number): Promise<VideoDetail | null> {
  const table = await videoTable();
  if (!table) return null;

  const { data, error } = await useSupabase()
    .from(table)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  // Translations in the user's native language, English otherwise.
  const { nativeLanguage } = useUserStore();
  return {
    ...toVideoInfo(data),
    subtitles: buildSubtitleCues(data.content, nativeLanguage),
    hasUnits: hasTranscriptUnits(data.content),
  };
}

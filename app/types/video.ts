import type { Tables } from "~~/shared/types/database";
import type { Level } from "~/utils/constants";
import type { ThemeId } from "~/utils/themes";

import type { SpeechRate, SubtitlesKind, VideoCategory } from "~/utils/videos";

/** Row of a <language>_videos table (only fr_videos exists for now). */
export type VideoRow = Tables<"fr_videos">;

/** A video, in the shape the app displays. */
export interface VideoInfo {
  id: number;
  /** YouTube video id, to embed the player */
  youtubeId: string;
  title: string;
  description: string | null;
  /** Name of the YouTube channel; null when unknown */
  channel: string | null;
  /** Avatar of the channel; a neutral circle is shown when missing */
  channelAvatarUrl: string | null;
  /** Thumbnail URL; a gradient placeholder is shown when missing */
  thumbnailUrl: string | null;
  level: Level | null;
  /** Published in the last NEW_VIDEO_DAYS days: shows the NEW badge */
  isNew: boolean;
  /** Picked by the team for "Featured this week" */
  isFeatured: boolean;
  /** Category from the category column; null when unknown */
  category: VideoCategory | null;
  theme1: ThemeId;
  theme2: ThemeId;
  /** Length in seconds; null when unknown */
  duration: number | null;
  subtitles: SubtitlesKind | null;
  speechRate: SpeechRate | null;
  publishedAt: string | null;
}

/** One subtitle line of the video page: a sentence of the transcript (fr_videos.content). */
export interface SubtitleCue {
  /** Start of the sentence in the video, in seconds */
  start: number;
  /** End of the sentence, in seconds */
  end: number;
  /** French sentence */
  text: string;
  /** Translation of the sentence; null when the transcript has none */
  translation: string | null;
  /**
   * The sentence cut into pieces, in order: joined, they give back `text`.
   * Words of the transcript carry their definition; spaces, punctuation and
   * untranslated words are plain text.
   */
  segments: SubtitleSegment[];
}

/**
 * How the subtitles can be clicked:
 * - contextual: the units of the transcript (words or expressions, with their
 *   meaning in this sentence)
 * - words: every single word, translated on its own
 * - standard: plain text, nothing to click but the line
 */
export const SUBTITLE_MODES = ["contextual", "words", "standard"] as const;

export type SubtitleMode = (typeof SUBTITLE_MODES)[number];

/** A piece of a subtitle sentence: a word to look up, or plain text. */
export interface SubtitleSegment {
  text: string;
  /** What the pop-up shows when the piece is clicked; null for plain text */
  word: WordDefinition | null;
}

/** A word or expression of the transcript (a "unit" of fr_videos.content). */
export interface WordDefinition {
  /** As written in the sentence, e.g. "les amis" */
  text: string;
  /** Base form: infinitive of a verb, singular of a noun ("ami"); null when none */
  basis: string | null;
  /** Grammatical tag, e.g. "nm", "v", "pron pers"; null when none */
  type: string | null;
  /** Translation in the user's language */
  translation: string | null;
  /** Explanation in the user's language (proper names, idioms…) */
  note: string | null;
  isProperName: boolean;
}

/** A video with what its own page needs on top of the card data. */
export interface VideoDetail extends VideoInfo {
  /** Sentences of the transcript, in order; empty until the video is transcribed */
  subtitles: SubtitleCue[];
  /** The transcript is cut into units (paragraphs > sentences > units): the contextual mode is offered */
  hasUnits: boolean;
}

/** The videos of one category, as shown in one section of the Videos page. */
export interface VideoCategorySection {
  category: VideoCategory;
  videos: VideoInfo[];
}

/** The videos of one YouTube channel, as shown once a category is selected. */
export interface VideoChannelSection {
  /** Channel name; null groups the videos whose channel is unknown */
  channel: string | null;
  /** Avatar of the channel, taken from its first video that has one */
  avatarUrl: string | null;
  videos: VideoInfo[];
}

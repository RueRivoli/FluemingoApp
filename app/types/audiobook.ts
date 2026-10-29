import type { AudiobookCategory } from "~/utils/audiobooks";
import type { Level } from "~/utils/constants";
import type { Tables } from "~~/shared/types/database";
import type { ArticleCardTheme } from "~/types/theme";

export type Content = Tables<"fr_content" | "en_content" | "es_content">;

/** An audiobook, in the shape the app displays. */
export interface AudiobookInfo {
  id: number;
  title: string;
  description?: string | null;
  descriptionDe?: string | null;
  descriptionEn?: string | null;
  descriptionEs?: string | null;
  descriptionIt?: string | null;
  descriptionJa?: string | null;
  descriptionNl?: string | null;
  descriptionPt?: string | null;
  descriptionFr?: string | null;
  imageUrl: string | null;
  publishedAt: string | null;
  level: Level | null;
  themes: ArticleCardTheme[];
  accent: string | null;
  author: string | null;
  /** Recently added: shows the NEW badge */
  isNew: boolean;
  /** Book category from category_1 (e.g. "Novel"); null when empty */
  category: string | null;
}

/** Audiobooks grouped by lowercased category: { novel: [...], biography: [...] }. */
export type AudiobooksByCategory = Record<string, AudiobookInfo[]>;


/** Row of a <language>_chapters table (fr_chapters, en_chapters…). */
export type Chapter = Tables<"fr_chapters" | "en_chapters" | "es_chapters">;

/** One chapter of an audiobook, in the shape the app displays. */
export interface AudiobookChapter {
  id: number;
  /** Chapter title, in the learned language */
  title: string;
  /** Title in the user's native language; null when missing */
  translatedTitle: string | null;
  /** Length of the chapter's audio, in seconds; null when unknown */
  duration: number | null;
}

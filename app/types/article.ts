import type { AudiobookCategory } from "~/utils/audiobooks";
import type { Level } from "~/utils/constants";
import type { Tables } from "~~/shared/types/database";
import type { ArticleCardTheme } from "~/types/themes";
export type Content = Tables<"fr_content" | "en_content" | "es_content">;

/** A news article, in the shape the app displays. */
export interface NewsArticleInfo {
  id: number;
  title: string;
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
  /** category_1..3, without the empty ones */
  themes: ArticleCardTheme[];
  accent: string | null;
  author: string | null;
}

/** Category chip shown on its own row of an ArticleCard. */
export interface ArticleCardCategory {
  /** Category id, one of AUDIOBOOK_CATEGORY_IDS */
  id: AudiobookCategory;
  /** Font Awesome classes of its icon */
  icon: string;
}

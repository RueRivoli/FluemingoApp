import { useSupabase } from "~/composables/useSupabase";
import { languageTable } from "~/services/languageTables";
import type { ArticleCardTheme } from "~/types/article";
import type { Level } from "~/utils/constants";
import { LEVELS } from "~/utils/constants";
import { toLevel, NEWS_CONTENT_TYPE } from "~/utils/articles";
import { toThemeChip, type ThemeId } from "~/utils/themes";

import type { Content, NewsArticleInfo } from "~/types/article";

// Data access for the <language>_content tables (fr_content, en_content…),
// picked from the user's target language by languageTable(). Every function
// throws the Supabase error on failure: callers decide how to surface it.

// Storage bucket holding the files img_url points to (e.g. "articles/fr/rap/image.png").
const CONTENT_BUCKET = "content";
const ABSOLUTE_URL = /^https?:\/\//;

/** Turns an img_url storage path into a public URL; full URLs are kept as-is. */
function toImageUrl(path: string | null): string | null {
  if (!path) return null;
  if (ABSOLUTE_URL.test(path)) return path;
  return useSupabase().storage.from(CONTENT_BUCKET).getPublicUrl(path).data
    .publicUrl;
}

/** Turns the category_1..3 columns into theme chips, skipping null/undefined ones. */
function toThemes(
  categories: (string | null | undefined)[],
): ArticleCardTheme[] {
  return categories
    .filter((category): category is string => category != null)
    .map(toThemeChip);
}

/** Maps a <language>_content row to the NewsArticleInfo the app displays. */
function toNewsArticleInfo(row: Content): NewsArticleInfo {
  return {
    id: row.id,
    title: row.title ?? "",
    description: row.description,
    descriptionDe: row.description_de,
    descriptionEn: row.description_en,
    descriptionFr: row.description_fr,
    descriptionEs: row.description_es,
    descriptionIt: row.description_it,
    descriptionJa: row.description_ja,
    descriptionNl: row.description_nl,
    descriptionPt: row.description_pt,
    imageUrl: toImageUrl(row.img_url),
    publishedAt: row.published_at,
    level: toLevel(row.level),
    themes: toThemes([row.category_1, row.category_2, row.category_3]),
    accent: row.accent,
    author: row.author,
  };
}

function themesFilter(themes: readonly ThemeId[]): string {
  return themes
    .flatMap((theme) => [
      `category_2.ilike.${theme}`,
      `category_3.ilike.${theme}`,
      `category_4.ilike.${theme}`,
    ])
    .join(",");
}
/**
 * Loads the news articles, optionally of a single CEFR level.
 * @param level - Only return articles of this level; every level when null
 * @returns The news articles, empty when there are none.
 */
export async function getNewsArticles(
  level: Level = LEVELS[0],
  themes: readonly ThemeId[] = [],
): Promise<NewsArticleInfo[]> {
  let query = useSupabase()
    .from(await languageTable("content"))
    .select("*")
    .eq("content_type", NEWS_CONTENT_TYPE);
  // No filter "All" (LEVELS[0]).
  if (level !== LEVELS[0]) query = query.eq("level", level);
  if (themes.length > 0) query = query.or(themesFilter(themes));

  const { data, error } = await query;
  if (error) throw error;
  return data.map(toNewsArticleInfo);
}

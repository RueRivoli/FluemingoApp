import { useSupabase } from "~/composables/useSupabase";
import { languageTable } from "~/services/languageTables";
import type { Content } from "~/types/article";
import { useUserStore } from "~/stores/user";
import type {
  AudiobookChapter,
  AudiobookInfo,
  AudiobooksByCategory,
  Chapter,
} from "~/types/audiobook";
import type { ArticleCardTheme } from "~/types/theme";
import { toLevel } from "~/utils/articles";
import {
  AUDIOBOOKS_CONTENT_TYPE,
  groupAudiobooksByCategory,
} from "~/utils/audiobooks";
import { LEVELS, type Level } from "~/utils/constants";
import { toThemeChip, type ThemeId } from "~/utils/themes";

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

/**
 * Maps a <language>_content row to the AudiobookInfo the app displays.
 * Each table lacks the description column of its own language (fr_content has
 * no description_fr), hence the `in` checks on en/es/fr.
 */
function toAudiobookInfo(row: Content): AudiobookInfo {
  return {
    id: row.id,
    title: row.title ?? "",
    description: row.description,
    descriptionDe: row.description_de,
    descriptionEn: "description_en" in row ? row.description_en : null,
    descriptionEs: "description_es" in row ? row.description_es : null,
    descriptionFr: "description_fr" in row ? row.description_fr : null,
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
    isNew: row.is_new ?? false,
    category: row.category_1?.trim() || null,
  };
}

/**
 * PostgREST `or` filter: category_2 or category_3 is one of the themes.
 * ilike without wildcard = case-insensitive equality, as the database casing
 * varies ("Sport", "sport"); theme ids hold no character PostgREST would need escaped.
 */
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
 * Loads the audiobooks, optionally of a single CEFR level and of some themes,
 * grouped by category (category_1): { novel: [...], biography: [...] }.
 * @param level - Only return audiobooks of this level; every level when null or "All"
 * @param themes - Only return audiobooks whose category_2 or category_3 is one of
 *   these themes; every theme when empty
 * @returns The groups, an empty object when there are no audiobooks.
 */
export async function getAudiobooks(
  level: Level | null = null,
  themes: readonly ThemeId[] = [],
): Promise<AudiobooksByCategory> {
  let query = useSupabase()
    .from(await languageTable("content"))
    .select("*")
    .eq("content_type", AUDIOBOOKS_CONTENT_TYPE);
  // No filter for null or "All" (LEVELS[0]).
  if (level && level !== LEVELS[0]) query = query.eq("level", level);
  if (themes.length > 0) query = query.or(themesFilter(themes));

  const { data, error } = await query;
  if (error) throw error;
  return groupAudiobooksByCategory(data.map(toAudiobookInfo));
}

/**
 * Reads the chapter title in the user's native language (title_en, title_de…).
 * @returns The title, or null when the column is missing or empty
 */
function translatedTitle(row: Chapter, language: string | null): string | null {
  if (!language) return null;
  const value = (row as Record<string, unknown>)[`title_${language}`];
  return typeof value === "string" && value !== "" ? value : null;
}

/**
 * Loads the chapters of an audiobook, in reading order (order_id), with their
 * title translated in the user's native language.
 * @param audiobookId - Id of the audiobook (long_format_id of its chapters)
 * @returns The chapters; an empty array when the audiobook has none.
 */
export async function getAudiobookChapters(
  audiobookId: number,
): Promise<AudiobookChapter[]> {
  const { data, error } = await useSupabase()
    .from(await languageTable("chapters"))
    .select("*")
    .eq("long_format_id", audiobookId)
    .order("order_id");
  if (error) throw error;
  const { nativeLanguage } = useUserStore();
  return (data as Chapter[]).map((row) => ({
    id: row.id,
    title: row.title ?? "",
    translatedTitle: translatedTitle(row, nativeLanguage),
    duration: row.duration,
  }));
}

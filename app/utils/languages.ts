/** Languages a user can learn; content tables are split by these codes. */
export const TARGET_LANGUAGES = ["fr", "en", "es"] as const;

export type TargetLanguage = (typeof TARGET_LANGUAGES)[number];

/** Used when the profile has no (or an unknown) target_language. */
export const DEFAULT_TARGET_LANGUAGE: TargetLanguage = "fr";

/** Table families that exist once per language: fr_content, en_content, es_content… */
export const LANGUAGE_TABLE_KINDS = [
  "content",
  "chapters",
  "flashcards",
  "progress",
  "quiz_models",
  "quiz_results",
  "vocabulary",
] as const;

export type LanguageTableKind = (typeof LANGUAGE_TABLE_KINDS)[number];

/** Name of a per-language table, e.g. LanguageTable<"content"> = "fr_content" | "en_content" | "es_content". */
export type LanguageTable<K extends LanguageTableKind> = `${TargetLanguage}_${K}`;

/**
 * Narrows a raw target_language from the profile to a supported language.
 * Case-insensitive, so "EN" and "en" both match.
 * @returns The language, or null when it is empty or not supported
 */
export function toTargetLanguage(value: string | null): TargetLanguage | null {
  const lower = value?.toLowerCase();
  return TARGET_LANGUAGES.find((language) => language === lower) ?? null;
}

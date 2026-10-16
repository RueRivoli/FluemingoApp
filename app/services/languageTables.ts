import { useUserStore } from "~/stores/user";
import type { LanguageTable, LanguageTableKind } from "~/utils/languages";

/**
 * Name of the table of the given kind in the user's target language, e.g.
 * languageTable("content") → "en_content" for someone learning English.
 * Waits for the profile first, so a query is never sent to the wrong table.
 *
 * The only place that resolves the language: services call this instead of
 * taking a language parameter.
 */
export async function languageTable<K extends LanguageTableKind>(
  kind: K,
): Promise<LanguageTable<K>> {
  const userStore = useUserStore();
  await userStore.waitForProfile();
  return `${userStore.contentLanguage}_${kind}`;
}

export async function language<K extends LanguageTableKind>(
  kind: K,
): Promise<Language> {
  const userStore = useUserStore();
  await userStore.waitForProfile();
  return `${userStore.contentLanguage}_${kind}`;
}
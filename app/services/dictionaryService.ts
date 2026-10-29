import { useSupabase } from "~/composables/useSupabase";
import type { DictionaryTranslation } from "~/types/dictionary";

// Dictionary lookups go through a Supabase Edge Function: the site is static,
// and the Azure Translator key must stay server-side.
const DICTIONARY_LOOKUP_FUNCTION = "dictionary-lookup";

interface DictionaryLookupResponse {
  translations: DictionaryTranslation[];
}

/**
 * Looks a word up in the bilingual dictionary.
 * @param text - The word, ideally its base form ("ami" rather than "amis")
 * @param from - Language of the word, e.g. "fr"
 * @param to - Language of the translations, e.g. "en"
 * @returns The translations, most frequent first; empty when the word is unknown
 */
export async function lookupWord(
  text: string,
  from: string,
  to: string,
): Promise<DictionaryTranslation[]> {
  const { data, error } = await useSupabase().functions.invoke<DictionaryLookupResponse>(
    DICTIONARY_LOOKUP_FUNCTION,
    { body: { text, from, to } },
  );
  if (error) throw error;
  return data?.translations ?? [];
}

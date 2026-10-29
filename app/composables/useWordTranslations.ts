import { ref, type Ref } from "vue";
import * as dictionaryService from "~/services/dictionaryService";
import { useUserStore } from "~/stores/user";
import type { DictionaryTranslation } from "~/types/dictionary";
import type { WordDefinition } from "~/types/video";

export interface UseWordTranslationsReturn {
  /** Translations of the last word looked up, most frequent first */
  translations: Ref<DictionaryTranslation[]>;
  isLoading: Ref<boolean>;
  /** The last lookup failed (network, rate limit…) */
  hasError: Ref<boolean>;
  /** Looks a word up; ignored for proper names or without a native language */
  lookup: (word: WordDefinition, options?: LookupOptions) => Promise<void>;
}

export interface LookupOptions {
  /** Asks the dictionary again even if the word is cached ("Retranslate") */
  force?: boolean;
}

/**
 * Translations of a clicked word in the user's native language, from the
 * dictionary (Azure Translator). Results are cached: going back to a word
 * does not call the dictionary again.
 */
export function useWordTranslations(): UseWordTranslationsReturn {
  const userStore = useUserStore();

  const translations = ref<DictionaryTranslation[]>([]);
  const isLoading = ref(false);
  const hasError = ref(false);
  const cache = new Map<string, DictionaryTranslation[]>();
  // Only the answer for the last clicked word is shown, whatever answers first.
  let lastKey = "";

  async function lookup(word: WordDefinition, { force = false }: LookupOptions = {}) {
    const from = userStore.contentLanguage;
    const to = userStore.nativeLanguage;
    // The base form is what dictionaries list: "ami" rather than "les amis".
    const term = (word.basis ?? word.text).trim();

    translations.value = [];
    hasError.value = false;
    lastKey = `${from}:${to}:${term.toLowerCase()}`;
    if (word.isProperName || !to || to === from || !term) {
      isLoading.value = false;
      return;
    }

    const key = lastKey;
    const cached = force ? undefined : cache.get(key);
    if (cached) {
      translations.value = cached;
      isLoading.value = false;
      return;
    }

    isLoading.value = true;
    try {
      const result = await dictionaryService.lookupWord(term, from, to);
      cache.set(key, result);
      if (key === lastKey) translations.value = result;
    } catch {
      // The pop-up still shows the transcript's own translation.
      if (key === lastKey) hasError.value = true;
    } finally {
      if (key === lastKey) isLoading.value = false;
    }
  }

  return { translations, isLoading, hasError, lookup };
}

/** One translation of a word, from the dictionary-lookup Edge Function (Azure Translator). */
export interface DictionaryTranslation {
  /** The word in the user's language, e.g. "house" */
  text: string;
  /** e.g. "noun", "verb"; null when the dictionary does not know */
  partOfSpeech: string | null;
  /** Share of the uses of the word that take this meaning, 0 to 1 */
  confidence: number;
}

import { useSupabase } from "~/composables/useSupabase";
import { languageTable } from "~/services/languageTables";
import { flashcardToVocabularyItem } from "~/services/flashcardService";
import { useUserStore } from "~/stores/user";
import { NEWS_CONTENT_TYPE } from "~/utils/articles";
import { VIDEOS_CONTENT_TYPE } from "~/utils/videos";
import type {
  Flashcard,
  Vocabulary,
  VocabularyItem,
} from "~/types/vocabulary";

// Data access for the <language>_vocabulary and <language>_flashcards tables,
// picked from the user's target language by languageTable(). Every function
// throws the Supabase error on failure: callers decide how to surface it.
const VOCABULARY_TABLE = "vocabulary";
const FLASHCARDS_TABLE = "flashcards";

/** Vocabulary row with the user's flashcard on it (RLS only returns the user's own). */
type VocabularyWithFlashcards = Vocabulary & {
  flashcards: Pick<Flashcard, "id" | "status">[];
};

/**
 * Reads a per-language column such as text_en or example_de.
 * @returns The value, or null when the column is missing or empty
 */
function translatedColumn(
  row: Vocabulary,
  prefix: "text" | "example",
  language: string | null,
): string | null {
  if (!language) return null;
  const value = (row as Record<string, unknown>)[`${prefix}_${language}`];
  return typeof value === "string" ? value : null;
}

/** Maps a vocabulary row (with its flashcard) to the VocabularyItem the app displays. */
function vocabularyToVocabularyItem(
  row: VocabularyWithFlashcards,
  nativeLanguage: string | null,
): VocabularyItem {
  const [flashcard] = row.flashcards;
  return {
    id: row.id,
    text: row.text ?? "",
    type: row.function,
    translation: translatedColumn(row, "text", nativeLanguage),
    audioUrl: row.audio_url,
    exampleSentence: row.example,
    exampleTranslation: translatedColumn(row, "example", nativeLanguage),
    basis: row.basis,
    note: null,
    properName: row.proper_name ?? false,
    flashcardId: flashcard?.id,
    status: flashcard?.status ?? null,
    isAddedByUser: false,
  };
}

/**
 * Loads the vocabulary chosen for a piece of content, translated in the
 * user's native language, with the user's flashcard status on each word.
 * @param referenceId - Id of the content in its own table
 * @param contentType - Kind of content (NEWS_CONTENT_TYPE, VIDEOS_CONTENT_TYPE…)
 * @returns The words; an empty array when the content has none.
 */
async function getContentVocabulary(
  referenceId: number,
  contentType: number,
): Promise<VocabularyItem[]> {
  const vocabularyTable = await languageTable(VOCABULARY_TABLE);
  const flashcardsTable = await languageTable(FLASHCARDS_TABLE);
  const { data, error } = await useSupabase()
    .from(vocabularyTable)
    .select(`*, flashcards:${flashcardsTable} ( id, status )`)
    .eq("reference_id", referenceId)
    .eq("content_type", contentType)
    .order("id");
  if (error) throw error;
  const { nativeLanguage } = useUserStore();
  return (data as unknown as VocabularyWithFlashcards[]).map((row) =>
    vocabularyToVocabularyItem(row, nativeLanguage),
  );
}

/**
 * Loads the vocabulary chosen for an article, translated in the user's native
 * language, with the user's flashcard status on each word.
 * @returns The words; an empty array when the article has none.
 */
export function getMainArticleVocabulary(
  articleId: number,
): Promise<VocabularyItem[]> {
  return getContentVocabulary(articleId, NEWS_CONTENT_TYPE);
}

/**
 * Loads the vocabulary chosen for a video (content_type 3), translated in the
 * user's native language, with the user's flashcard status on each word.
 * @returns The words; an empty array when the video has none.
 */
export function getVideoVocabulary(videoId: number): Promise<VocabularyItem[]> {
  return getContentVocabulary(videoId, VIDEOS_CONTENT_TYPE);
}

/**
 * Loads the words a user added themselves while reading an article: their
 * flashcards on that article that are not linked to a vocabulary row.
 * RLS restricts the flashcards to the signed-in user.
 * @returns The words, oldest first; an empty array when there are none.
 */
export async function getPersonalArticleVocabulary(
  articleId: number,
): Promise<VocabularyItem[]> {
  const { data, error } = await useSupabase()
    .from(await languageTable(FLASHCARDS_TABLE))
    .select("*")
    .eq("content_id", articleId)
    .is("vocabulary_id", null)
    .order("created_at");
  if (error) throw error;
  return (data as Flashcard[]).map(flashcardToVocabularyItem);
}

/**
 * Loads both vocabulary lists of an article in parallel: the words chosen for
 * the article, and the ones the user added while reading it.
 * Throws if either query fails.
 */
export async function getArticleVocabulary(articleId: number): Promise<{
  mainVocabulary: VocabularyItem[];
  personalVocabulary: VocabularyItem[];
}> {
  const [mainVocabulary, personalVocabulary] = await Promise.all([
    getMainArticleVocabulary(articleId),
    getPersonalArticleVocabulary(articleId),
  ]);
  return { mainVocabulary, personalVocabulary };
}

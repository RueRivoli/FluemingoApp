import { useSupabase } from "~/composables/useSupabase";
import { languageTable } from "~/services/languageTables";
import type { Flashcard, VocabularyItem } from "~/types/vocabulary";
import {
  FLASHCARD_STATUSES,
  type FlashcardCounts,
  type FlashcardStatus,
} from "~/utils/flashcardDecks";

// Data access for the <language>_flashcards tables, picked from the user's
// target language by languageTable(). RLS restricts the rows to the signed-in
// user. Every function throws the Supabase error on failure.
const FLASHCARDS_TABLE = "flashcards";

/** Maps a flashcard row to the VocabularyItem the app displays. */
export function flashcardToVocabularyItem(row: Flashcard): VocabularyItem {
  return {
    id: row.id,
    text: row.text ?? "",
    type: row.function,
    translation: row.text_translation,
    audioUrl: row.audio_url,
    exampleSentence: row.example,
    exampleTranslation: row.example_translation,
    basis: row.basis,
    note: null,
    properName: row.proper_name ?? false,
    flashcardId: row.id,
    status: row.status,
    isAddedByUser: row.vocabulary_id === null,
  };
}

/**
 * Counts the user's flashcards in each status (saved, difficult, training,
 * mastered), like the mobile app's deck list.
 * Uses HEAD count requests, so no rows are transferred.
 * @returns The count of every status; 0 for a status with no flashcard.
 */
export async function getFlashcardCounts(): Promise<FlashcardCounts> {
  const table = await languageTable(FLASHCARDS_TABLE);
  const supabase = useSupabase();
  const counts = await Promise.all(
    FLASHCARD_STATUSES.map(async (status): Promise<[FlashcardStatus, number]> => {
      const { count, error } = await supabase
        .from(table)
        .select("*", { count: "exact", head: true })
        .eq("status", status);
      if (error) throw error;
      return [status, count ?? 0];
    }),
  );
  return Object.fromEntries(counts) as FlashcardCounts;
}

/**
 * Loads the user's flashcards in one status (the words of a deck), most
 * recently added first.
 * @returns The words; an empty array when the deck is empty.
 */
export async function getFlashcardsByStatus(
  status: FlashcardStatus,
): Promise<VocabularyItem[]> {
  const { data, error } = await useSupabase()
    .from(await languageTable(FLASHCARDS_TABLE))
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false });
  if (error) throw error;
  return (data as Flashcard[]).map(flashcardToVocabularyItem);
}

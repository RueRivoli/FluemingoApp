import { useSupabase } from "~/composables/useSupabase";
import { languageTable } from "~/services/languageTables";
import {
  FLASHCARD_STATUSES,
  type FlashcardCounts,
  type FlashcardStatus,
} from "~/utils/flashcardDecks";

// Data access for the <language>_flashcards tables, picked from the user's
// target language by languageTable(). RLS restricts the rows to the signed-in
// user. Every function throws the Supabase error on failure.
const FLASHCARDS_TABLE = "flashcards";

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

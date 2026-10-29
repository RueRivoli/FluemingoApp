import { useSupabase } from "~/composables/useSupabase";
import { languageTable } from "~/services/languageTables";
import type { QuizAnswerOption, QuizModel, QuizQuestion } from "~/types/quiz";
import { VIDEOS_CONTENT_TYPE } from "~/utils/videos";

// Data access for the <language>_quiz_models table, picked from the user's
// target language by languageTable(). Throws the Supabase error on failure:
// callers decide how to surface it.
const QUIZ_MODELS_TABLE = "quiz_models";
const ANSWER_COLUMNS = ["answer_1", "answer_2", "answer_3", "answer_4"] as const;

/** The non-empty answers of a row, numbered like their column (answer_3 → 3). */
function toAnswers(row: QuizModel): QuizAnswerOption[] {
  return ANSWER_COLUMNS.flatMap((column, index) => {
    const text = row[column]?.trim();
    return text ? [{ number: index + 1, text }] : [];
  });
}

/**
 * Maps a quiz_models row to the question the app displays.
 * @returns The question, or null when it has no text or its right answer is missing
 */
function toQuizQuestion(row: QuizModel): QuizQuestion | null {
  const question = row.question?.trim();
  const answers = toAnswers(row);
  const hasCorrectAnswer = answers.some(
    (answer) => answer.number === row.correct_answer,
  );
  if (!question || !hasCorrectAnswer) return null;
  return {
    id: row.id,
    question,
    answers,
    correctAnswer: row.correct_answer,
    tip: row.tip?.trim() || null,
  };
}

/**
 * Loads the quiz of a video (quiz_models of type 3), in order.
 * Malformed rows (no question, right answer missing) are left out.
 * @param videoId - Id of the video in its <language>_videos table
 * @returns The questions; an empty array when the video has no quiz.
 */
export async function getVideoQuiz(videoId: number): Promise<QuizQuestion[]> {
  const { data, error } = await useSupabase()
    .from(await languageTable(QUIZ_MODELS_TABLE))
    .select("*")
    .eq("type", VIDEOS_CONTENT_TYPE)
    .eq("reference_id", videoId)
    .order("id");
  if (error) throw error;
  return (data as QuizModel[])
    .map(toQuizQuestion)
    .filter((question): question is QuizQuestion => question !== null);
}

import type { Tables } from "~~/shared/types/database";

/** Row of a <language>_quiz_models table (fr_quiz_models, en_quiz_models…). */
export type QuizModel = Tables<
  "fr_quiz_models" | "en_quiz_models" | "es_quiz_models"
>;

/** One answer of a quiz question. */
export interface QuizAnswerOption {
  /** Position of the answer in the table (answer_1 → 1); correct_answer refers to it */
  number: number;
  text: string;
}

/** A quiz question, in the shape the app displays. */
export interface QuizQuestion {
  id: number;
  question: string;
  /** The answers, in order; empty answer columns are left out */
  answers: QuizAnswerOption[];
  /** Number of the right answer (QuizAnswerOption.number) */
  correctAnswer: number;
  /** Hint shown on demand; null when the question has none */
  tip: string | null;
}

/**
 * How an answer looks:
 * - default: not picked
 * - selected: picked, not checked yet
 * - correct: the right answer, once checked
 * - wrong: the picked answer, once checked, when it is not the right one
 */
export const QUIZ_ANSWER_STATES = ["default", "selected", "correct", "wrong"] as const;

export type QuizAnswerState = (typeof QUIZ_ANSWER_STATES)[number];

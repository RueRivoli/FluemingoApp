import type { QuizAnswerState } from "~/types/quiz";

/**
 * How an answer of the current question looks.
 * Before checking, only the picked answer stands out. Once checked, the right
 * answer is shown as correct and a wrong pick as wrong.
 * @param answer - Number of the answer to style
 * @param selected - Number of the picked answer; null when none
 * @param correct - Number of the right answer
 * @param isChecked - The pick has been checked
 */
export function quizAnswerState(
  answer: number,
  selected: number | null,
  correct: number,
  isChecked: boolean,
): QuizAnswerState {
  if (!isChecked) return answer === selected ? "selected" : "default";
  if (answer === correct) return "correct";
  return answer === selected ? "wrong" : "default";
}

/** Letter shown before an answer: 0 → "A", 1 → "B"… */
export function quizAnswerLetter(index: number): string {
  return String.fromCharCode("A".charCodeAt(0) + index);
}

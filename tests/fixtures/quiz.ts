import type { QuizQuestion } from "~/types/quiz";

/** Builds a QuizQuestion with four answers, the second one right; override what the test needs. */
export function quizQuestion(overrides: Partial<QuizQuestion> = {}): QuizQuestion {
  return {
    id: 1,
    question: "Qu’est-ce que la narratrice commande au café ?",
    answers: [
      { number: 1, text: "Un thé et une tartine" },
      { number: 2, text: "Un croissant et un café crème" },
      { number: 3, text: "Un chocolat chaud" },
      { number: 4, text: "Un jus d’orange" },
    ],
    correctAnswer: 2,
    tip: null,
    ...overrides,
  };
}

/**
 * @file Unit tests for useQuiz.
 *
 * Covers:
 * - Starts on the first question, nothing picked, not finished
 * - select: picks an answer; ignored once checked
 * - check: checks the pick; ignored without a pick
 * - next / previous: move between questions, keep the answers, next after the
 *   last question finishes the quiz; previous does nothing on the first
 * - score: counts the checked right answers only
 * - restart, and a new list of questions starting the quiz over
 * - Empty quiz
 */
import { ref } from "vue";
import { quizQuestion } from "../../tests/fixtures/quiz";
import type { QuizQuestion } from "~/types/quiz";
import { useQuiz } from "./useQuiz";

// Three questions; the right answer is 2 for each (fixture default).
const QUESTIONS = [quizQuestion({ id: 1 }), quizQuestion({ id: 2 }), quizQuestion({ id: 3 })];

function factory(questions: QuizQuestion[] = QUESTIONS) {
  const list = ref<QuizQuestion[]>(questions);
  return { quiz: useQuiz(list), list };
}

/** Picks an answer, checks it and moves on. */
function answer(quiz: ReturnType<typeof useQuiz>, pick: number) {
  quiz.select(pick);
  quiz.check();
  quiz.next();
}

describe("useQuiz", () => {
  describe("start", () => {
    it("shows the first question, nothing picked or checked", () => {
      const { quiz } = factory();

      expect(quiz.currentQuestion.value?.id).toBe(1);
      expect(quiz.selectedAnswer.value).toBeNull();
      expect(quiz.isChecked.value).toBe(false);
      expect(quiz.isFirst.value).toBe(true);
      expect(quiz.isLast.value).toBe(false);
      expect(quiz.isFinished.value).toBe(false);
      expect(quiz.total.value).toBe(3);
    });
  });

  describe("select and check", () => {
    it("picks an answer", () => {
      const { quiz } = factory();

      quiz.select(3);

      expect(quiz.selectedAnswer.value).toBe(3);
    });

    it("checks the pick", () => {
      const { quiz } = factory();
      quiz.select(3);

      quiz.check();

      expect(quiz.isChecked.value).toBe(true);
    });

    it("does not check without a pick", () => {
      const { quiz } = factory();

      quiz.check();

      expect(quiz.isChecked.value).toBe(false);
    });

    it("ignores a new pick once checked", () => {
      const { quiz } = factory();
      quiz.select(3);
      quiz.check();

      quiz.select(2);

      expect(quiz.selectedAnswer.value).toBe(3);
    });
  });

  describe("navigation", () => {
    it("goes to the next question with nothing picked", () => {
      const { quiz } = factory();

      answer(quiz, 2);

      expect(quiz.currentQuestion.value?.id).toBe(2);
      expect(quiz.selectedAnswer.value).toBeNull();
      expect(quiz.isFirst.value).toBe(false);
    });

    it("keeps the answer of a question when coming back to it", () => {
      const { quiz } = factory();
      answer(quiz, 3);

      quiz.previous();

      expect(quiz.selectedAnswer.value).toBe(3);
      expect(quiz.isChecked.value).toBe(true);
    });

    it("does nothing on previous from the first question", () => {
      const { quiz } = factory();

      quiz.previous();

      expect(quiz.currentIndex.value).toBe(0);
    });

    it("finishes the quiz after the last question", () => {
      const { quiz } = factory();
      answer(quiz, 2);
      answer(quiz, 2);

      expect(quiz.isLast.value).toBe(true);
      answer(quiz, 2);

      expect(quiz.isFinished.value).toBe(true);
    });
  });

  describe("score", () => {
    it("counts the checked right answers", () => {
      const { quiz } = factory();

      answer(quiz, 2);
      answer(quiz, 4);
      answer(quiz, 2);

      expect(quiz.score.value).toBe(2);
    });

    it("does not count a right pick that was not checked", () => {
      const { quiz } = factory();

      quiz.select(2);

      expect(quiz.score.value).toBe(0);
    });
  });

  describe("restart", () => {
    it("goes back to the first question with the answers cleared", () => {
      const { quiz } = factory();
      answer(quiz, 2);
      answer(quiz, 2);
      answer(quiz, 2);

      quiz.restart();

      expect(quiz.isFinished.value).toBe(false);
      expect(quiz.currentIndex.value).toBe(0);
      expect(quiz.selectedAnswer.value).toBeNull();
      expect(quiz.score.value).toBe(0);
    });

    it("starts over when the questions change", async () => {
      const { quiz, list } = factory();
      answer(quiz, 2);

      list.value = [quizQuestion({ id: 9 })];
      await Promise.resolve();

      expect(quiz.currentQuestion.value?.id).toBe(9);
      expect(quiz.score.value).toBe(0);
    });
  });

  describe("empty quiz", () => {
    it("has no current question and ignores the actions", () => {
      const { quiz } = factory([]);

      quiz.select(1);
      quiz.check();

      expect(quiz.currentQuestion.value).toBeNull();
      expect(quiz.total.value).toBe(0);
      expect(quiz.selectedAnswer.value).toBeNull();
    });
  });
});

/**
 * @file Unit tests for the quiz utils.
 *
 * Covers:
 * - quizAnswerState: picked / not picked before checking; correct, wrong and
 *   untouched answers once checked
 * - quizAnswerLetter: index → letter
 */
import { quizAnswerLetter, quizAnswerState } from "./quiz";

const CORRECT = 2;

describe("quizAnswerState", () => {
  describe("before checking", () => {
    it("shows the picked answer as selected", () => {
      expect(quizAnswerState(3, 3, CORRECT, false)).toBe("selected");
    });

    it("shows the other answers, the right one included, as default", () => {
      expect(quizAnswerState(CORRECT, 3, CORRECT, false)).toBe("default");
      expect(quizAnswerState(1, null, CORRECT, false)).toBe("default");
    });
  });

  describe("once checked", () => {
    it("shows the right answer as correct, picked or not", () => {
      expect(quizAnswerState(CORRECT, CORRECT, CORRECT, true)).toBe("correct");
      expect(quizAnswerState(CORRECT, 3, CORRECT, true)).toBe("correct");
    });

    it("shows a wrong pick as wrong", () => {
      expect(quizAnswerState(3, 3, CORRECT, true)).toBe("wrong");
    });

    it("leaves the answers that were not picked as default", () => {
      expect(quizAnswerState(4, 3, CORRECT, true)).toBe("default");
    });
  });
});

describe("quizAnswerLetter", () => {
  it.each([
    [0, "A"],
    [1, "B"],
    [3, "D"],
  ])("turns index %i into %s", (index, letter) => {
    expect(quizAnswerLetter(index)).toBe(letter);
  });
});

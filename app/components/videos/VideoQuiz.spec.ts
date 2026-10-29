/**
 * @file Unit tests for VideoQuiz.
 *
 * Covers:
 * - Empty message when the video has no quiz
 * - Header with the number of questions
 * - A full run: pick, check, next… then the score, and "Try again"
 */
import { mount } from "@vue/test-utils";
import { quizQuestion } from "../../../tests/fixtures/quiz";
import type { QuizQuestion } from "~/types/quiz";
import VideoQuiz from "./VideoQuiz.vue";

// Two questions, the right answer is 2 for both (fixture default).
const QUESTIONS = [quizQuestion({ id: 1 }), quizQuestion({ id: 2, question: "Où va-t-elle ensuite ?" })];

function factory(questions: QuizQuestion[] = QUESTIONS) {
  return mount(VideoQuiz, { props: { questions } });
}

const sel = (id: string) => `[data-testid="${id}"]`;

/** Picks the answer at this index, checks it and moves on. */
async function answer(wrapper: ReturnType<typeof factory>, index: number) {
  await wrapper.findAll(sel("quiz-answer"))[index]!.trigger("click");
  await wrapper.get(sel("quiz-navigation-main")).trigger("click");
  await wrapper.get(sel("quiz-navigation-main")).trigger("click");
}

describe("VideoQuiz", () => {
  it("says the quiz is coming soon when there are no questions", () => {
    const wrapper = factory([]);

    expect(wrapper.get(sel("video-quiz-empty")).text()).toBe("The quiz of this video is coming soon.");
    expect(wrapper.find(sel("quiz-question-card")).exists()).toBe(false);
  });

  it("shows the number of questions and the first one", () => {
    const wrapper = factory();

    expect(wrapper.get(sel("video-quiz-subtitle")).text()).toBe("2 comprehension questions");
    expect(wrapper.get(sel("quiz-progress-label")).text()).toBe("Question 1/2");
  });

  it("goes to the next question once the answer is checked", async () => {
    const wrapper = factory();

    await answer(wrapper, 1);

    expect(wrapper.get(sel("quiz-progress-label")).text()).toBe("Question 2/2");
    expect(wrapper.get(sel("quiz-question-text")).text()).toBe("Où va-t-elle ensuite ?");
  });

  it("shows the score after the last question, and starts over on \"Try again\"", async () => {
    const wrapper = factory();
    await answer(wrapper, 1); // right
    await answer(wrapper, 0); // wrong

    expect(wrapper.get(sel("quiz-result-score")).text()).toBe("1 / 2 correct");

    await wrapper.get(sel("quiz-result-restart")).trigger("click");

    expect(wrapper.get(sel("quiz-progress-label")).text()).toBe("Question 1/2");
  });
});

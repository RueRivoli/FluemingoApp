/**
 * @file Unit tests for QuizQuestionCard.
 *
 * Covers:
 * - Rendering of the progress, the question and the lettered answers
 * - Answer states from the pick and the check
 * - Tip: button only when the question has one, shows / hides it, hidden
 *   again on the next question
 * - Events: "select" with the answer number, navigation events re-emitted
 */
import { mount } from "@vue/test-utils";
import { quizQuestion } from "../../../tests/fixtures/quiz";
import QuizQuestionCard from "./QuizQuestionCard.vue";

/** Mounts the card on question 1/5, nothing picked; override per test. */
function factory(props: Record<string, unknown> = {}) {
  return mount(QuizQuestionCard, {
    props: {
      question: quizQuestion(),
      number: 1,
      total: 5,
      selectedAnswer: null,
      isChecked: false,
      isFirst: true,
      isLast: false,
      ...props,
    },
  });
}

const sel = (id: string) => `[data-testid="${id}"]`;
const answerClasses = (wrapper: ReturnType<typeof factory>) =>
  wrapper.findAll(sel("quiz-answer")).map((answer) => answer.classes().find((c) => c.startsWith("quiz-answer--")));

describe("QuizQuestionCard", () => {
  describe("rendering", () => {
    it("shows the progress and the question", () => {
      const wrapper = factory();

      expect(wrapper.get(sel("quiz-progress-label")).text()).toBe("Question 1/5");
      expect(wrapper.get(sel("quiz-question-text")).text()).toBe("Qu’est-ce que la narratrice commande au café ?");
    });

    it("lists the answers with letters", () => {
      const wrapper = factory();

      expect(wrapper.findAll(sel("quiz-answer-letter")).map((letter) => letter.text())).toEqual(["A", "B", "C", "D"]);
      expect(wrapper.findAll(sel("quiz-answer-text")).map((text) => text.text())).toEqual([
        "Un thé et une tartine",
        "Un croissant et un café crème",
        "Un chocolat chaud",
        "Un jus d’orange",
      ]);
    });
  });

  describe("answer states", () => {
    it("highlights the picked answer before checking", () => {
      expect(answerClasses(factory({ selectedAnswer: 3 }))).toEqual([
        "quiz-answer--default",
        "quiz-answer--default",
        "quiz-answer--selected",
        "quiz-answer--default",
      ]);
    });

    it("shows the right answer and the wrong pick once checked", () => {
      expect(answerClasses(factory({ selectedAnswer: 3, isChecked: true }))).toEqual([
        "quiz-answer--default",
        "quiz-answer--correct",
        "quiz-answer--wrong",
        "quiz-answer--default",
      ]);
    });
  });

  describe("tip", () => {
    it("has no tip button when the question has no tip", () => {
      expect(factory().find(sel("quiz-question-tip-button")).exists()).toBe(false);
    });

    it("shows and hides the tip", async () => {
      const wrapper = factory({ question: quizQuestion({ tip: "Écoute le début." }) });
      const button = wrapper.get(sel("quiz-question-tip-button"));

      await button.trigger("click");
      expect(wrapper.get(sel("quiz-question-tip")).text()).toBe("Écoute le début.");
      expect(button.attributes("aria-expanded")).toBe("true");

      await button.trigger("click");
      expect(wrapper.find(sel("quiz-question-tip")).exists()).toBe(false);
    });

    it("hides the tip again on the next question", async () => {
      const wrapper = factory({ question: quizQuestion({ id: 1, tip: "Écoute le début." }) });
      await wrapper.get(sel("quiz-question-tip-button")).trigger("click");

      await wrapper.setProps({ question: quizQuestion({ id: 2, tip: "Regarde la fin." }) });

      expect(wrapper.find(sel("quiz-question-tip")).exists()).toBe(false);
    });
  });

  describe("events", () => {
    it('emits "select" with the number of the clicked answer', async () => {
      const wrapper = factory();

      await wrapper.findAll(sel("quiz-answer"))[2]!.trigger("click");

      expect(wrapper.emitted("select")).toEqual([[3]]);
    });

    it("does not emit \"select\" once checked", async () => {
      const wrapper = factory({ selectedAnswer: 2, isChecked: true });

      await wrapper.findAll(sel("quiz-answer"))[0]!.trigger("click");

      expect(wrapper.emitted("select")).toBeUndefined();
    });

    it.each([
      ["check", { selectedAnswer: 2 }, "quiz-navigation-main"],
      ["next", { selectedAnswer: 2, isChecked: true }, "quiz-navigation-main"],
      ["previous", { isFirst: false }, "quiz-navigation-previous"],
    ])('re-emits "%s"', async (event, props, button) => {
      const wrapper = factory(props);

      await wrapper.get(sel(button)).trigger("click");

      expect(wrapper.emitted(event)).toHaveLength(1);
    });
  });
});

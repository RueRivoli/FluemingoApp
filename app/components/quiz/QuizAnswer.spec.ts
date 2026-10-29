/**
 * @file Unit tests for QuizAnswer.
 *
 * Covers:
 * - Rendering of the letter and the answer text
 * - State class for each state, aria-pressed when selected
 * - Screen-reader label once checked (right / wrong answer)
 * - "select" emitted on click, not when disabled
 */
import { mount } from "@vue/test-utils";
import QuizAnswer from "./QuizAnswer.vue";

/** Mounts QuizAnswer with a default answer; override per test. */
function factory(props: Record<string, unknown> = {}) {
  return mount(QuizAnswer, { props: { letter: "B", text: "Un café crème", ...props } });
}

const sel = (id: string) => `[data-testid="${id}"]`;

describe("QuizAnswer", () => {
  describe("rendering", () => {
    it("shows the letter and the answer", () => {
      const wrapper = factory();

      expect(wrapper.get(sel("quiz-answer-letter")).text()).toBe("B");
      expect(wrapper.get(sel("quiz-answer-text")).text()).toBe("Un café crème");
    });

    it.each(["default", "selected", "correct", "wrong"])("applies the class of the %s state", (state) => {
      const wrapper = factory({ state });

      expect(wrapper.get(sel("quiz-answer")).classes()).toContain(`quiz-answer--${state}`);
    });

    it("is pressed only when selected", () => {
      expect(factory({ state: "selected" }).get(sel("quiz-answer")).attributes("aria-pressed")).toBe("true");
      expect(factory({ state: "correct" }).get(sel("quiz-answer")).attributes("aria-pressed")).toBe("false");
    });
  });

  describe("accessibility", () => {
    it.each([
      ["correct", "right answer"],
      ["wrong", "wrong answer"],
    ])("tells screen readers a %s answer", (state, label) => {
      const wrapper = factory({ state });

      expect(wrapper.get(sel("quiz-answer-state")).text()).toContain(label);
    });

    it("adds no label before checking", () => {
      expect(factory({ state: "selected" }).find(sel("quiz-answer-state")).exists()).toBe(false);
    });
  });

  describe("events", () => {
    it('emits "select" when clicked', async () => {
      const wrapper = factory();

      await wrapper.get(sel("quiz-answer")).trigger("click");

      expect(wrapper.emitted("select")).toHaveLength(1);
    });

    it('does not emit "select" when disabled', async () => {
      const wrapper = factory({ disabled: true });

      await wrapper.get(sel("quiz-answer")).trigger("click");

      expect(wrapper.emitted("select")).toBeUndefined();
      expect(wrapper.get(sel("quiz-answer")).attributes("aria-disabled")).toBe("true");
    });
  });
});

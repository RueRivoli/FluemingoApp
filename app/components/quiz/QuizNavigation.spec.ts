/**
 * @file Unit tests for QuizNavigation.
 *
 * Covers:
 * - "Previous": disabled on the first question, emits "previous" otherwise
 * - Main button label: Check answer / Next question / See my score
 * - Main button disabled before a pick, emits "check" then "next"
 */
import { mount } from "@vue/test-utils";
import QuizNavigation from "./QuizNavigation.vue";

/** Mounts QuizNavigation on a middle question with an answer picked; override per test. */
function factory(props: Record<string, unknown> = {}) {
  return mount(QuizNavigation, {
    props: { isFirst: false, isLast: false, isChecked: false, canCheck: true, ...props },
  });
}

const sel = (id: string) => `[data-testid="${id}"]`;

describe("QuizNavigation", () => {
  describe("previous", () => {
    it("is disabled on the first question", () => {
      expect(factory({ isFirst: true }).get(sel("quiz-navigation-previous")).attributes("disabled")).toBeDefined();
    });

    it('emits "previous" when clicked', async () => {
      const wrapper = factory();

      await wrapper.get(sel("quiz-navigation-previous")).trigger("click");

      expect(wrapper.emitted("previous")).toHaveLength(1);
    });
  });

  describe("main button", () => {
    it.each([
      ["Check answer", { isChecked: false }],
      ["Next question", { isChecked: true }],
      ["See my score", { isChecked: true, isLast: true }],
    ])('reads "%s"', (label, props) => {
      expect(factory(props).get(sel("quiz-navigation-main")).text()).toBe(label);
    });

    it("is disabled until an answer is picked", async () => {
      const wrapper = factory({ canCheck: false });
      const main = wrapper.get(sel("quiz-navigation-main"));

      await main.trigger("click");

      expect(main.attributes("disabled")).toBeDefined();
      expect(wrapper.emitted("check")).toBeUndefined();
    });

    it('emits "check" before the pick is checked', async () => {
      const wrapper = factory();

      await wrapper.get(sel("quiz-navigation-main")).trigger("click");

      expect(wrapper.emitted("check")).toHaveLength(1);
      expect(wrapper.emitted("next")).toBeUndefined();
    });

    it('emits "next" once the pick is checked', async () => {
      const wrapper = factory({ isChecked: true });

      await wrapper.get(sel("quiz-navigation-main")).trigger("click");

      expect(wrapper.emitted("next")).toHaveLength(1);
    });
  });
});

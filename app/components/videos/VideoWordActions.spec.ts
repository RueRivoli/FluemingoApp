/**
 * @file Unit tests for VideoWordActions.
 *
 * Covers:
 * - Each action emits its event (add to flashcards, retranslate, report an error)
 * - Retranslate disabled and busy while retranslating
 * - Report link thanks the learner and is disabled once reported
 */
import { mount } from "@vue/test-utils";
import VideoWordActions from "./VideoWordActions.vue";

/** Mounts the actions; override props per test. */
function factory(props: Record<string, unknown> = {}) {
  return mount(VideoWordActions, {
    props,
    // NuxtImg is a Nuxt global, not registered in Jest: render a plain <img>.
    global: { stubs: { NuxtImg: { props: ["src"], template: '<img :src="src" v-bind="$attrs" />' } } },
  });
}

const sel = (id: string) => `[data-testid="${id}"]`;

describe("VideoWordActions", () => {
  describe("events", () => {
    it.each([
      ["video-word-actions-add", "addToFlashcards"],
      ["video-word-actions-retranslate", "retranslate"],
      ["video-word-actions-report", "reportError"],
    ])("%s emits %s", async (testId, event) => {
      const wrapper = factory();

      await wrapper.get(sel(testId)).trigger("click");

      expect(wrapper.emitted(event)).toHaveLength(1);
    });
  });

  describe("retranslating", () => {
    it("disables the retranslate link and marks it busy", () => {
      const wrapper = factory({ retranslating: true });
      const link = wrapper.get(sel("video-word-actions-retranslate"));

      expect(link.attributes("disabled")).toBeDefined();
      expect(link.attributes("aria-busy")).toBe("true");
    });
  });

  describe("reported", () => {
    it("offers to report an error by default", () => {
      const wrapper = factory();

      expect(wrapper.get(sel("video-word-actions-report")).text()).toBe("Report an error");
    });

    it("thanks the learner and disables the link once reported", () => {
      const wrapper = factory({ reported: true });
      const link = wrapper.get(sel("video-word-actions-report"));

      expect(link.text()).toBe("Thanks for the report");
      expect(link.attributes("disabled")).toBeDefined();
    });
  });
});

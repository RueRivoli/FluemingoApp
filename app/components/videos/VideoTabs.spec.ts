/**
 * @file Unit tests for VideoTabs.
 *
 * Covers:
 * - Renders the Video, Vocabulary and Quiz tabs, in order, as ARIA tabs
 * - Video is selected by default; v-model:tab selects another tab
 * - Clicking a tab emits update:tab and shows its panel
 * - Each panel renders the slot of the same name
 */
import { mount } from "@vue/test-utils";
import PrimeVue from "primevue/config";
import VideoTabs from "./VideoTabs.vue";

/** Mounts VideoTabs with a marker in each slot; override props per test. */
function factory(props: Record<string, unknown> = {}) {
  return mount(VideoTabs, {
    props,
    slots: {
      video: '<p data-testid="slot-video">Player</p>',
      vocabulary: '<p data-testid="slot-vocabulary">Words</p>',
      quiz: '<p data-testid="slot-quiz">Questions</p>',
    },
    // PrimeVue components read their config from the plugin; unstyled keeps jsdom light.
    global: { plugins: [[PrimeVue, { unstyled: true }]] },
  });
}

const sel = (id: string) => `[data-testid="${id}"]`;
const isVisible = (element: Element) => (element as HTMLElement).style.display !== "none";

describe("VideoTabs", () => {
  describe("rendering", () => {
    it("shows the Video, Vocabulary and Quiz tabs, in order", () => {
      const labels = factory()
        .findAll('[role="tab"]')
        .map((tab) => tab.text());

      expect(labels).toEqual(["Video", "Vocabulary", "Quiz"]);
    });

    it("renders each slot in its panel", () => {
      const wrapper = factory();

      expect(wrapper.get(sel("video-tab-panel-video")).find(sel("slot-video")).exists()).toBe(true);
      expect(
        wrapper.get(sel("video-tab-panel-vocabulary")).find(sel("slot-vocabulary")).exists(),
      ).toBe(true);
      expect(wrapper.get(sel("video-tab-panel-quiz")).find(sel("slot-quiz")).exists()).toBe(true);
    });
  });

  describe("selection", () => {
    it("selects the Video tab by default", () => {
      const wrapper = factory();

      expect(wrapper.get(sel("video-tab-video")).attributes("aria-selected")).toBe("true");
      expect(wrapper.get(sel("video-tab-quiz")).attributes("aria-selected")).toBe("false");
    });

    it("selects the tab given with v-model:tab", () => {
      const wrapper = factory({ tab: "quiz" });

      expect(wrapper.get(sel("video-tab-quiz")).attributes("aria-selected")).toBe("true");
      expect(isVisible(wrapper.get(sel("video-tab-panel-quiz")).element)).toBe(true);
      expect(isVisible(wrapper.get(sel("video-tab-panel-video")).element)).toBe(false);
    });

    it("emits update:tab and shows the panel of the clicked tab", async () => {
      const wrapper = factory();

      await wrapper.get(sel("video-tab-vocabulary")).trigger("click");

      expect(wrapper.emitted("update:tab")).toEqual([["vocabulary"]]);
      expect(wrapper.get(sel("video-tab-vocabulary")).attributes("aria-selected")).toBe("true");
      expect(isVisible(wrapper.get(sel("video-tab-panel-vocabulary")).element)).toBe(true);
    });
  });
});

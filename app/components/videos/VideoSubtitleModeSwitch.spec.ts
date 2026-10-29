/**
 * @file Unit tests for VideoSubtitleModeSwitch.
 *
 * Covers:
 * - Renders the three modes with their label, Contextual pressed by default
 * - Only the modes given in `modes` are shown
 * - The pressed option follows v-model
 * - Clicking an option updates v-model
 */
import { mount } from "@vue/test-utils";
import type { SubtitleMode } from "~/types/video";
import VideoSubtitleModeSwitch from "./VideoSubtitleModeSwitch.vue";

/** Mounts the switch; without modelValue it uses its default. */
function factory(modelValue?: SubtitleMode, modes?: SubtitleMode[]) {
  return mount(VideoSubtitleModeSwitch, {
    props: { ...(modelValue ? { modelValue } : {}), ...(modes ? { modes } : {}) },
  });
}

const sel = (id: string) => `[data-testid="${id}"]`;
const pressed = (wrapper: ReturnType<typeof factory>) =>
  wrapper
    .findAll("button")
    .filter((button) => button.attributes("aria-pressed") === "true")
    .map((button) => button.text());

describe("VideoSubtitleModeSwitch", () => {
  describe("rendering", () => {
    it("shows the three modes", () => {
      const wrapper = factory();

      expect(wrapper.findAll("button").map((button) => button.text())).toEqual([
        "Contextual",
        "Words",
        "Standard",
      ]);
    });

    it("presses Contextual by default", () => {
      expect(pressed(factory())).toEqual(["Contextual"]);
    });

    it("shows only the given modes", () => {
      const wrapper = factory("words", ["words", "standard"]);

      expect(wrapper.findAll("button").map((button) => button.text())).toEqual([
        "Words",
        "Standard",
      ]);
    });

    it("presses the option of v-model", () => {
      expect(pressed(factory("words"))).toEqual(["Words"]);
    });
  });

  describe("events", () => {
    it.each([
      ["contextual", "standard"],
      ["words", "contextual"],
      ["standard", "contextual"],
    ] as const)("emits %s when its option is clicked", async (mode, start) => {
      const wrapper = factory(start);

      await wrapper.get(sel(`video-subtitle-mode-${mode}`)).trigger("click");

      expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([mode]);
    });
  });
});

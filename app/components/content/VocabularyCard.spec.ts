/**
 * @file Unit tests for VocabularyCard.
 *
 * Covers:
 * - Rendering of the word, optional grammar tag and translation
 * - Audio button: shown only with hasAudio, emits "playAudio", labelled, icon hidden
 * - Save bookmark: toggles v-model:saved, icon (bookmark-plus / filled bookmark) and aria state follow it
 */
import { mount } from "@vue/test-utils";
import VocabularyCard from "./VocabularyCard.vue";

/** Mounts VocabularyCard with a default word; override per test. */
function factory(props: Record<string, unknown> = {}) {
  return mount(VocabularyCard, { props: { word: "être blessé", ...props } });
}

const sel = (id: string) => `[data-testid="${id}"]`;

describe("VocabularyCard", () => {
  describe("rendering", () => {
    it("shows the word", () => {
      const wrapper = factory();

      expect(wrapper.get(sel("vocabulary-card-word")).text()).toBe("être blessé");
    });

    it("shows the grammar tag and the translation", () => {
      const wrapper = factory({ type: "v", translation: "to be injured" });

      expect(wrapper.get(sel("vocabulary-card-type")).text()).toBe("v");
      expect(wrapper.get(sel("vocabulary-card-translation")).text()).toBe("to be injured");
    });

    it.each(["vocabulary-card-type", "vocabulary-card-translation", "vocabulary-card-audio"])(
      "does not render %s when its prop is missing",
      (testId) => {
        const wrapper = factory();

        expect(wrapper.find(sel(testId)).exists()).toBe(false);
      },
    );
  });

  describe("audio", () => {
    it('emits "playAudio" when the audio button is clicked', async () => {
      const wrapper = factory({ hasAudio: true });

      await wrapper.get(sel("vocabulary-card-audio")).trigger("click");

      expect(wrapper.emitted("playAudio")).toHaveLength(1);
    });

    it("labels the audio button with the word", () => {
      const wrapper = factory({ hasAudio: true });

      expect(wrapper.get(sel("vocabulary-card-audio")).attributes("aria-label")).toBe(
        'Listen to "être blessé"',
      );
    });

    it("shows a waveform icon hidden from assistive technologies", () => {
      const wrapper = factory({ hasAudio: true });
      const icon = wrapper.get(sel("vocabulary-card-audio-icon"));

      expect(icon.classes()).toContain("fa-circle-waveform-lines");
      expect(icon.attributes("aria-hidden")).toBe("true");
    });
  });

  describe("save", () => {
    it("emits update:saved with true when an unsaved word is bookmarked", async () => {
      const wrapper = factory({ saved: false });

      await wrapper.get(sel("vocabulary-card-save")).trigger("click");

      expect(wrapper.emitted("update:saved")).toEqual([[true]]);
    });

    it("emits update:saved with false when a saved word is clicked", async () => {
      const wrapper = factory({ saved: true });

      await wrapper.get(sel("vocabulary-card-save")).trigger("click");

      expect(wrapper.emitted("update:saved")).toEqual([[false]]);
    });

    it("shows an bookmark-plus icon, not pressed, when the word is not saved", () => {
      const wrapper = factory();

      expect(wrapper.get(sel("vocabulary-card-save-icon")).classes()).toContain("fa-bookmark-plus");
      expect(wrapper.get(sel("vocabulary-card-save")).attributes("aria-pressed")).toBe("false");
    });

    it("shows a filled bookmark, pressed, when the word is saved", () => {
      const wrapper = factory({ saved: true });

      expect(wrapper.get(sel("vocabulary-card-save-icon")).classes()).toEqual(
        expect.arrayContaining(["fa-solid", "fa-bookmark"]),
      );
      expect(wrapper.get(sel("vocabulary-card-save")).attributes("aria-pressed")).toBe("true");
    });

    it("names the action in the save button label", () => {
      const wrapper = factory({ saved: true });

      expect(wrapper.get(sel("vocabulary-card-save")).attributes("aria-label")).toBe(
        'Remove "être blessé" from flashcards',
      );
    });
  });
});

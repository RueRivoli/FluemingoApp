/**
 * @file Unit tests for VocabularyItemCard.
 *
 * Covers:
 * - Rendering of the word, optional grammar tag and translation
 * - Base form: shown after the curved arrow only when it differs from the word
 * - Audio button: shown only with hasAudio, emits "playAudio", labelled,
 *   highlighted and pressed while isPlaying
 * - Badge: labelled after the deck, with the deck's glyph
 */
import { mount } from "@vue/test-utils";
import VocabularyItemCard from "./VocabularyItemCard.vue";

// NuxtImg is a Nuxt global, not registered in Jest: render a plain <img>.
const NUXT_IMG_STUB = { props: ["src"], template: '<img :src="src" v-bind="$attrs" />' };

/** Mounts a saved "une crue"; override per test. */
function factory(props: Record<string, unknown> = {}) {
  return mount(VocabularyItemCard, {
    props: { word: "une crue", status: "saved", ...props },
    global: { stubs: { NuxtImg: NUXT_IMG_STUB } },
  });
}

const sel = (id: string) => `[data-testid="${id}"]`;

describe("VocabularyItemCard", () => {
  describe("rendering", () => {
    it("shows the word", () => {
      expect(factory().get(sel("vocabulary-item-card-word")).text()).toBe("une crue");
    });

    it("shows the grammar tag and the translation", () => {
      const wrapper = factory({ type: "nf", translation: "a flood" });

      expect(wrapper.get(sel("vocabulary-item-card-type")).text()).toBe("nf");
      expect(wrapper.get(sel("vocabulary-item-card-translation")).text()).toBe("a flood");
    });

    it.each([
      "vocabulary-item-card-type",
      "vocabulary-item-card-translation",
      "vocabulary-item-card-base-form",
      "vocabulary-item-card-audio",
    ])("does not render %s when its prop is missing", (testId) => {
      expect(factory().find(sel(testId)).exists()).toBe(false);
    });
  });

  describe("base form", () => {
    it("shows the base form after the curved arrow when it differs from the word", () => {
      const baseForm = factory({ word: "Des dizaines de touristes", basis: "touriste" }).get(
        sel("vocabulary-item-card-base-form"),
      );

      expect(baseForm.text()).toBe("touriste");
      expect(baseForm.get("img").attributes("src")).toBe(
        "/img/icons/vocabulary/corner-down-right.svg",
      );
    });

    it("is hidden when it is the word itself, whatever the case", () => {
      const wrapper = factory({ word: "Crue", basis: "crue" });

      expect(wrapper.find(sel("vocabulary-item-card-base-form")).exists()).toBe(false);
    });
  });

  describe("audio", () => {
    it('emits "playAudio" when the audio button is clicked', async () => {
      const wrapper = factory({ hasAudio: true });

      await wrapper.get(sel("vocabulary-item-card-audio")).trigger("click");

      expect(wrapper.emitted("playAudio")).toHaveLength(1);
    });

    it("names the audio button after the word", () => {
      const audio = factory({ hasAudio: true }).get(sel("vocabulary-item-card-audio"));

      expect(audio.attributes("aria-label")).toBe('Listen to "une crue"');
    });

    it("is highlighted and pressed while the pronunciation plays", () => {
      const audio = factory({ hasAudio: true, isPlaying: true }).get(
        sel("vocabulary-item-card-audio"),
      );

      expect(audio.classes()).toContain("vocabulary-item-card__audio--playing");
      expect(audio.attributes("aria-pressed")).toBe("true");
    });
  });

  describe("badge", () => {
    it.each([
      ["saved", "Saved", "fa-bookmark"],
      ["difficult", "Difficult", "fa-triangle-exclamation"],
      ["training", "In training", "fa-dumbbell"],
      ["mastered", "Mastered", "fa-badge-check"],
    ])("labels a %s word and shows its deck glyph", (status, label, icon) => {
      const wrapper = factory({ status });

      expect(wrapper.get(sel("vocabulary-item-card-badge")).attributes("aria-label")).toBe(label);
      expect(wrapper.get(sel("vocabulary-item-card-badge-icon")).classes()).toContain(icon);
    });
  });
});

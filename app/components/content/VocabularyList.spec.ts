/**
 * @file Unit tests for VocabularyList.
 *
 * Covers:
 * - Main tab selected by default, showing the content's words
 * - Switching to the Personal tab shows the user's words
 * - Empty message per tab
 * - Saved state of each card from savedIds
 * - Playing state of the card matching playingId
 * - "playAudio" and "toggleSaved" re-emitted with the word
 * - maxColumns: bounds the grid columns only when given
 */
import { mount } from "@vue/test-utils";
import { vocabularyItem } from "../../../tests/fixtures/vocabulary";
import VocabularyList from "./VocabularyList.vue";

const CRUE = vocabularyItem({ id: 1, text: "une crue", type: "nf", translation: "a flood", audioUrl: "https://cdn.test/crue.mp3" });
const BARRAGE = vocabularyItem({ id: 2, text: "un barrage", type: "nm", translation: "a dam" });
const FUIR = vocabularyItem({ id: 3, text: "fuir", type: "v", translation: "to flee", isAddedByUser: true });


/** Mounts VocabularyList with two main words and one personal word; override per test. */
function factory(props: Record<string, unknown> = {}) {
  return mount(VocabularyList, {
    props: { mainWords: [CRUE, BARRAGE], personalWords: [FUIR], ...props },
  });
}

const sel = (id: string) => `[data-testid="${id}"]`;
const wordsOf = (wrapper: ReturnType<typeof factory>) =>
  wrapper.findAll(sel("vocabulary-card-word")).map((word) => word.text());

describe("VocabularyList", () => {
  describe("tabs", () => {
    it("shows the content's words on the Main tab by default", () => {
      const wrapper = factory();

      expect(wordsOf(wrapper)).toEqual(["une crue", "un barrage"]);
      expect(wrapper.get(sel("vocabulary-list-tab-main")).attributes("aria-selected")).toBe("true");
    });

    it("shows the user's words on the Personal tab", async () => {
      const wrapper = factory();

      await wrapper.get(sel("vocabulary-list-tab-personal")).trigger("click");

      expect(wordsOf(wrapper)).toEqual(["fuir"]);
      expect(wrapper.get(sel("vocabulary-list-tab-personal")).attributes("aria-selected")).toBe("true");
    });

    it("shows an empty message when the tab has no words", async () => {
      const wrapper = factory({ personalWords: [] });

      await wrapper.get(sel("vocabulary-list-tab-personal")).trigger("click");

      expect(wrapper.get(sel("vocabulary-list-empty")).text()).toBe("You haven't added any words yet.");
    });
  });

  describe("cards", () => {
    it("shows the audio button only for words with audio", () => {
      const wrapper = factory();

      expect(wrapper.findAll(sel("vocabulary-card-audio"))).toHaveLength(1);
    });

    it("marks the card of playingId as playing", () => {
      const wrapper = factory({ playingId: 1 });

      expect(wrapper.get(sel("vocabulary-card-audio")).classes()).toContain(
        "vocabulary-card__audio--playing",
      );
    });

    it("marks no card as playing by default", () => {
      const wrapper = factory();

      expect(wrapper.get(sel("vocabulary-card-audio")).classes()).not.toContain(
        "vocabulary-card__audio--playing",
      );
    });

    it("marks the words of savedIds as saved", () => {
      const wrapper = factory({ savedIds: [2] });

      const pressed = wrapper.findAll(sel("vocabulary-card-save")).map((button) => button.attributes("aria-pressed"));
      expect(pressed).toEqual(["false", "true"]);
    });
  });

  describe("columns", () => {
    it("bounds the grid to maxColumns columns", () => {
      const grid = factory({ maxColumns: 2 }).get('[data-testid="vocabulary-list-grid"]');

      expect(grid.classes()).toContain("vocabulary-list__grid--bounded");
      expect(grid.attributes("style")).toContain("--vocabulary-list-max-columns: 2");
    });

    it("fits as many columns as possible by default", () => {
      const grid = factory().get('[data-testid="vocabulary-list-grid"]');

      expect(grid.classes()).not.toContain("vocabulary-list__grid--bounded");
      expect(grid.attributes("style")).toBeUndefined();
    });
  });

  describe("events", () => {
    it('emits "playAudio" with the word', async () => {
      const wrapper = factory();

      await wrapper.get(sel("vocabulary-card-audio")).trigger("click");

      expect(wrapper.emitted("playAudio")).toEqual([[CRUE]]);
    });

    it('emits "toggleSaved" with the word and its new state', async () => {
      const wrapper = factory({ savedIds: [2] });

      await wrapper.findAll(sel("vocabulary-card-save"))[1]!.trigger("click");

      expect(wrapper.emitted("toggleSaved")).toEqual([[BARRAGE, false]]);
    });
  });
});

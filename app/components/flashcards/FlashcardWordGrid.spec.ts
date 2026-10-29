/**
 * @file Unit tests for FlashcardWordGrid.
 *
 * Covers:
 * - One VocabularyItemCard per word, with the word's fields and the deck status
 * - Audio button only for words with a pronunciation; playing word highlighted
 * - "playAudio" emitted with the clicked word
 * - Empty-deck message
 */
import { mount } from "@vue/test-utils";
import { vocabularyItem } from "~~/tests/fixtures/vocabulary";
import VocabularyItemCard from "~/components/content/VocabularyItemCard.vue";
import type { VocabularyItem } from "~/types/vocabulary";
import FlashcardWordGrid from "./FlashcardWordGrid.vue";

// NuxtImg is a Nuxt global, not registered in Jest: render a plain <img>.
const NUXT_IMG_STUB = { props: ["src"], template: '<img :src="src" v-bind="$attrs" />' };

const WORDS: VocabularyItem[] = [
  vocabularyItem({ id: 1, text: "ton", type: "nm", translation: "tone", audioUrl: "a/ton.mp3" }),
  vocabularyItem({
    id: 2,
    text: "Des dizaines de touristes",
    type: null,
    translation: "Dozens of tourists",
    basis: "touriste",
  }),
];

/** Mounts the grid with two saved words; override per test. */
function factory(props: Record<string, unknown> = {}) {
  return mount(FlashcardWordGrid, {
    props: { words: WORDS, status: "saved", ...props },
    global: { stubs: { NuxtImg: NUXT_IMG_STUB } },
  });
}

const sel = (id: string) => `[data-testid="${id}"]`;

describe("FlashcardWordGrid", () => {
  describe("rendering", () => {
    it("renders one card per word, with its fields and the deck status", () => {
      const cards = factory({ status: "difficult" }).findAllComponents(VocabularyItemCard);

      expect(cards).toHaveLength(2);
      expect(cards[1]!.props()).toMatchObject({
        word: "Des dizaines de touristes",
        type: null,
        translation: "Dozens of tourists",
        basis: "touriste",
        status: "difficult",
      });
    });

    it("shows the audio button only for words with a pronunciation", () => {
      const cards = factory().findAllComponents(VocabularyItemCard);

      expect(cards.map((card) => card.props("hasAudio"))).toEqual([true, false]);
    });

    it("highlights the word whose pronunciation is playing", () => {
      const cards = factory({ playingId: 1 }).findAllComponents(VocabularyItemCard);

      expect(cards.map((card) => card.props("isPlaying"))).toEqual([true, false]);
    });

    it("shows a message instead of the grid when the deck is empty", () => {
      const wrapper = factory({ words: [] });

      expect(wrapper.find(sel("flashcard-word-grid")).exists()).toBe(false);
      expect(wrapper.get(sel("flashcard-word-grid-empty")).text()).toBe(
        "No words in this deck yet.",
      );
    });
  });

  describe("events", () => {
    it('emits "playAudio" with the clicked word', async () => {
      const wrapper = factory();

      await wrapper.get(sel("vocabulary-item-card-audio")).trigger("click");

      expect(wrapper.emitted("playAudio")).toEqual([[WORDS[0]]]);
    });
  });
});

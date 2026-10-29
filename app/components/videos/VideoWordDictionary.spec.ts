/**
 * @file Unit tests for VideoWordDictionary.
 *
 * Covers:
 * - Rendering: each translation with its part of speech (none when unknown)
 * - The translation already known from the transcript is left out (case-insensitive)
 * - Loading and error states
 * - Hidden when there is nothing to show
 */
import { mount } from "@vue/test-utils";
import type { DictionaryTranslation } from "~/types/dictionary";
import VideoWordDictionary from "./VideoWordDictionary.vue";

const TRANSLATIONS: DictionaryTranslation[] = [
  { text: "house", partOfSpeech: "noun", confidence: 0.6 },
  { text: "home", partOfSpeech: null, confidence: 0.38 },
];

/** Mounts the list with two translations; override props per test. */
function factory(props: Record<string, unknown> = {}) {
  return mount(VideoWordDictionary, { props: { translations: TRANSLATIONS, ...props } });
}

const sel = (id: string) => `[data-testid="${id}"]`;
/** Each listed translation as "text (part of speech)". */
const items = (wrapper: ReturnType<typeof factory>) =>
  wrapper.findAll(sel("video-word-dictionary-item")).map((item) => {
    const pos = item.find(sel("video-word-dictionary-pos"));
    const text = item.get(sel("video-word-dictionary-text")).text();
    return pos.exists() ? `${text} (${pos.text()})` : text;
  });

describe("VideoWordDictionary", () => {
  describe("rendering", () => {
    it("lists each translation with its part of speech", () => {
      const wrapper = factory();

      expect(items(wrapper)).toEqual(["house (noun)", "home"]);
    });

    it("leaves out the translation the transcript already gives", () => {
      const wrapper = factory({ knownTranslation: "House" });

      expect(items(wrapper)).toEqual(["home"]);
    });
  });

  describe("states", () => {
    it("says it is looking the word up while loading", () => {
      const wrapper = factory({ translations: [], loading: true });

      expect(wrapper.find(sel("video-word-dictionary-loading")).exists()).toBe(true);
      expect(items(wrapper)).toEqual([]);
    });

    it("says when the dictionary is unavailable", () => {
      const wrapper = factory({ translations: [], hasError: true });

      expect(wrapper.find(sel("video-word-dictionary-error")).exists()).toBe(true);
    });
  });

  describe("edge cases", () => {
    it.each([
      ["there are no translations", { translations: [] }],
      ["the only translation is the known one", { knownTranslation: "house", translations: [TRANSLATIONS[0]] }],
    ])("renders nothing when %s", (_label, props) => {
      const wrapper = factory(props);

      expect(wrapper.find(sel("video-word-dictionary")).exists()).toBe(false);
    });
  });
});

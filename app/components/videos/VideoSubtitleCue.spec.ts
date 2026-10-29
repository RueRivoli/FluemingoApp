/**
 * @file Unit tests for VideoSubtitleCue.
 *
 * Covers:
 * - Rendering: timestamp formatted from the start, sentence, translation
 * - Translation hidden when null or when showTranslation is false
 * - Active state: modifier class and aria-current
 * - Emits "select" on a click on the line or on the time button; the time
 *   button's accessible name has the time and the sentence
 * - Words: segments rendered back into the sentence, words as buttons that
 *   emit "wordSelect" with the definition and the button (not "select");
 *   selected word highlighted; plain sentence without segments
 */
import { mount } from "@vue/test-utils";
import type { SubtitleSegment, WordDefinition } from "~/types/video";
import VideoSubtitleCue from "./VideoSubtitleCue.vue";

const CAFE: WordDefinition = {
  text: "un café crème",
  basis: null,
  type: "nm",
  translation: "a café crème",
  note: null,
  isProperName: false,
};
const SEGMENTS: SubtitleSegment[] = [
  { text: "Je prends toujours ", word: null },
  { text: CAFE.text, word: CAFE },
  { text: ".", word: null },
];

/** Mounts a cue at 0:14 with a translation; override per test. */
function factory(props: Record<string, unknown> = {}) {
  return mount(VideoSubtitleCue, {
    props: {
      start: 14.2,
      text: "Je prends toujours un café crème.",
      translation: "I always have a café crème.",
      ...props,
    },
  });
}

const sel = (id: string) => `[data-testid="${id}"]`;

describe("VideoSubtitleCue", () => {
  describe("rendering", () => {
    it("shows the start time like a video timestamp", () => {
      expect(factory({ start: 75.9 }).get(sel("video-subtitle-cue-time")).text()).toBe("1:15");
    });

    it("shows the sentence and its translation", () => {
      const wrapper = factory();

      expect(wrapper.get(sel("video-subtitle-cue-text")).text()).toBe(
        "Je prends toujours un café crème.",
      );
      expect(wrapper.get(sel("video-subtitle-cue-translation")).text()).toBe(
        "I always have a café crème.",
      );
    });

    it.each([
      ["there is none", { translation: null }],
      ["showTranslation is false", { showTranslation: false }],
    ])("hides the translation when %s", (_label, props) => {
      expect(factory(props).find(sel("video-subtitle-cue-translation")).exists()).toBe(false);
    });
  });

  describe("active state", () => {
    it("marks the line being spoken", () => {
      const cue = factory({ isActive: true }).get(sel("video-subtitle-cue"));

      expect(cue.classes()).toContain("video-subtitle-cue--active");
      expect(cue.attributes("aria-current")).toBe("true");
    });

    it("is not marked by default", () => {
      const cue = factory().get(sel("video-subtitle-cue"));

      expect(cue.classes()).not.toContain("video-subtitle-cue--active");
      expect(cue.attributes("aria-current")).toBeUndefined();
    });
  });

  describe("events", () => {
    it('emits "select" when clicked', async () => {
      const wrapper = factory();

      await wrapper.get(sel("video-subtitle-cue")).trigger("click");

      expect(wrapper.emitted("select")).toHaveLength(1);
    });

    it('emits "select" once when the time button is clicked', async () => {
      const wrapper = factory();

      await wrapper.get(sel("video-subtitle-cue-time")).trigger("click");

      expect(wrapper.emitted("select")).toHaveLength(1);
    });

    it("names the time button with the time and the sentence", () => {
      expect(factory().get(sel("video-subtitle-cue-time")).attributes("aria-label")).toBe(
        "Replay from 0:14: Je prends toujours un café crème.",
      );
    });
  });

  describe("words", () => {
    const words = (wrapper: ReturnType<typeof factory>) => wrapper.findAll(sel("video-subtitle-cue-word"));

    it("renders the segments back into the sentence, words as buttons", () => {
      const wrapper = factory({ text: "Je prends toujours un café crème.", segments: SEGMENTS });

      expect(wrapper.get(sel("video-subtitle-cue-text")).text()).toBe(
        "Je prends toujours un café crème.",
      );
      expect(words(wrapper).map((word) => word.text())).toEqual(["un café crème"]);
    });

    it("shows the plain sentence without segments", () => {
      expect(words(factory())).toHaveLength(0);
    });

    it('emits "wordSelect" with the word and its button, without replaying the line', async () => {
      const wrapper = factory({ segments: SEGMENTS });
      const button = words(wrapper)[0];

      await button?.trigger("click");

      expect(wrapper.emitted("wordSelect")).toEqual([[CAFE, button?.element]]);
      expect(wrapper.emitted("select")).toBeUndefined();
    });

    it("highlights the selected word", () => {
      const [word] = words(factory({ segments: SEGMENTS, selectedSegmentIndex: 1 }));

      expect(word?.classes()).toContain("video-subtitle-cue__word--selected");
      expect(word?.attributes("aria-expanded")).toBe("true");
    });

    it("highlights no word by default", () => {
      const [word] = words(factory({ segments: SEGMENTS }));

      expect(word?.attributes("aria-expanded")).toBe("false");
    });
  });
});

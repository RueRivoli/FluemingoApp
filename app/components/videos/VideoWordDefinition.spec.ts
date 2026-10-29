/**
 * @file Unit tests for VideoWordDefinition.
 *
 * Covers:
 * - Rendering: word, translation, note; note / translation hidden when missing
 * - Base form shown only when it differs from the word (case-insensitive),
 *   after a decorative curved arrow
 * - Chips: spelled-out grammar tag, "proper noun"; none without either
 * - Pronunciation buttons: hidden unless canListen; emit "listen" with slow
 *   true / false; accessible names
 * - Default slot rendered at the bottom
 */
import { mount } from "@vue/test-utils";
import type { WordDefinition } from "~/types/video";
import VideoWordDefinition from "./VideoWordDefinition.vue";

const WORD: WordDefinition = {
  text: "les amis",
  basis: "ami",
  type: "nmp",
  translation: "friends",
  note: null,
  isProperName: false,
};

/** Mounts the definition of "les amis"; override the word or props per test. */
function factory(word: Partial<WordDefinition> = {}, props: Record<string, unknown> = {}) {
  return mount(VideoWordDefinition, {
    props: { word: { ...WORD, ...word }, ...props },
    global: { stubs: { NuxtImg: NUXT_IMG_STUB } },
  });
}

// NuxtImg is a Nuxt global, not registered in Jest: render a plain <img>.
const NUXT_IMG_STUB = { props: ["src"], template: '<img :src="src" v-bind="$attrs" />' };

const sel = (id: string) => `[data-testid="${id}"]`;
const chips = (wrapper: ReturnType<typeof factory>) =>
  wrapper.findAll(sel("video-word-definition-chip")).map((chip) => chip.text());

describe("VideoWordDefinition", () => {
  describe("rendering", () => {
    it("shows the word and its translation", () => {
      const wrapper = factory();

      expect(wrapper.get(sel("video-word-definition-word")).text()).toBe("les amis");
      expect(wrapper.get(sel("video-word-definition-translation")).text()).toBe("friends");
    });

    it("shows the note when there is one", () => {
      const wrapper = factory({ note: "a chat platform", translation: null });

      expect(wrapper.get(sel("video-word-definition-note")).text()).toBe("a chat platform");
      expect(wrapper.find(sel("video-word-definition-translation")).exists()).toBe(false);
    });

    it("has no note by default", () => {
      expect(factory().find(sel("video-word-definition-note")).exists()).toBe(false);
    });
  });

  describe("base form", () => {
    it("shows the base form when it differs from the word", () => {
      expect(factory().get(sel("video-word-definition-basis")).text()).toBe("ami");
    });

    it("puts a decorative curved arrow before the base form", () => {
      const icon = factory().get(sel("video-word-definition-basis-icon"));

      expect(icon.classes()).toContain("fa-arrow-turn-down-right");
      expect(icon.attributes("aria-hidden")).toBe("true");
    });

    it.each([
      ["missing", { basis: null }],
      ["the same word", { text: "Ami", basis: "ami" }],
    ])("is hidden when %s", (_label, word) => {
      expect(factory(word).find(sel("video-word-definition-basis")).exists()).toBe(false);
    });
  });

  describe("chips", () => {
    it("spells out the grammar tag", () => {
      expect(chips(factory())).toEqual(["noun, masculine plural"]);
    });

    it("marks proper nouns", () => {
      expect(chips(factory({ type: null, isProperName: true }))).toEqual(["proper noun"]);
    });

    it("shows no chip without tag", () => {
      expect(chips(factory({ type: null }))).toEqual([]);
    });
  });

  describe("pronunciation", () => {
    it("hides the buttons by default", () => {
      expect(factory().find(sel("video-word-definition-listen")).exists()).toBe(false);
    });

    it.each([
      ["video-word-definition-listen", false],
      ["video-word-definition-listen-slow", true],
    ])('%s emits "listen" with slow = %s', async (testId, slow) => {
      const wrapper = factory({}, { canListen: true });

      await wrapper.get(sel(testId)).trigger("click");

      expect(wrapper.emitted("listen")).toEqual([[slow]]);
    });

    it("names the buttons after the word", () => {
      const wrapper = factory({}, { canListen: true });

      expect(wrapper.get(sel("video-word-definition-listen")).attributes("aria-label")).toBe(
        "Listen to “les amis”",
      );
      expect(
        wrapper.get(sel("video-word-definition-listen-slow")).attributes("aria-label"),
      ).toBe("Listen to “les amis” slowly");
    });
  });

  describe("slots", () => {
    it("renders the default slot inside the definition", () => {
      const wrapper = mount(VideoWordDefinition, {
        props: { word: WORD },
        slots: { default: '<p data-testid="extra">more</p>' },
        global: { stubs: { NuxtImg: NUXT_IMG_STUB } },
      });

      expect(wrapper.get(sel("video-word-definition")).find(sel("extra")).exists()).toBe(true);
    });
  });
});

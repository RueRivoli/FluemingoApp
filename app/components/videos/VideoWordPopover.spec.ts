/**
 * @file Unit tests for VideoWordPopover.
 *
 * Covers:
 * - open(): shows the definition of the word, anchored to the clicked element;
 *   emits "show"
 * - Opening another word while open closes then re-anchors the pop-up
 * - close(): hides it and emits "hide"
 * - Pronunciation: reads the word in the given language, slower with the snail button;
 *   buttons hidden when the browser cannot read aloud
 * - Dictionary: looks the opened word up and shows its other translations;
 *   without it, no lookup, no dictionary list and no retranslate link
 * - Actions: retranslate forces a new lookup; add to flashcards and report an
 *   error emit the word; the report is reset for the next word
 */
import { flushPromises, mount } from "@vue/test-utils";
import { defineComponent, ref } from "vue";
import { useSpeechSynthesis } from "~/composables/useSpeechSynthesis";
import { useWordTranslations } from "~/composables/useWordTranslations";
import type { DictionaryTranslation } from "~/types/dictionary";
import type { WordDefinition } from "~/types/video";
import VideoWordPopover from "./VideoWordPopover.vue";

// Speech is a browser boundary: observe what would be read.
jest.mock("~/composables/useSpeechSynthesis");
// The dictionary is a network call: observe the lookups, feed the translations.
jest.mock("~/composables/useWordTranslations");

const speak = jest.fn();
const lookup = jest.fn(() => Promise.resolve());
const DICTIONARY: DictionaryTranslation[] = [
  { text: "croissant", partOfSpeech: "noun", confidence: 0.8 },
  { text: "crescent", partOfSpeech: "noun", confidence: 0.2 },
];
const WORD: WordDefinition = {
  text: "croissant",
  basis: null,
  type: "nm",
  translation: "croissant",
  note: null,
  isProperName: false,
};

/**
 * Light Popover: PrimeVue's real one teleports to body and needs layout.
 * It records the anchor it was shown on and renders its slot while visible.
 */
const PopoverStub = defineComponent({
  emits: ["show", "hide"],
  setup(_props, { emit, expose }) {
    const visible = ref(false);
    const target = ref<HTMLElement | null>(null);
    const calls = ref<string[]>([]);
    expose({
      show(_event: Event, anchor: HTMLElement) {
        calls.value.push("show");
        target.value = anchor;
        visible.value = true;
        emit("show");
      },
      hide() {
        calls.value.push("hide");
        visible.value = false;
        emit("hide");
      },
      target,
      calls,
    });
    return { visible };
  },
  template: '<div v-if="visible" data-testid="popover-stub"><slot /></div>',
});

/** Mounts the popover; speech supported unless told otherwise. */
function factory(canListen = true, withDictionary = true) {
  jest.mocked(useSpeechSynthesis).mockReturnValue({ isSupported: ref(canListen), speak });
  jest.mocked(useWordTranslations).mockReturnValue({
    translations: ref(DICTIONARY),
    isLoading: ref(false),
    hasError: ref(false),
    lookup,
  });
  return mount(VideoWordPopover, {
    props: { language: "fr-FR", withDictionary },
    global: {
      stubs: {
        Popover: PopoverStub,
        // NuxtImg is a Nuxt global, not registered in Jest: render a plain <img>.
        NuxtImg: { props: ["src"], template: '<img :src="src" v-bind="$attrs" />' },
      },
    },
  });
}

const sel = (id: string) => `[data-testid="${id}"]`;
const stubOf = (wrapper: ReturnType<typeof factory>) =>
  wrapper.findComponent(PopoverStub).vm as unknown as { target: HTMLElement | null; calls: string[] };

beforeEach(() => jest.clearAllMocks());

describe("VideoWordPopover", () => {
  describe("open / close", () => {
    it("shows the definition next to the clicked word", async () => {
      const wrapper = factory();
      const anchor = document.createElement("button");

      await wrapper.vm.open(anchor, WORD);
      await flushPromises();

      expect(wrapper.get(sel("video-word-definition-word")).text()).toBe("croissant");
      expect(stubOf(wrapper).target).toBe(anchor);
      expect(wrapper.emitted("show")).toHaveLength(1);
    });

    it("closes then re-anchors when another word is opened", async () => {
      const wrapper = factory();
      const second = document.createElement("button");

      await wrapper.vm.open(document.createElement("button"), WORD);
      await wrapper.vm.open(second, { ...WORD, text: "café" });
      await flushPromises();

      expect(stubOf(wrapper).calls).toEqual(["show", "hide", "show"]);
      expect(stubOf(wrapper).target).toBe(second);
      expect(wrapper.get(sel("video-word-definition-word")).text()).toBe("café");
    });

    it('hides on close() and emits "hide"', async () => {
      const wrapper = factory();
      await wrapper.vm.open(document.createElement("button"), WORD);

      wrapper.vm.close();
      await flushPromises();

      expect(wrapper.find(sel("popover-stub")).exists()).toBe(false);
      expect(wrapper.emitted("hide")).toHaveLength(1);
    });
  });

  describe("pronunciation", () => {
    it.each([
      ["video-word-definition-listen", 1],
      ["video-word-definition-listen-slow", 0.6],
    ])("%s reads the word at rate %s", async (testId, rate) => {
      const wrapper = factory();
      await wrapper.vm.open(document.createElement("button"), WORD);
      await flushPromises();

      await wrapper.get(sel(testId)).trigger("click");

      expect(speak).toHaveBeenCalledWith("croissant", { language: "fr-FR", rate });
    });

    it("hides the buttons when the browser cannot read aloud", async () => {
      const wrapper = factory(false);
      await wrapper.vm.open(document.createElement("button"), WORD);
      await flushPromises();

      expect(wrapper.find(sel("video-word-definition-listen")).exists()).toBe(false);
    });
  });

  describe("dictionary", () => {
    it("looks the opened word up", async () => {
      const wrapper = factory();

      await wrapper.vm.open(document.createElement("button"), WORD);

      expect(lookup).toHaveBeenCalledWith(WORD);
    });

    it("shows the other translations of the word", async () => {
      const wrapper = factory();
      await wrapper.vm.open(document.createElement("button"), WORD);
      await flushPromises();

      const items = wrapper.findAll(sel("video-word-dictionary-text")).map((item) => item.text());
      expect(items).toEqual(["crescent"]);
    });

    it("shows only the transcript's translation without the dictionary", async () => {
      const wrapper = factory(true, false);
      await wrapper.vm.open(document.createElement("button"), WORD);
      await flushPromises();

      expect(lookup).not.toHaveBeenCalled();
      expect(wrapper.find(sel("video-word-dictionary-text")).exists()).toBe(false);
      expect(wrapper.find(sel("video-word-actions-retranslate")).exists()).toBe(false);
      expect(wrapper.get(sel("video-word-definition-translation")).text()).toBe("croissant");
    });
  });

  describe("actions", () => {
    /** Opens WORD and returns the mounted popover. */
    async function openWord() {
      const wrapper = factory();
      await wrapper.vm.open(document.createElement("button"), WORD);
      await flushPromises();
      return wrapper;
    }

    it("looks the word up again, bypassing the cache, on retranslate", async () => {
      const wrapper = await openWord();

      await wrapper.get(sel("video-word-actions-retranslate")).trigger("click");

      expect(lookup).toHaveBeenLastCalledWith(WORD, { force: true });
    });

    it.each([
      ["video-word-actions-add", "addToFlashcards"],
      ["video-word-actions-report", "reportError"],
    ])("%s emits %s with the word", async (testId, event) => {
      const wrapper = await openWord();

      await wrapper.get(sel(testId)).trigger("click");

      expect(wrapper.emitted(event)).toEqual([[WORD]]);
    });

    it("resets the report when another word is opened", async () => {
      const wrapper = await openWord();
      await wrapper.get(sel("video-word-actions-report")).trigger("click");

      await wrapper.vm.open(document.createElement("button"), { ...WORD, text: "café" });
      await flushPromises();

      expect(wrapper.get(sel("video-word-actions-report")).text()).toBe("Report an error");
    });
  });
});

/**
 * @file Unit tests for VideoSubtitlesPanel.
 *
 * Covers:
 * - One line per cue, in order; empty state and no hint without cues
 * - Active line follows currentTime (none before the first cue)
 * - Clicking a line emits "seek" with its start time
 * - Translation switch: only when a cue has a translation; turning it off
 *   hides the translation lines
 * - The list scrolls to the active line
 * - Words: clicking one opens the pop-up on it, emits "wordOpen" and
 *   highlights it until the pop-up closes
 * - Modes: Contextual (default) makes the units clickable, Words every single
 *   word, Standard none; switching closes the open pop-up; the hint follows
 * - Without units in the transcript: no Contextual mode, Words selected first;
 *   back to Contextual when units arrive (another video)
 */
import { flushPromises, mount } from "@vue/test-utils";
import { defineComponent } from "vue";
import type { SubtitleCue, WordDefinition } from "~/types/video";
import VideoSubtitlesPanel from "./VideoSubtitlesPanel.vue";

const PARIS: WordDefinition = {
  text: "Paris",
  basis: null,
  type: null,
  translation: "Paris",
  note: "capital of France",
  isProperName: true,
};
const CUES: SubtitleCue[] = [
  { start: 0, end: 3, text: "Bonjour et bienvenue.", translation: "Hello and welcome.", segments: [] },
  {
    start: 4,
    end: 8,
    text: "Aujourd’hui, Paris.",
    translation: "Today, Paris.",
    segments: [
      { text: "Aujourd’hui, ", word: null },
      { text: "Paris", word: PARIS },
      { text: ".", word: null },
    ],
  },
  { start: 9, end: 12, text: "Un petit café.", translation: null, segments: [] },
];

const openPopover = jest.fn();
const closePopover = jest.fn();
/** The real pop-up teleports a PrimeVue Popover: only its API matters here. */
const WordPopoverStub = defineComponent({
  emits: ["hide"],
  setup(_props, { expose }) {
    expose({ open: openPopover, close: closePopover });
    return () => null;
  },
});

/** Mounts the panel with three cues at 0s; override per test. */
function factory(props: Record<string, unknown> = {}) {
  return mount(VideoSubtitlesPanel, {
    props: { cues: CUES, currentTime: 0, hasUnits: true, ...props },
    // A light switch stub: PrimeVue's real one needs the PrimeVue plugin.
    global: {
      stubs: {
        VideoWordPopover: WordPopoverStub,
        ToggleSwitch: {
          props: ["modelValue"],
          emits: ["update:modelValue"],
          template:
            '<input type="checkbox" data-testid="switch" :checked="modelValue" @change="$emit(\'update:modelValue\', $event.target.checked)" />',
        },
      },
    },
  });
}

const sel = (id: string) => `[data-testid="${id}"]`;
const cues = (wrapper: ReturnType<typeof factory>) => wrapper.findAll(sel("video-subtitle-cue"));
const activeTexts = (wrapper: ReturnType<typeof factory>) =>
  cues(wrapper)
    .filter((cue) => cue.attributes("aria-current") === "true")
    .map((cue) => cue.get(sel("video-subtitle-cue-text")).text());

describe("VideoSubtitlesPanel", () => {
  describe("lines", () => {
    it("renders one line per cue, in order", () => {
      const texts = cues(factory()).map((cue) => cue.get(sel("video-subtitle-cue-text")).text());

      expect(texts).toEqual(["Bonjour et bienvenue.", "Aujourd’hui, Paris.", "Un petit café."]);
    });

    it("shows an empty state, without the hint, when there are no subtitles", () => {
      const wrapper = factory({ cues: [] });

      expect(wrapper.find(sel("video-subtitles-empty")).exists()).toBe(true);
      expect(wrapper.text()).not.toContain("Click a line");
    });
  });

  describe("active line", () => {
    it("highlights the line being spoken", () => {
      expect(activeTexts(factory({ currentTime: 5 }))).toEqual(["Aujourd’hui, Paris."]);
    });

    it("follows the current time", async () => {
      const wrapper = factory({ currentTime: 1 });

      await wrapper.setProps({ currentTime: 10 });

      expect(activeTexts(wrapper)).toEqual(["Un petit café."]);
    });

    it("highlights nothing before the first line", () => {
      const late = [{ start: 5, end: 6, text: "Plus tard.", translation: null, segments: [] }];

      expect(activeTexts(factory({ cues: late, currentTime: 1 }))).toEqual([]);
    });

    it("scrolls the list to the active line", async () => {
      const wrapper = factory({ currentTime: 0 });
      const list = wrapper.get(sel("video-subtitles-cues")).element as HTMLElement;
      // jsdom has no layout: give the list a scroll method to observe.
      list.scrollTo = jest.fn();

      await wrapper.setProps({ currentTime: 9.5 });
      await flushPromises();

      expect(list.scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: "smooth" }));
    });
  });

  describe("seek", () => {
    it('emits "seek" with the start time of the clicked line', async () => {
      const wrapper = factory();

      await cues(wrapper)[1]?.trigger("click");

      expect(wrapper.emitted("seek")).toEqual([[4]]);
    });
  });

  describe("translation", () => {
    it("shows the switch and the translations when the transcript has some", () => {
      const wrapper = factory();

      expect(wrapper.find(sel("video-subtitles-translation-toggle")).exists()).toBe(true);
      expect(wrapper.findAll(sel("video-subtitle-cue-translation"))).toHaveLength(2);
    });

    it("hides the translations when the switch is turned off", async () => {
      const wrapper = factory();

      await wrapper.get(sel("switch")).setValue(false);

      expect(wrapper.findAll(sel("video-subtitle-cue-translation"))).toHaveLength(0);
    });

    it("has no switch when no line has a translation", () => {
      const untranslated = CUES.map((cue) => ({ ...cue, translation: null }));

      expect(
        factory({ cues: untranslated }).find(sel("video-subtitles-translation-toggle")).exists(),
      ).toBe(false);
    });
  });

  describe("words", () => {
    const word = (wrapper: ReturnType<typeof factory>) => wrapper.get(sel("video-subtitle-cue-word"));

    beforeEach(() => openPopover.mockClear());

    it("opens the definition on the clicked word, without seeking", async () => {
      const wrapper = factory();

      await word(wrapper).trigger("click");

      expect(openPopover).toHaveBeenCalledWith(word(wrapper).element, PARIS);
      expect(wrapper.emitted("wordOpen")).toEqual([[PARIS]]);
      expect(wrapper.emitted("seek")).toBeUndefined();
    });

    it("highlights the word until the pop-up closes", async () => {
      const wrapper = factory();

      await word(wrapper).trigger("click");
      expect(word(wrapper).attributes("aria-expanded")).toBe("true");

      wrapper.findComponent(WordPopoverStub).vm.$emit("hide");
      await flushPromises();

      expect(word(wrapper).attributes("aria-expanded")).toBe("false");
    });

    it("tells the user words can be clicked", () => {
      expect(factory().text()).toContain("click a word to translate it");
    });
  });

  describe("modes", () => {
    const clickableWords = (wrapper: ReturnType<typeof factory>) =>
      wrapper.findAll(sel("video-subtitle-cue-word")).map((word) => word.text());

    /** Mounts the panel and picks a mode in the header switch. */
    async function inMode(mode: string) {
      const wrapper = factory();
      await wrapper.get(sel(`video-subtitle-mode-${mode}`)).trigger("click");
      return wrapper;
    }

    it("makes the units of the transcript clickable by default", () => {
      expect(clickableWords(factory())).toEqual(["Paris"]);
    });

    it("makes every single word clickable in words mode", async () => {
      const wrapper = await inMode("words");

      expect(clickableWords(wrapper)).toEqual([
        "Bonjour", "et", "bienvenue", "Aujourd’hui", "Paris", "Un", "petit", "café",
      ]);
    });

    it("opens the single word, not the unit, in words mode", async () => {
      const wrapper = await inMode("words");

      await wrapper.findAll(sel("video-subtitle-cue-word"))[2]!.trigger("click");

      expect(openPopover).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        expect.objectContaining({ text: "bienvenue", translation: null }),
      );
    });

    it("makes no word clickable in standard mode", async () => {
      const wrapper = await inMode("standard");

      expect(clickableWords(wrapper)).toEqual([]);
      expect(wrapper.text()).toContain("Aujourd’hui, Paris.");
      expect(wrapper.text()).not.toContain("click a word to translate it");
    });

    it("closes the open pop-up when the mode changes", async () => {
      const wrapper = factory();

      await wrapper.get(sel("video-subtitle-mode-words")).trigger("click");
      await flushPromises();

      expect(closePopover).toHaveBeenCalled();
    });
  });

  describe("transcript without units", () => {
    const modeLabels = (wrapper: ReturnType<typeof factory>) =>
      wrapper.get(sel("video-subtitle-mode-switch")).findAll("button").map((button) => button.text());

    it("does not offer the contextual mode", () => {
      expect(modeLabels(factory({ hasUnits: false }))).toEqual(["Words", "Standard"]);
    });

    it("starts in words mode", () => {
      const wrapper = factory({ hasUnits: false });

      expect(wrapper.get(sel("video-subtitle-mode-words")).attributes("aria-pressed")).toBe("true");
      expect(wrapper.findAll(sel("video-subtitle-cue-word"))).toHaveLength(8);
    });

    it("switches to the contextual mode when the next video has units", async () => {
      const wrapper = factory({ hasUnits: false });

      await wrapper.setProps({ hasUnits: true });

      expect(wrapper.get(sel("video-subtitle-mode-contextual")).attributes("aria-pressed")).toBe("true");
    });
  });
});

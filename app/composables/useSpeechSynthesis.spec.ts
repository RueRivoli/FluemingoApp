/**
 * @file Unit tests for useSpeechSynthesis.
 *
 * Covers:
 * - isSupported reflects the browser API
 * - speak: reads the text in the given language and rate (1 by default),
 *   cancelling the previous reading first; ignores blank text
 * - Unsupported browsers: speak does nothing
 * - Stops reading when the component is unmounted
 */
import { mount } from "@vue/test-utils";
import { defineComponent } from "vue";
import { useSpeechSynthesis, type UseSpeechSynthesisReturn } from "./useSpeechSynthesis";

/** Minimal SpeechSynthesisUtterance: jsdom has no speech API. */
class FakeUtterance {
  lang = "";
  rate = 1;
  constructor(public text: string) {}
}

const synth = { speak: jest.fn(), cancel: jest.fn() };

function installSpeechApi() {
  Object.assign(window, { speechSynthesis: synth, SpeechSynthesisUtterance: FakeUtterance });
}

function removeSpeechApi() {
  const globals = window as unknown as Record<string, unknown>;
  delete globals.speechSynthesis;
  delete globals.SpeechSynthesisUtterance;
}

/** Runs the composable inside a component (it registers an unmount hook). */
function factory() {
  let api!: UseSpeechSynthesisReturn;
  const wrapper = mount(
    defineComponent({
      setup() {
        api = useSpeechSynthesis();
        return () => null;
      },
    }),
  );
  return { api, wrapper };
}

beforeEach(() => {
  jest.clearAllMocks();
  installSpeechApi();
});

afterAll(removeSpeechApi);

describe("useSpeechSynthesis", () => {
  it("is supported when the browser has the speech API", () => {
    expect(factory().api.isSupported.value).toBe(true);
  });

  it("reads the text in the given language, at normal speed by default", () => {
    const { api } = factory();

    api.speak("croissant", { language: "fr-FR" });

    const [utterance] = synth.speak.mock.calls[0] as [FakeUtterance];
    expect(utterance).toMatchObject({ text: "croissant", lang: "fr-FR", rate: 1 });
  });

  it("reads at the given rate and cuts off the previous reading", () => {
    const { api } = factory();

    api.speak("les amis", { language: "fr-FR", rate: 0.6 });

    expect(synth.cancel).toHaveBeenCalled();
    expect((synth.speak.mock.calls[0] as [FakeUtterance])[0].rate).toBe(0.6);
    expect(synth.cancel.mock.invocationCallOrder[0]).toBeLessThan(
      synth.speak.mock.invocationCallOrder[0] ?? 0,
    );
  });

  it("ignores blank text", () => {
    factory().api.speak("  ", { language: "fr-FR" });

    expect(synth.speak).not.toHaveBeenCalled();
  });

  it("stops reading when the component is unmounted", () => {
    const { wrapper } = factory();

    wrapper.unmount();

    expect(synth.cancel).toHaveBeenCalled();
  });

  describe("without the speech API", () => {
    beforeEach(removeSpeechApi);

    it("is not supported and does nothing", () => {
      const { api } = factory();

      api.speak("croissant", { language: "fr-FR" });

      expect(api.isSupported.value).toBe(false);
      expect(synth.speak).not.toHaveBeenCalled();
    });
  });
});

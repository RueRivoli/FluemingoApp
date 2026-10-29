/**
 * @file Unit tests for useAudioPlayer.
 *
 * Covers:
 * - play: plays the given file and stops the previous one
 * - isPlaying: true while a file plays, false once it ends, fails or is stopped
 * - hasError: set when playback fails, reset on the next play, not set when
 *   a newer play() interrupted the failing one
 * - stop, and stopping when the component is unmounted
 */
import { flushPromises, mount } from "@vue/test-utils";
import { defineComponent } from "vue";
import { useAudioPlayer, type UseAudioPlayerReturn } from "./useAudioPlayer";

// jsdom does not implement media playback: play() and pause() are stubbed.
const play = jest.spyOn(window.HTMLMediaElement.prototype, "play");
const pause = jest
  .spyOn(window.HTMLMediaElement.prototype, "pause")
  .mockImplementation(() => {});

/** Runs the composable inside a component (it registers an unmount hook). */
function factory() {
  let api!: UseAudioPlayerReturn;
  const wrapper = mount(
    defineComponent({
      setup() {
        api = useAudioPlayer();
        return () => null;
      },
    }),
  );
  return { api, wrapper };
}

/** Audio element play() was last called on. */
function lastPlayed(): HTMLAudioElement {
  return play.mock.contexts.at(-1) as HTMLAudioElement;
}

/** Source of the audio element play() was last called on. */
function lastPlayedSrc(): string {
  return lastPlayed().src;
}

beforeEach(() => {
  jest.clearAllMocks();
  play.mockResolvedValue(undefined);
});

describe("useAudioPlayer", () => {
  describe("play", () => {
    it("plays the given file", async () => {
      const { api } = factory();

      await api.play("https://cdn.test/word.mp3");

      expect(play).toHaveBeenCalledTimes(1);
      expect(lastPlayedSrc()).toBe("https://cdn.test/word.mp3");
      expect(api.hasError.value).toBe(false);
    });

    it("stops the previous file before playing the next one", async () => {
      const { api } = factory();

      await api.play("https://cdn.test/a.mp3");
      await api.play("https://cdn.test/b.mp3");

      expect(pause).toHaveBeenCalledTimes(1);
      expect(lastPlayedSrc()).toBe("https://cdn.test/b.mp3");
    });
  });

  describe("isPlaying", () => {
    it("is true while a file plays", async () => {
      const { api } = factory();

      await api.play("https://cdn.test/word.mp3");

      expect(api.isPlaying.value).toBe(true);
    });

    it("turns false when the file ends", async () => {
      const { api } = factory();
      await api.play("https://cdn.test/word.mp3");

      lastPlayed().dispatchEvent(new Event("ended"));

      expect(api.isPlaying.value).toBe(false);
    });

    it("stays true when a replaced file ends", async () => {
      const { api } = factory();
      await api.play("https://cdn.test/a.mp3");
      const first = lastPlayed();
      await api.play("https://cdn.test/b.mp3");

      first.dispatchEvent(new Event("ended"));

      expect(api.isPlaying.value).toBe(true);
    });

    it("turns false when the file cannot be played", async () => {
      play.mockRejectedValueOnce(new Error("NotSupportedError"));
      const { api } = factory();

      await api.play("https://cdn.test/missing.mp3");

      expect(api.isPlaying.value).toBe(false);
    });

    it("turns false when stopped", async () => {
      const { api } = factory();
      await api.play("https://cdn.test/word.mp3");

      api.stop();

      expect(api.isPlaying.value).toBe(false);
    });
  });

  describe("errors", () => {
    it("sets hasError when the file cannot be played", async () => {
      play.mockRejectedValueOnce(new Error("NotSupportedError"));
      const { api } = factory();

      await api.play("https://cdn.test/missing.mp3");

      expect(api.hasError.value).toBe(true);
    });

    it("resets hasError on the next play", async () => {
      play.mockRejectedValueOnce(new Error("NotSupportedError"));
      const { api } = factory();
      await api.play("https://cdn.test/missing.mp3");

      await api.play("https://cdn.test/word.mp3");

      expect(api.hasError.value).toBe(false);
    });

    it("ignores a failure caused by a newer play()", async () => {
      let rejectFirst!: (error: Error) => void;
      play.mockReturnValueOnce(
        new Promise<void>((_resolve, reject) => {
          rejectFirst = reject;
        }),
      );
      const { api } = factory();

      const first = api.play("https://cdn.test/a.mp3");
      await api.play("https://cdn.test/b.mp3");
      rejectFirst(new Error("AbortError"));
      await first;

      expect(api.hasError.value).toBe(false);
    });
  });

  describe("stop", () => {
    it("pauses the current file", async () => {
      const { api } = factory();
      await api.play("https://cdn.test/word.mp3");

      api.stop();

      expect(pause).toHaveBeenCalledTimes(1);
    });

    it("does nothing when nothing is playing", () => {
      factory().api.stop();

      expect(pause).not.toHaveBeenCalled();
    });

    it("stops the current file when the component is unmounted", async () => {
      const { api, wrapper } = factory();
      await api.play("https://cdn.test/word.mp3");

      wrapper.unmount();
      await flushPromises();

      expect(pause).toHaveBeenCalledTimes(1);
    });
  });
});

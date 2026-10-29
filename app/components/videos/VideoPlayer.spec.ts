/**
 * @file Unit tests for VideoPlayer.
 *
 * Covers:
 * - Embeds the YouTube video in privacy-enhanced mode, same-channel
 *   suggestions, JS API enabled for this origin
 * - Escapes the video id in the URL
 * - Titles the iframe for screen readers and allows fullscreen
 * - Emits "timeUpdate" as the video plays, exposes seekTo and pause
 */
import { nextTick, ref } from "vue";
import { mount } from "@vue/test-utils";
import { useYoutubePlayer } from "~/composables/useYoutubePlayer";
import VideoPlayer from "./VideoPlayer.vue";

// The composable loads YouTube's script: the player only needs its outputs.
jest.mock("~/composables/useYoutubePlayer");
const currentTime = ref(0);
const seekTo = jest.fn();
const pause = jest.fn();

/** Mounts VideoPlayer with a sample video; override per test. */
function factory(props: Partial<{ youtubeId: string; title: string }> = {}) {
  return mount(VideoPlayer, {
    props: { youtubeId: "abc123def45", title: "Une journée à Paris", ...props },
  });
}

const frame = (wrapper: ReturnType<typeof factory>) =>
  wrapper.get('[data-testid="video-player-frame"]');

const embedUrl = (wrapper: ReturnType<typeof factory>) =>
  new URL(frame(wrapper).attributes("src") ?? "");

beforeEach(() => {
  jest.clearAllMocks();
  currentTime.value = 0;
  jest.mocked(useYoutubePlayer).mockReturnValue({
    currentTime,
    seekTo,
    pause,
    isReady: ref(true),
    loadError: ref(null),
  });
});

describe("VideoPlayer", () => {
  describe("embed URL", () => {
    it("embeds the video from youtube-nocookie.com", () => {
      const url = embedUrl(factory());

      expect(`${url.origin}${url.pathname}`).toBe(
        "https://www.youtube-nocookie.com/embed/abc123def45",
      );
    });

    it("keeps suggestions to the same channel and enables the JS API for this origin", () => {
      const params = embedUrl(factory()).searchParams;

      expect(params.get("rel")).toBe("0");
      expect(params.get("enablejsapi")).toBe("1");
      expect(params.get("origin")).toBe(window.location.origin);
    });

    it("escapes the video id", () => {
      expect(embedUrl(factory({ youtubeId: "a/b?c" })).pathname).toBe("/embed/a%2Fb%3Fc");
    });
  });

  describe("accessibility", () => {
    it("titles the iframe with the video title", () => {
      expect(frame(factory()).attributes("title")).toBe("Une journée à Paris");
    });

    it("allows fullscreen", () => {
      expect(frame(factory()).attributes("allowfullscreen")).toBeDefined();
    });
  });

  describe("playback", () => {
    it('emits "timeUpdate" as the video plays', async () => {
      const wrapper = factory();

      currentTime.value = 14.2;
      await nextTick();

      expect(wrapper.emitted("timeUpdate")).toEqual([[14.2]]);
    });

    it("exposes seekTo to move the playback", () => {
      const wrapper = factory();

      (wrapper.vm as unknown as { seekTo: (seconds: number) => void }).seekTo(9);

      expect(seekTo).toHaveBeenCalledWith(9);
    });

    it("exposes pause to stop the playback", () => {
      const wrapper = factory();

      (wrapper.vm as unknown as { pause: () => void }).pause();

      expect(pause).toHaveBeenCalled();
    });
  });
});

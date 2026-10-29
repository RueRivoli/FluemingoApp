/**
 * @file Unit tests for useYoutubePlayer and loadYoutubeIframeApi.
 *
 * Covers:
 * - Loading: injects the API script once, reuses window.YT, keeps an existing
 *   ready callback, rejects (and allows a retry) when the script fails
 * - Player: attached to the iframe, currentTime polled once ready
 * - seekTo: seeks and plays once ready, ignored before
 * - pause: pauses once ready, ignored before
 * - loadError set when the API cannot load
 * - Cleanup: polling stopped and player destroyed on unmount
 */
import { defineComponent, h, ref } from "vue";
import { flushPromises, mount } from "@vue/test-utils";
import {
  loadYoutubeIframeApi,
  resetYoutubeIframeApiForTests,
  TIME_POLL_INTERVAL_MS,
  useYoutubePlayer,
  YOUTUBE_IFRAME_API_SRC,
  type UseYoutubePlayerReturn,
  type YoutubePlayer,
} from "./useYoutubePlayer";

const playerMock: jest.Mocked<YoutubePlayer> = {
  getCurrentTime: jest.fn(() => 0),
  seekTo: jest.fn(),
  playVideo: jest.fn(),
  pauseVideo: jest.fn(),
  destroy: jest.fn(),
};
let triggerReady: () => void = () => undefined;
const PlayerConstructor = jest.fn(
  (_frame: HTMLIFrameElement, options: { events: { onReady: () => void } }) => {
    triggerReady = options.events.onReady;
    return playerMock;
  },
);

/** Installs a fake window.YT, as if the API script had already run. */
function installApi() {
  window.YT = { Player: PlayerConstructor as unknown as NonNullable<typeof window.YT>["Player"] };
}

const scriptTags = () =>
  document.head.querySelectorAll(`script[src="${YOUTUBE_IFRAME_API_SRC}"]`);

/** Mounts a host component rendering an iframe and using the composable. */
function mountHost() {
  let api!: UseYoutubePlayerReturn;
  const Host = defineComponent({
    setup() {
      const frame = ref<HTMLIFrameElement | null>(null);
      api = useYoutubePlayer(frame);
      return () => h("iframe", { ref: frame });
    },
  });
  const wrapper = mount(Host);
  return { wrapper, api: () => api };
}

beforeEach(() => {
  jest.clearAllMocks();
  delete window.YT;
  delete window.onYouTubeIframeAPIReady;
  document.head.innerHTML = "";
  resetYoutubeIframeApiForTests();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("loadYoutubeIframeApi", () => {
  it("resolves at once when the API is already there", async () => {
    installApi();

    await expect(loadYoutubeIframeApi()).resolves.toBe(window.YT);
    expect(scriptTags()).toHaveLength(0);
  });

  it("injects the script once and resolves when YouTube calls back", async () => {
    const first = loadYoutubeIframeApi();
    const second = loadYoutubeIframeApi();

    expect(scriptTags()).toHaveLength(1);
    installApi();
    window.onYouTubeIframeAPIReady?.();

    await expect(first).resolves.toBe(window.YT);
    expect(second).toBe(first);
  });

  it("still calls a ready callback registered before", async () => {
    const previous = jest.fn();
    window.onYouTubeIframeAPIReady = previous;
    const loading = loadYoutubeIframeApi();

    installApi();
    window.onYouTubeIframeAPIReady?.();
    await loading;

    expect(previous).toHaveBeenCalled();
  });

  it("rejects when the script fails, and tries again next time", async () => {
    const loading = loadYoutubeIframeApi();
    (scriptTags()[0] as HTMLScriptElement).onerror?.(new Event("error"));

    await expect(loading).rejects.toThrow("could not be loaded");
    loadYoutubeIframeApi();
    expect(scriptTags()).toHaveLength(2);
  });
});

describe("useYoutubePlayer", () => {
  it("attaches a player to the iframe", async () => {
    installApi();
    const { wrapper } = mountHost();
    await flushPromises();

    expect(PlayerConstructor).toHaveBeenCalledWith(wrapper.element, expect.any(Object));
  });

  it("polls the current time once the player is ready", async () => {
    jest.useFakeTimers();
    installApi();
    const { api } = mountHost();
    await flushPromises();

    playerMock.getCurrentTime.mockReturnValue(12.5);
    triggerReady();
    expect(api().isReady.value).toBe(true);
    expect(api().currentTime.value).toBe(12.5);

    playerMock.getCurrentTime.mockReturnValue(13);
    jest.advanceTimersByTime(TIME_POLL_INTERVAL_MS);
    expect(api().currentTime.value).toBe(13);
  });

  it("seeks and plays from the given time once ready", async () => {
    installApi();
    const { api } = mountHost();
    await flushPromises();
    triggerReady();

    api().seekTo(42);

    expect(playerMock.seekTo).toHaveBeenCalledWith(42, true);
    expect(playerMock.playVideo).toHaveBeenCalled();
    expect(api().currentTime.value).toBe(42);
  });

  it("ignores seekTo before the player is ready", async () => {
    installApi();
    const { api } = mountHost();
    await flushPromises();

    api().seekTo(42);

    expect(playerMock.seekTo).not.toHaveBeenCalled();
  });

  it("pauses the video once ready", async () => {
    installApi();
    const { api } = mountHost();
    await flushPromises();
    triggerReady();

    api().pause();

    expect(playerMock.pauseVideo).toHaveBeenCalled();
  });

  it("ignores pause before the player is ready", async () => {
    installApi();
    const { api } = mountHost();
    await flushPromises();

    api().pause();

    expect(playerMock.pauseVideo).not.toHaveBeenCalled();
  });

  it("reports an API that cannot load", async () => {
    const { api } = mountHost();
    (scriptTags()[0] as HTMLScriptElement).onerror?.(new Event("error"));
    await flushPromises();

    expect(api().loadError.value?.message).toContain("could not be loaded");
  });

  it("stops polling and destroys the player on unmount", async () => {
    jest.useFakeTimers();
    installApi();
    const { wrapper } = mountHost();
    await flushPromises();
    triggerReady();

    wrapper.unmount();
    playerMock.getCurrentTime.mockClear();
    jest.advanceTimersByTime(TIME_POLL_INTERVAL_MS * 4);

    expect(playerMock.destroy).toHaveBeenCalled();
    expect(playerMock.getCurrentTime).not.toHaveBeenCalled();
  });
});

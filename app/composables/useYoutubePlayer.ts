import { onBeforeUnmount, onMounted, ref, type Ref } from "vue";

/** YouTube IFrame Player API script; it calls window.onYouTubeIframeAPIReady once loaded. */
export const YOUTUBE_IFRAME_API_SRC = "https://www.youtube.com/iframe_api";
/** How often the current time is read while the page is open. */
export const TIME_POLL_INTERVAL_MS = 250;

/** The part of a YT.Player this app uses. */
export interface YoutubePlayer {
  getCurrentTime: () => number;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  destroy: () => void;
}

/** The part of the global YT namespace this app uses. */
export interface YoutubeIframeApi {
  Player: new (
    frame: HTMLIFrameElement,
    options: { events: { onReady: () => void } },
  ) => YoutubePlayer;
}

declare global {
  interface Window {
    YT?: YoutubeIframeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<YoutubeIframeApi> | null = null;

/**
 * Loads the YouTube IFrame Player API once for the whole app.
 * @returns The YT namespace, once ready
 */
export function loadYoutubeIframeApi(): Promise<YoutubeIframeApi> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve, reject) => {
    // Keep any callback another script registered before us.
    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousReady?.();
      if (window.YT) resolve(window.YT);
    };
    const script = document.createElement("script");
    script.src = YOUTUBE_IFRAME_API_SRC;
    script.async = true;
    script.onerror = () => {
      // Allow a later page to try again.
      apiPromise = null;
      reject(new Error("The YouTube player API could not be loaded."));
    };
    document.head.appendChild(script);
  });
  return apiPromise;
}

/** Forgets the loading state; for tests only. */
export function resetYoutubeIframeApiForTests(): void {
  apiPromise = null;
}

export interface UseYoutubePlayerReturn {
  /** Current time of the video in seconds, refreshed every TIME_POLL_INTERVAL_MS */
  currentTime: Ref<number>;
  /** The player answers to seekTo */
  isReady: Ref<boolean>;
  /** Set when the YouTube API could not be loaded: the video still plays, without sync */
  loadError: Ref<Error | null>;
  /** Jumps to a time and plays from there; ignored until the player is ready */
  seekTo: (seconds: number) => void;
  /** Pauses the video; ignored until the player is ready */
  pause: () => void;
}

/**
 * Drives a YouTube embed (its src must contain enablejsapi=1): follows its
 * current time and lets the page jump to a moment.
 * @param frame - Template ref of the YouTube iframe
 */
export function useYoutubePlayer(
  frame: Ref<HTMLIFrameElement | null>,
): UseYoutubePlayerReturn {
  const currentTime = ref(0);
  const isReady = ref(false);
  const loadError = ref<Error | null>(null);

  let player: YoutubePlayer | null = null;
  let pollTimer: ReturnType<typeof setInterval> | null = null;
  let isUnmounted = false;

  function readTime() {
    if (player) currentTime.value = player.getCurrentTime();
  }

  function handleReady() {
    isReady.value = true;
    readTime();
    pollTimer = setInterval(readTime, TIME_POLL_INTERVAL_MS);
  }

  async function attach() {
    if (!frame.value) return;
    try {
      const api = await loadYoutubeIframeApi();
      // The page may have been left while the script was loading.
      if (isUnmounted || !frame.value) return;
      player = new api.Player(frame.value, { events: { onReady: handleReady } });
    } catch (error) {
      loadError.value = error instanceof Error ? error : new Error(String(error));
    }
  }

  function seekTo(seconds: number) {
    if (!player || !isReady.value) return;
    player.seekTo(seconds, true);
    player.playVideo();
    // Highlight the new line at once, without waiting for the next poll.
    currentTime.value = seconds;
  }

  function pause() {
    if (player && isReady.value) player.pauseVideo();
  }

  onMounted(attach);

  onBeforeUnmount(() => {
    isUnmounted = true;
    if (pollTimer) clearInterval(pollTimer);
    player?.destroy();
    player = null;
  });

  return { currentTime, isReady, loadError, seekTo, pause };
}

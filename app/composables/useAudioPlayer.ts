import { onBeforeUnmount, ref, type Ref } from "vue";

export interface UseAudioPlayerReturn {
  /** A file is playing, until it ends, fails or is stopped */
  isPlaying: Ref<boolean>;
  /** The last file could not be played (missing file, blocked playback…) */
  hasError: Ref<boolean>;
  /** Plays an audio file, cutting off whatever was playing */
  play: (src: string) => Promise<void>;
  /** Stops the current file, if any */
  stop: () => void;
}

/**
 * Plays short audio files one at a time, e.g. the pronunciation of a
 * vocabulary word: clicking another word stops the previous one.
 */
export function useAudioPlayer(): UseAudioPlayerReturn {
  const isPlaying = ref(false);
  const hasError = ref(false);
  let current: HTMLAudioElement | null = null;

  function stop() {
    isPlaying.value = false;
    if (!current) return;
    current.pause();
    current = null;
  }

  async function play(src: string) {
    stop();
    hasError.value = false;
    const audio = new Audio(src);
    current = audio;
    audio.addEventListener("ended", () => {
      if (current === audio) stop();
    });
    isPlaying.value = true;
    try {
      await audio.play();
    } catch {
      // A newer play() interrupts this one: not an error for the user.
      if (current !== audio) return;
      hasError.value = true;
      stop();
    }
  }

  onBeforeUnmount(stop);

  return { isPlaying, hasError, play, stop };
}

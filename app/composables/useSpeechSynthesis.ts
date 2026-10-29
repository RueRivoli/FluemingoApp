import { onBeforeUnmount, ref, type Ref } from "vue";

export interface SpeakOptions {
  /** BCP 47 language of the text, e.g. "fr-FR" */
  language: string;
  /** Speed, 1 = normal; below 1 is slower */
  rate?: number;
}

export interface UseSpeechSynthesisReturn {
  /** The browser can read text aloud */
  isSupported: Ref<boolean>;
  /** Reads a text aloud, cutting off whatever was being read; ignored when unsupported */
  speak: (text: string, options: SpeakOptions) => void;
}

/**
 * Reads words aloud with the browser's speech synthesis, so the learner hears
 * any word of a transcript even without a recorded audio file.
 */
export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const isSupported = ref(
    typeof window !== "undefined" &&
      "speechSynthesis" in window &&
      typeof window.SpeechSynthesisUtterance === "function",
  );

  function speak(text: string, { language, rate = 1 }: SpeakOptions) {
    if (!isSupported.value || !text.trim()) return;
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = rate;
    // Clicking quickly from word to word should not queue the readings.
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  onBeforeUnmount(() => {
    if (isSupported.value) window.speechSynthesis.cancel();
  });

  return { isSupported, speak };
}

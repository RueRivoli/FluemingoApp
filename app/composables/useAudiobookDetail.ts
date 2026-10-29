import { ref, type Ref } from "vue";
import * as audiobookService from "~/services/audiobookService";
import type { AudiobookChapter, AudiobookInfo } from "~/types/audiobook";

export interface UseAudiobookDetailReturn {
  /** Audiobook shown in the modal; kept after closing so the content does not vanish during the close */
  selectedAudiobook: Ref<AudiobookInfo | null>;
  /** Whether the modal is open */
  isOpen: Ref<boolean>;
  /** Chapters of the selected audiobook */
  chapters: Ref<AudiobookChapter[]>;
  /** The chapters are being fetched */
  isLoadingChapters: Ref<boolean>;
  /** The last fetch of the chapters failed */
  hasChaptersError: Ref<boolean>;
  /** Opens the modal on an audiobook and loads its chapters */
  open: (audiobook: AudiobookInfo) => Promise<void>;
}

/**
 * State of the audiobook detail modal: which audiobook is open and its chapters.
 *
 * @example
 * const { selectedAudiobook, isOpen, chapters, open } = useAudiobookDetail()
 * <AudiobookCard @select="open(audiobook)" />
 */
export function useAudiobookDetail(): UseAudiobookDetailReturn {
  const selectedAudiobook = ref<AudiobookInfo | null>(null);
  const isOpen = ref(false);
  const chapters = ref<AudiobookChapter[]>([]);
  const isLoadingChapters = ref(false);
  const hasChaptersError = ref(false);

  async function open(audiobook: AudiobookInfo) {
    selectedAudiobook.value = audiobook;
    isOpen.value = true;
    chapters.value = [];
    hasChaptersError.value = false;
    isLoadingChapters.value = true;
    try {
      const loaded = await audiobookService.getAudiobookChapters(audiobook.id);
      // Another audiobook was opened meanwhile: its own call fills the list.
      if (selectedAudiobook.value?.id !== audiobook.id) return;
      chapters.value = loaded;
    } catch (error) {
      if (selectedAudiobook.value?.id !== audiobook.id) return;
      // The modal shows the error state; the details stay useful without chapters.
      hasChaptersError.value = true;
      console.error("Could not load the audiobook chapters", error);
    } finally {
      if (selectedAudiobook.value?.id === audiobook.id) isLoadingChapters.value = false;
    }
  }

  return { selectedAudiobook, isOpen, chapters, isLoadingChapters, hasChaptersError, open };
}

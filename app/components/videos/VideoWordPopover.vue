<script setup lang="ts">
/**
 * VideoWordPopover — pop-up anchored to a clicked word of the subtitles
 * (Figma WordDefinitionPopover). PrimeVue Popover places it next to the word
 * with a caret, closes it on outside click or Escape and traps the focus;
 * the content is VideoWordDefinition, whose buttons read the word aloud,
 * followed by the word's translations from the dictionary and the actions
 * (add to flashcards, retranslate, report an error). Without the dictionary
 * (contextual mode) only the transcript's translation is shown.
 *
 * @example
 * <VideoWordPopover ref="popover" @show="pauseVideo" />
 * popover.value?.open(wordButton, definition)
 */
import { nextTick, ref } from "vue";
import Popover from "primevue/popover";
import VideoWordActions from "~/components/videos/VideoWordActions.vue";
import VideoWordDefinition from "~/components/videos/VideoWordDefinition.vue";
import VideoWordDictionary from "~/components/videos/VideoWordDictionary.vue";
import { useSpeechSynthesis } from "~/composables/useSpeechSynthesis";
import { useWordTranslations } from "~/composables/useWordTranslations";
import type { WordDefinition } from "~/types/video";

interface Props {
  /** BCP 47 language of the words, for the pronunciation */
  language?: string;
  /** Looks the word up in the dictionary; off when the transcript's translation is enough */
  withDictionary?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  language: "fr-FR",
  withDictionary: true,
});

const emit = defineEmits<{
  /** Fired when the pop-up opens */
  show: [];
  /** Fired when the pop-up closes */
  hide: [];
  /** "Add to flashcards" was clicked for this word */
  addToFlashcards: [word: WordDefinition];
  /** The learner reported a wrong definition or translation for this word */
  reportError: [word: WordDefinition];
}>();

/** Speed of the snail button. */
const SLOW_SPEECH_RATE = 0.6;

// Figma card: rounded 20, warm border, soft shadow, roomy padding.
const POPOVER_TOKENS = {
  root: {
    borderRadius: "20px",
    borderColor: "var(--color-word-border)",
    shadow: "0 16px 40px rgb(20 20 26 / 14%), 0 2px 6px rgb(20 20 26 / 6%)",
    gutter: "12px",
  },
  content: { padding: "18px 20px 16px" },
} as const;

const { isSupported: canListen, speak } = useSpeechSynthesis();
const {
  translations: dictionary,
  isLoading: isDictionaryLoading,
  hasError: hasDictionaryError,
  lookup,
} = useWordTranslations();

const popover = ref<InstanceType<typeof Popover> | null>(null);
const word = ref<WordDefinition | null>(null);
const isOpen = ref(false);
// Reset for each opened word: the report is about the word shown.
const isReported = ref(false);

/**
 * Shows the definition of a word next to the element that was clicked.
 * @param target - The clicked word, the pop-up points at it
 * @param definition - What to show
 */
async function open(target: HTMLElement, definition: WordDefinition) {
  word.value = definition;
  isReported.value = false;
  if (props.withDictionary) void lookup(definition);
  // Popover.show() on an open pop-up does not move it: close it first so it
  // is placed again next to the new word.
  if (isOpen.value) {
    popover.value?.hide();
    await nextTick();
  }
  popover.value?.show({ currentTarget: target } as unknown as Event, target);
}

function close() {
  popover.value?.hide();
}

function listen(slow: boolean) {
  if (!word.value) return;
  speak(word.value.text, {
    language: props.language,
    rate: slow ? SLOW_SPEECH_RATE : 1,
  });
}

function retranslate() {
  if (word.value) void lookup(word.value, { force: true });
}

function addToFlashcards() {
  if (word.value) emit("addToFlashcards", word.value);
}

function reportError() {
  if (!word.value) return;
  isReported.value = true;
  emit("reportError", word.value);
}

function handleShow() {
  isOpen.value = true;
  emit("show");
}

function handleHide() {
  isOpen.value = false;
  emit("hide");
}

// The panel opens it from a click on a word: a method fits a one-off command.
defineExpose({ open, close });
</script>

<template>
  <Popover
    ref="popover"
    :dt="POPOVER_TOKENS"
    :aria-label="word ? `Definition of “${word.text}”` : undefined"
    data-testid="video-word-popover"
    @show="handleShow"
    @hide="handleHide"
  >
    <VideoWordDefinition v-if="word" :word="word" :can-listen="canListen" @listen="listen">
      <VideoWordDictionary
        v-if="withDictionary"
        :translations="dictionary"
        :loading="isDictionaryLoading"
        :has-error="hasDictionaryError"
        :known-translation="word.translation"
      />
      <VideoWordActions
        :can-retranslate="withDictionary"
        :retranslating="isDictionaryLoading"
        :reported="isReported"
        @add-to-flashcards="addToFlashcards"
        @retranslate="retranslate"
        @report-error="reportError"
      />
    </VideoWordDefinition>
  </Popover>
</template>

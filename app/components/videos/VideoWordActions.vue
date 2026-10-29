<script setup lang="ts">
/**
 * VideoWordActions — actions at the bottom of the word pop-up of the subtitles
 * (Figma WordDefinitionPopover): "Add to flashcards", then the "Retranslate"
 * and "Report an error" links. It only emits: the parent decides what each does.
 *
 * @example
 * <VideoWordActions :retranslating="isLoading" @retranslate="lookupAgain" @report-error="report" />
 */
interface Props {
  /** Shows the "Retranslate" link (it asks the dictionary again) */
  canRetranslate?: boolean;
  /** The translation is being fetched again: the link is disabled */
  retranslating?: boolean;
  /** The error was reported: the link thanks the learner and is disabled */
  reported?: boolean;
}

withDefaults(defineProps<Props>(), {
  canRetranslate: true,
  retranslating: false,
  reported: false,
});

const emit = defineEmits<{
  /** "Add to flashcards" was clicked */
  addToFlashcards: [];
  /** "Retranslate" was clicked */
  retranslate: [];
  /** "Report an error" was clicked */
  reportError: [];
}>();

const ICONS = {
  add: "/img/icons/word-popover/plus.svg",
  retranslate: "/img/icons/word-popover/refresh.svg",
  report: "/img/icons/word-popover/flag.svg",
} as const;
</script>

<template>
  <div class="video-word-actions" data-testid="video-word-actions">
    <button
      type="button"
      class="video-word-actions__add"
      data-testid="video-word-actions-add"
      @click="emit('addToFlashcards')"
    >
      <NuxtImg :src="ICONS.add" alt="" width="20" height="20" />
      Add to flashcards
    </button>

    <div class="video-word-actions__links">
      <button
        v-if="canRetranslate"
        type="button"
        class="video-word-actions__link"
        :disabled="retranslating"
        :aria-busy="retranslating"
        data-testid="video-word-actions-retranslate"
        @click="emit('retranslate')"
      >
        <NuxtImg :src="ICONS.retranslate" alt="" width="15" height="15" />
        Retranslate
      </button>
      <button
        type="button"
        class="video-word-actions__link"
        :disabled="reported"
        data-testid="video-word-actions-report"
        @click="emit('reportError')"
      >
        <NuxtImg :src="ICONS.report" alt="" width="15" height="15" />
        {{ reported ? "Thanks for the report" : "Report an error" }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.video-word-actions {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.video-word-actions__add {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 46px;
  border: none;
  border-radius: 14px;
  background-color: var(--color-secondary);
  color: var(--color-text-primary);
  font-family: inherit;
  font-size: 15px;
  font-weight: 600;
  line-height: 20px;
  cursor: pointer;
  transition: filter 0.15s ease;
}

.video-word-actions__links {
  display: flex;
  gap: 24px;
  justify-content: center;
}

.video-word-actions__link {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 0;
  border: none;
  background: none;
  color: var(--color-word-text);
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  line-height: 16px;
  cursor: pointer;
}

.video-word-actions__add:hover {
  filter: brightness(0.96);
}

.video-word-actions__link:hover:not(:disabled) {
  color: var(--color-text-primary);
}

.video-word-actions__link:disabled {
  cursor: default;
  opacity: 0.6;
}

.video-word-actions__add:focus-visible,
.video-word-actions__link:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>

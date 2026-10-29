<script setup lang="ts">
/**
 * VocabularyCard — one vocabulary entry: word, grammatical tag and audio
 * button, the translation below, and a bookmark to save the word to the
 * user's flashcards (Figma VocabularyItemCard). Buttons are PrimeVue Buttons.
 *
 * @example
 * <VocabularyCard
 *   v-model:saved="isSaved"
 *   word="être blessé"
 *   type="v"
 *   translation="to be injured"
 *   has-audio
 *   :is-playing="isPlaying"
 *   @play-audio="play"
 * />
 */
import { computed } from "vue";
import Button from "primevue/button";

interface Props {
  /** Word or expression in the learned language */
  word: string;
  /** Grammatical tag, e.g. "nf" */
  type?: string | null;
  /** Translation in the user's language */
  translation?: string | null;
  /** Shows the pronunciation button */
  hasAudio?: boolean;
  /** The pronunciation is playing: the audio icon is coloured */
  isPlaying?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: null,
  translation: null,
  hasAudio: false,
  isPlaying: false,
});

const emit = defineEmits<{
  /** Fired when the pronunciation button is clicked */
  playAudio: [];
}>();

/** Whether the word is saved to the user's flashcards */
const isSaved = defineModel<boolean>("saved", { default: false });

// Button's icon prop renders a plain span: pass-through hides it from screen
// readers, the button's aria-label already names the action.
const AUDIO_PASS_THROUGH = {
  icon: { "aria-hidden": "true", "data-testid": "vocabulary-card-audio-icon" },
} as const;

const audioLabel = computed(() => `Listen to "${props.word}"`);

const audioIcon = computed(() =>
  props.isPlaying
    ? "fa-solid fa-circle-waveform-lines"
    : "fa-light fa-circle-waveform-lines",
);

const saveLabel = computed(() =>
  isSaved.value
    ? `Remove "${props.word}" from flashcards`
    : `Save "${props.word}" to flashcards`,
);
</script>

<template>
  <div class="vocabulary-card" data-testid="vocabulary-card">
    <div class="vocabulary-card__text">
      <div class="vocabulary-card__word-row">
        <span
          class="vocabulary-card__word"
          data-testid="vocabulary-card-word"
          >{{ word }}</span
        >
        <span
          v-if="type"
          class="vocabulary-card__type"
          data-testid="vocabulary-card-type"
        >
          {{ type }}
        </span>
        <Button
          v-if="hasAudio"
          :class="[
            'vocabulary-card__audio',
            { 'vocabulary-card__audio--playing': isPlaying },
          ]"
          :icon="audioIcon"
          text
          rounded
          :aria-label="audioLabel"
          :pt="AUDIO_PASS_THROUGH"
          data-testid="vocabulary-card-audio"
          @click="emit('playAudio')"
        />
      </div>
      <span
        v-if="translation"
        class="vocabulary-card__translation"
        data-testid="vocabulary-card-translation"
      >
        {{ translation }}
      </span>
    </div>
    <Button
      class="vocabulary-card__save"
      text
      :aria-label="saveLabel"
      :aria-pressed="isSaved"
      data-testid="vocabulary-card-save"
      @click="isSaved = !isSaved"
    >
      <span
        :class="isSaved ? 'fa-solid fa-bookmark' : 'fa-thin fa-bookmark-plus'"
        aria-hidden="true"
        data-testid="vocabulary-card-save-icon"
      />
    </Button>
  </div>
</template>

<style scoped>
.vocabulary-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px 10px 12px;
  border: 1px solid #a1a1a1;
  border-radius: 12px;
  background-color: var(--color-bg);
}

.vocabulary-card__text {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.vocabulary-card__word-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.vocabulary-card__word {
  color: var(--color-text-primary);
  font-size: 18px;
  font-weight: 500;
  line-height: 24px;
}

.vocabulary-card__type {
  color: #9e9e9e;
  font-size: 14px;
  font-style: italic;
  font-weight: 300;
}

.vocabulary-card__translation {
  color: #727272;
  font-size: 16px;
  line-height: 22px;
}

/* Reset PrimeVue's text button so only the icon shows, in the text colour. */
.vocabulary-card__audio,
.vocabulary-card__save {
  flex-shrink: 0;
  padding: 0;
  border: none;
  color: var(--color-text-primary);
}

.vocabulary-card__audio {
  width: 26px;
  height: 26px;
  font-size: 24px;
}

.vocabulary-card__audio :deep(.p-button-icon) {
  font-size: inherit;
}

.vocabulary-card__audio--playing {
  color: var(--color-primary-dark);
}

.vocabulary-card__save {
  width: 40px;
  height: 40px;
  font-size: 26px;
}
</style>

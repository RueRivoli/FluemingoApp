<script setup lang="ts">
/**
 * VocabularyItemCard — one word of a flashcard deck (Figma
 * VocabularyItemCard): the word, its grammatical tag and pronunciation
 * button, the translation, the base form when it differs (↳ touriste), and a
 * badge showing the deck the word is in, in the deck's color.
 *
 * @example
 * <VocabularyItemCard
 *   word="Des dizaines de touristes"
 *   translation="Dozens of tourists"
 *   basis="touriste"
 *   status="saved"
 *   has-audio
 *   :is-playing="isPlaying"
 *   @play-audio="play"
 * />
 */
import { computed } from "vue";
import type { FlashcardStatus } from "~/utils/flashcardDecks";

interface Props {
  /** Word or expression in the learned language */
  word: string;
  /** Grammatical tag, e.g. "nf" */
  type?: string | null;
  /** Translation in the user's language */
  translation?: string | null;
  /** Base form; shown only when it differs from the word */
  basis?: string | null;
  /** Deck the word is in; sets the badge */
  status: FlashcardStatus;
  /** Shows the pronunciation button */
  hasAudio?: boolean;
  /** The pronunciation is playing: the audio button is highlighted */
  isPlaying?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: null,
  translation: null,
  basis: null,
  hasAudio: false,
  isPlaying: false,
});

const emit = defineEmits<{
  /** Fired when the pronunciation button is clicked */
  playAudio: [];
}>();

const ICONS = {
  audio: "/img/icons/vocabulary/audio-lines.svg",
  baseForm: "/img/icons/vocabulary/corner-down-right.svg",
} as const;

/** Badge of each deck: a Font Awesome glyph, colored by the deck's modifier class. */
const BADGES = {
  saved: { label: "Saved", icon: "fa-solid fa-bookmark" },
  difficult: { label: "Difficult", icon: "fa-solid fa-triangle-exclamation" },
  training: { label: "In training", icon: "fa-regular fa-dumbbell" },
  mastered: { label: "Mastered", icon: "fa-regular fa-badge-check" },
} as const satisfies Record<FlashcardStatus, { label: string; icon: string }>;

const badge = computed(() => BADGES[props.status]);

const baseForm = computed(() => {
  const { basis, word } = props;
  return basis && basis.toLowerCase() !== word.toLowerCase() ? basis : null;
});

const audioLabel = computed(() => `Listen to "${props.word}"`);
</script>

<template>
  <article class="vocabulary-item-card" data-testid="vocabulary-item-card">
    <div class="vocabulary-item-card__text">
      <div class="vocabulary-item-card__word-row">
        <span class="vocabulary-item-card__word" data-testid="vocabulary-item-card-word">
          {{ word }}
        </span>
        <span v-if="type" class="vocabulary-item-card__type" data-testid="vocabulary-item-card-type">
          {{ type }}
        </span>
        <button
          v-if="hasAudio"
          type="button"
          :class="[
            'vocabulary-item-card__audio',
            { 'vocabulary-item-card__audio--playing': isPlaying },
          ]"
          :aria-label="audioLabel"
          :aria-pressed="isPlaying"
          data-testid="vocabulary-item-card-audio"
          @click="emit('playAudio')"
        >
          <NuxtImg :src="ICONS.audio" alt="" width="14" height="14" />
        </button>
      </div>
      <p
        v-if="translation"
        class="vocabulary-item-card__translation"
        data-testid="vocabulary-item-card-translation"
      >
        {{ translation }}
      </p>
      <p
        v-if="baseForm"
        class="vocabulary-item-card__base-form"
        data-testid="vocabulary-item-card-base-form"
      >
        <NuxtImg :src="ICONS.baseForm" alt="" width="16" height="16" />
        {{ baseForm }}
      </p>
    </div>

    <span
      :class="['vocabulary-item-card__badge', `vocabulary-item-card__badge--${status}`]"
      role="img"
      :aria-label="badge.label"
      data-testid="vocabulary-item-card-badge"
    >
      <span :class="badge.icon" aria-hidden="true" data-testid="vocabulary-item-card-badge-icon" />
    </span>
  </article>
</template>

<style scoped>
.vocabulary-item-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 12px 14px 18px;
  border: 1px solid var(--color-word-border);
  border-radius: 14px;
  background-color: var(--color-bg);
}

.vocabulary-item-card__text {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

/* Wraps so a long expression never pushes the audio button out of the card. */
.vocabulary-item-card__word-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2px 8px;
}

.vocabulary-item-card__word {
  color: var(--color-text-primary);
  font-size: 17px;
  font-weight: 500;
  line-height: 24px;
}

.vocabulary-item-card__type {
  color: var(--color-word-text-faint);
  font-size: 14px;
  font-style: italic;
  line-height: 18px;
}

.vocabulary-item-card__audio {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 1.5px solid var(--color-text-primary);
  border-radius: 50%;
  background: none;
  cursor: pointer;
}

.vocabulary-item-card__audio--playing {
  border-color: var(--color-primary-dark);
  background-color: var(--color-word-accent);
}

.vocabulary-item-card__audio:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.vocabulary-item-card__translation {
  margin: 0;
  color: var(--color-word-text-faint);
  font-size: 15px;
  line-height: 20px;
}

.vocabulary-item-card__base-form {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  color: var(--color-text-primary);
  font-size: 15px;
  font-weight: 500;
  line-height: 20px;
}

.vocabulary-item-card__badge {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  font-size: 18px;
}

.vocabulary-item-card__badge--saved {
  background-color: var(--color-primary-pastel);
  color: var(--color-primary);
}

.vocabulary-item-card__badge--difficult {
  background-color: var(--color-danger-pastel);
  color: var(--color-danger);
}

/* Icon darkened towards the text color: the bright yellow is unreadable on its pastel. */
.vocabulary-item-card__badge--training {
  background-color: var(--color-secondary-pastel);
  color: color-mix(in srgb, var(--color-secondary) 70%, var(--color-text-primary));
}

.vocabulary-item-card__badge--mastered {
  background-color: color-mix(in srgb, var(--color-success) 18%, var(--color-bg));
  color: var(--color-success);
}
</style>

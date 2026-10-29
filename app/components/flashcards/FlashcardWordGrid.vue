<script setup lang="ts">
/**
 * FlashcardWordGrid — the words of one flashcard deck, as a grid of
 * VocabularyItemCard (Figma "Flashcards group page"), or a message when the
 * deck is empty.
 *
 * @example
 * <FlashcardWordGrid
 *   :words="words"
 *   status="saved"
 *   :playing-id="playingWordId"
 *   @play-audio="play"
 * />
 */
import VocabularyItemCard from "~/components/content/VocabularyItemCard.vue";
import type { FlashcardStatus } from "~/utils/flashcardDecks";
import type { VocabularyItem } from "~/types/vocabulary";

interface Props {
  /** Words of the deck */
  words: readonly VocabularyItem[];
  /** Deck the words are in; sets the badge of every card */
  status: FlashcardStatus;
  /** Id of the word whose pronunciation is playing; null when none */
  playingId?: number | null;
}

withDefaults(defineProps<Props>(), {
  playingId: null,
});

const emit = defineEmits<{
  /** Fired when a word's audio button is clicked */
  playAudio: [word: VocabularyItem];
}>();
</script>

<template>
  <ul v-if="words.length > 0" class="flashcard-word-grid" data-testid="flashcard-word-grid">
    <li v-for="word in words" :key="word.id">
      <VocabularyItemCard
        :word="word.text"
        :type="word.type"
        :translation="word.translation"
        :basis="word.basis"
        :status="status"
        :has-audio="Boolean(word.audioUrl)"
        :is-playing="word.id === playingId"
        @play-audio="emit('playAudio', word)"
      />
    </li>
  </ul>
  <p v-else class="flashcard-word-grid__empty" data-testid="flashcard-word-grid-empty">
    No words in this deck yet.
  </p>
</template>

<style scoped>
/* Columns, not a grid: each card sits right under the previous one, so a tall
   card (base form, long word) leaves no gap under its row neighbours. */
.flashcard-word-grid {
  columns: 320px;
  column-gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.flashcard-word-grid > li {
  break-inside: avoid;
  margin-bottom: 12px;
}

.flashcard-word-grid__empty {
  margin: 0;
  padding: 40px 0;
  color: var(--color-text-light);
  font-size: 15px;
  text-align: center;
}
</style>

<script setup lang="ts">
/**
 * FlashcardDeckCard — one flashcard deck of the Flashcards page: icon, name,
 * subtitle and expression count on the left, illustration on a colored panel
 * with a curved edge on the right (Figma FlashcardDeckCard, mobile deck list).
 * The colors follow the status.
 *
 * @example
 * <FlashcardDeckCard
 *   status="difficult"
 *   title="Oops"
 *   subtitle="Difficult vocabulary"
 *   icon="fa-regular fa-triangle-exclamation"
 *   image-url="/img/flashcards/difficult.png"
 *   :count="3"
 * />
 */
import { computed } from "vue";
import { expressionsLabel, type FlashcardStatus } from "~/utils/flashcardDecks";

interface Props {
  /** Status of the deck; sets the colors */
  status: FlashcardStatus;
  /** Deck name */
  title: string;
  /** One-line explanation below the name */
  subtitle: string;
  /** Font Awesome classes of the icon before the name */
  icon: string;
  /** Illustration shown on the colored panel */
  imageUrl: string;
  /** Number of expressions in the deck; a dash while unknown */
  count?: number | null;
}

const props = withDefaults(defineProps<Props>(), {
  count: null,
});

const PLACEHOLDER_COUNT = "–";

const displayedCount = computed(() => props.count ?? PLACEHOLDER_COUNT);
// Plural while the count is unknown: "– Expressions".
const countLabel = computed(() => expressionsLabel(props.count ?? 0));
</script>

<template>
  <article
    :class="['flashcard-deck-card', `flashcard-deck-card--${status}`]"
    data-testid="flashcard-deck-card"
  >
    <div class="flashcard-deck-card__content">
      <h3 class="flashcard-deck-card__title">
        <span
          :class="['flashcard-deck-card__icon', icon]"
          aria-hidden="true"
          data-testid="flashcard-deck-card-icon"
        />
        <span data-testid="flashcard-deck-card-title">{{ title }}</span>
      </h3>
      <p class="flashcard-deck-card__subtitle" data-testid="flashcard-deck-card-subtitle">
        {{ subtitle }}
      </p>
      <p class="flashcard-deck-card__count" data-testid="flashcard-deck-card-count">
        <span class="flashcard-deck-card__count-number">{{ displayedCount }}</span>
        {{ countLabel }}
      </p>
    </div>

    <div class="flashcard-deck-card__panel" aria-hidden="true">
      <!-- Stretched to the panel; the curve is the left edge of the shape. -->
      <svg
        class="flashcard-deck-card__shape"
        viewBox="0 0 210 164"
        preserveAspectRatio="none"
      >
        <path d="M0 0H210V164H32C14 118 22 42 0 0Z" />
      </svg>
      <NuxtImg
        :src="imageUrl"
        alt=""
        width="72"
        height="72"
        class="flashcard-deck-card__image"
        data-testid="flashcard-deck-card-image"
      />
    </div>
  </article>
</template>

<style scoped>
/* Panel colors match the illustrations' backgrounds so they blend in. */
.flashcard-deck-card--saved {
  --deck-color: #849bff;
  --deck-accent: #849bff;
}

.flashcard-deck-card--difficult {
  --deck-color: #ef3a5d;
  --deck-accent: #ef3a5d;
}

.flashcard-deck-card--training {
  --deck-color: #ffde59;
  /* Darker yellow: the bright one is unreadable on white. */
  --deck-accent: #d9b92f;
}

.flashcard-deck-card--mastered {
  --deck-color: #55ad61;
  --deck-accent: #55ad61;
}

.flashcard-deck-card {
  position: relative;
  display: flex;
  min-height: 104px;
  overflow: hidden;
  border: 1px solid var(--deck-accent);
  border-radius: 12px;
  background-color: var(--color-bg);
}

.flashcard-deck-card__content {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  min-width: 0;
  padding: 12px 16px;
}

.flashcard-deck-card__title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  color: var(--color-text-primary);
  font-size: 18px;
  font-weight: 600;
  line-height: 24px;
}

.flashcard-deck-card__icon {
  color: var(--deck-accent);
  font-size: 15px;
}

.flashcard-deck-card__subtitle {
  margin: 0;
  color: var(--color-text-light);
  font-size: 13px;
  line-height: 18px;
}

.flashcard-deck-card__count {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
  margin: 8px 0 0;
  padding: 2px 10px;
  border: 1px solid var(--deck-accent);
  border-radius: 8px;
  background-color: color-mix(in srgb, var(--deck-color) 15%, var(--color-bg));
  color: var(--color-text-light);
  font-size: 12px;
}

.flashcard-deck-card__count-number {
  color: var(--color-text-primary);
  font-size: 15px;
  font-weight: 500;
}

.flashcard-deck-card__panel {
  position: relative;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 120px;
  padding-left: 18px;
}

.flashcard-deck-card__shape {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  fill: var(--deck-color);
}

.flashcard-deck-card__image {
  position: relative;
  width: 72px;
  height: 72px;
  object-fit: cover;
}
</style>

<script setup lang="ts">
/**
 * AudiobookCard — audiobook preview: portrait cover with the favorite heart,
 * level chip and optional NEW badge, then the author (1 line) and the title
 * (up to 2 lines), both cut with an ellipsis when longer.
 * Matches the AudiobookCard component of the Figma mockup.
 *
 * @example
 * <AudiobookCard
 *   v-model:favorite="isFavorite"
 *   title="La Belle et la Bête"
 *   author="FluemingoApp"
 *   image-url="https://…/cover.jpg"
 *   level="A2"
 *   is-new
 * />
 */
import FavoriteToggleButton from "~/components/FavoriteToggleButton.vue";
import LevelChip from "~/components/LevelChip.vue";
import NewChip from "~/components/NewChip.vue";
import type { Level } from "~/utils/constants";

interface Props {
  /** Audiobook title */
  title: string;
  /** Author, shown above the title */
  author?: string | null;
  /** Cover image URL; a neutral placeholder is shown when missing */
  imageUrl?: string | null;
  /** CEFR level, shown bottom-left of the cover */
  level?: Level | null;
  /** Shows the NEW badge, bottom-right of the cover */
  isNew?: boolean;
  /** Gated content: the heart becomes a lock */
  locked?: boolean;
}

withDefaults(defineProps<Props>(), {
  author: null,
  imageUrl: null,
  level: null,
  isNew: false,
  locked: false,
});

const emit = defineEmits<{
  /** Fired when the lock is clicked on gated content */
  lockedClick: [];
}>();

/** Whether the audiobook is in the user's favorites */
const isFavorite = defineModel<boolean>("favorite", { default: false });
</script>

<template>
  <article class="audiobook-card" data-testid="audiobook-card">
    <div class="audiobook-card__cover">
      <NuxtImg
        v-if="imageUrl"
        :src="imageUrl"
        alt=""
        loading="lazy"
        class="audiobook-card__image"
        data-testid="audiobook-card-image"
      />
      <FavoriteToggleButton
        v-model="isFavorite"
        :locked="locked"
        class="audiobook-card__favorite"
        @locked-click="emit('lockedClick')"
      />
      <!-- selected: the pastel fill is opaque, so the cover art does not show through. -->
      <LevelChip
        v-if="level"
        :level="level"
        :label="level"
        selected
        class="audiobook-card__level px-2 py-1"
      />
      <NewChip v-if="isNew" class="audiobook-card__new" />
    </div>

    <p v-if="author" class="audiobook-card__author" data-testid="audiobook-card-author">
      {{ author }}
    </p>
    <h3 class="audiobook-card__title" data-testid="audiobook-card-title">
      {{ title }}
    </h3>
  </article>
</template>

<style scoped>
.audiobook-card {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.audiobook-card__cover {
  position: relative;
  aspect-ratio: 3 / 4;
  margin-bottom: 6px;
  overflow: hidden;
  border-radius: 12px;
  background-color: var(--color-chip-theme);
}

.audiobook-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.audiobook-card__favorite,
.audiobook-card__level,
.audiobook-card__new {
  position: absolute;
}

.audiobook-card__favorite {
  top: 8px;
  right: 8px;
}

.audiobook-card__level {
  bottom: 8px;
  left: 8px;
}

.audiobook-card__new {
  right: 8px;
  bottom: 8px;
}

.audiobook-card__author,
.audiobook-card__title {
  margin: 0;
  overflow: hidden;
}

.audiobook-card__author {
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-text-light);
  font-size: 14px;
  line-height: 20px;
}

/* Up to 2 lines, then an ellipsis. */
.audiobook-card__title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  color: var(--color-text-primary);
  font-size: 17px;
  font-weight: 500;
  line-height: 22px;
}
</style>

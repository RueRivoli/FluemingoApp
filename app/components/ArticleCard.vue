<script setup lang="ts">
/**
 * ArticleCard — article preview: cover image with favorite, status and date
 * overlays, then title, 2-line description, category and level + theme chips.
 *
 * @example
 * <ArticleCard
 *   v-model:favorite="isFavorite"
 *   title="Un lycéen blessé, la France suspend les grenades"
 *   description="In Lens, a 15-year-old high school student…"
 *   image-url="https://…/cover.jpg"
 *   level="B1"
 *   published-at="2026-10-07T12:00:00Z"
 *   status="in_progress"
 *   :category="{ id: 'Literature', icon: 'fa-regular fa-book' }"
 *   :themes="[{ id: 'news', label: 'News', icon: 'fa-regular fa-newspaper' }]"
 * />
 */
import { computed } from "vue";
import ContentCategoryChip from "~/components/content/ContentCategoryChip.vue";
import ContentDateBadge from "~/components/content/ContentDateBadge.vue";
import ContentStatusBadge from "~/components/content/ContentStatusBadge.vue";
import FavoriteToggleButton from "~/components/FavoriteToggleButton.vue";
import LevelChip from "~/components/LevelChip.vue";
import ThemeChip from "~/components/ThemeChip.vue";
import type { ArticleCardCategory, ArticleCardTheme } from "~/types/article";
import type { Level } from "~/utils/constants";
import type { ContentStatus } from "~/utils/contentStatus";

interface Props {
  /** Article title */
  title: string;
  /** Short summary, clamped to 2 lines */
  description?: string | null;
  /** Cover image URL; a neutral placeholder is shown when missing */
  imageUrl?: string | null;
  /** CEFR level of the article */
  level?: Level | null;
  /** Publication date (ISO string), shown bottom-right of the cover */
  publishedAt?: string | null;
  /** Reading progress, shown bottom-left of the cover */
  status?: ContentStatus | null;
  /** Category, shown on its own row under the description */
  category?: ArticleCardCategory | null;
  /** Themes, shown after the level chip */
  themes?: ArticleCardTheme[];
  /** Gated content: the heart becomes a lock */
  locked?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  description: null,
  imageUrl: null,
  level: null,
  publishedAt: null,
  status: null,
  category: null,
  themes: () => [],
  locked: false,
});

const emit = defineEmits<{
  /** Fired when the lock is clicked on gated content */
  lockedClick: [];
}>();

/** Whether the article is in the user's favorites */
const isFavorite = defineModel<boolean>("favorite", { default: false });

const hasChips = computed(
  () => Boolean(props.level) || props.themes.length > 0,
);
</script>

<template>
  <article class="article-card" data-testid="article-card">
    <div class="article-card__media">
      <NuxtImg
        v-if="imageUrl"
        :src="imageUrl"
        alt=""
        loading="lazy"
        class="article-card__image"
        data-testid="article-card-image"
      />
      <FavoriteToggleButton
        v-model="isFavorite"
        :locked="locked"
        class="article-card__favorite"
        @locked-click="emit('lockedClick')"
      />
      <ContentStatusBadge
        v-if="status"
        :status="status"
        class="article-card__status"
      />
      <ContentDateBadge
        v-if="publishedAt"
        :date="publishedAt"
        class="article-card__date"
      />
    </div>

    <div class="article-card__body">
      <h3 class="article-card__title" data-testid="article-card-title">
        {{ title }}
      </h3>
      <p
        v-if="description"
        class="article-card__description"
        data-testid="article-card-description"
      >
        {{ description }}
      </p>
      <div v-if="category" class="article-card__category">
        <ContentCategoryChip :category="category.id" :icon="category.icon" />
      </div>
      <div
        v-if="hasChips"
        class="article-card__chips"
        data-testid="article-card-chips"
      >
        <LevelChip
          v-if="level"
          class="px-2 py-1"
          :level="level"
          :label="level"
          selected
        />
        <ThemeChip
          v-for="theme in themes"
          :key="theme.id"
          :label="theme.label"
          :icon="theme.icon"
        />
      </div>
    </div>
  </article>
</template>

<style scoped>
.article-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 16px;
  background-color: var(--color-bg);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.article-card__media {
  position: relative;
  height: 180px;
  background-color: var(--color-chip-theme);
}

.article-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-card__favorite,
.article-card__status,
.article-card__date {
  position: absolute;
}

.article-card__favorite {
  top: 10px;
  right: 10px;
}

.article-card__status {
  bottom: 10px;
  left: 10px;
}

.article-card__date {
  right: 10px;
  bottom: 10px;
}

.article-card__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  padding: 14px 16px 16px;
}

.article-card__title {
  margin: 0;
  color: var(--color-text-primary);
  font-size: 18px;
  font-weight: 600;
  line-height: 24px;
}

.article-card__description {
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  color: var(--color-text-light);
  font-size: 14px;
  line-height: 20px;
}

/* Pinned to the bottom of the card. wrap-reverse keeps the first line (level
   chip, then themes) at the bottom-left and stacks overflow lines above it. */
.article-card__chips {
  display: flex;
  flex-wrap: wrap-reverse;
  gap: 6px;
  margin-top: auto;
  padding-top: 4px;
}
</style>

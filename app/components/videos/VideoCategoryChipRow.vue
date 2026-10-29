<script setup lang="ts">
/**
 * VideoCategoryChipRow — "All" then one VideoFilterChip per video category,
 * to pick the category shown on the Videos page. Works with category ids
 * (e.g. "SlowFrench"); null stands for "All".
 *
 * @example
 * <VideoCategoryChipRow :selected-category="category" @category-change="(c) => (category = c)" />
 */
import VideoFilterChip from "~/components/videos/VideoFilterChip.vue";
import {
  VIDEO_CATEGORIES,
  VIDEO_CATEGORY_IDS,
  type VideoCategory,
} from "~/utils/videos";

interface Props {
  /** Id of the selected category; null = all categories */
  selectedCategory?: VideoCategory | null;
}

withDefaults(defineProps<Props>(), {
  selectedCategory: null,
});

const emit = defineEmits<{
  /** Fired when a chip is clicked; carries its category id, null for "All" */
  categoryChange: [category: VideoCategory | null];
}>();
</script>

<template>
  <div class="video-category-chip-row" data-testid="video-category-chip-row">
    <h3 class="video-category-chip-row__title">Category</h3>
    <div class="video-category-chip-row__chips">
      <VideoFilterChip
        label="All"
        :active="selectedCategory === null"
        @click="emit('categoryChange', null)"
      />
      <VideoFilterChip
        v-for="categoryId in VIDEO_CATEGORY_IDS"
        :key="categoryId"
        :label="VIDEO_CATEGORIES[categoryId].label"
        :icon="VIDEO_CATEGORIES[categoryId].icon"
        :active="selectedCategory === categoryId"
        @click="emit('categoryChange', categoryId)"
      />
    </div>
  </div>
</template>

<style scoped>
.video-category-chip-row__title {
  margin-bottom: 0.5rem;
  color: var(--color-text-primary);
  font-weight: 500;
}

.video-category-chip-row__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>

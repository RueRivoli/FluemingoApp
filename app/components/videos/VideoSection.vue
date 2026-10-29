<script setup lang="ts">
/**
 * VideoSection — one category of the Videos page: icon + category name,
 * a "See all" link, then the videos as a grid of VideoCards.
 *
 * @example
 * <VideoSection category="Vlogs" :videos="vlogs" @select="play" @see-all="pickCategory('Vlogs')" />
 */
import { computed } from "vue";
import VideoCard from "~/components/videos/VideoCard.vue";
import type { VideoInfo } from "~/types/video";
import { VIDEO_CATEGORIES, type VideoCategory } from "~/utils/videos";

interface Props {
  /** Category of the section; gives its title and icon */
  category: VideoCategory;
  /** Videos of the category, in display order */
  videos: readonly VideoInfo[];
  /** Shows the "See all" link */
  showSeeAll?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showSeeAll: true,
});

const emit = defineEmits<{
  /** Fired when a video card is activated */
  select: [video: VideoInfo];
  /** Fired when "See all" is clicked */
  seeAll: [];
}>();

const display = computed(() => VIDEO_CATEGORIES[props.category]);
const headingId = computed(() => `video-section-${props.category}`);
</script>

<template>
  <section class="video-section" :aria-labelledby="headingId" data-testid="video-section">
    <header class="video-section__header">
      <h2 :id="headingId" class="video-section__title" data-testid="video-section-title">
        <span :class="display.icon" aria-hidden="true" data-testid="video-section-icon" />
        {{ display.label }}
      </h2>
      <button
        v-if="showSeeAll"
        type="button"
        class="video-section__see-all"
        data-testid="video-section-see-all"
        @click="emit('seeAll')"
      >
        See all
        <span class="fa-solid fa-chevron-right video-section__chevron" aria-hidden="true" />
      </button>
    </header>

    <div class="video-section__grid">
      <VideoCard
        v-for="video in videos"
        :key="video.id"
        :video="video"
        @select="emit('select', video)"
      />
    </div>
  </section>
</template>

<style scoped>
.video-section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 14px;
}

.video-section__title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--color-text-primary);
  font-size: 22px;
  font-weight: 400;
}

.video-section__title > span {
  font-size: 16px;
}

.video-section__see-all {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0;
  border: none;
  background: none;
  color: var(--color-primary-dark);
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.video-section__see-all:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.video-section__chevron {
  font-size: 10px;
}

.video-section__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 240px), 1fr));
  gap: 24px;
}
</style>

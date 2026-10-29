<script setup lang="ts">
/**
 * VideoCard — video preview of the Videos page (Figma VideoCard): 16:9
 * thumbnail with favorite heart, level, length and watch progress,
 * then the channel, the title (2 lines) and the chips.
 * Clicking the thumbnail (or Enter / Space on it) emits "select"; the heart does not.
 *
 * @example
 * <VideoCard v-model:favorite="isFavorite" :video="video" :progress="0.4" @select="play(video)" />
 */
import { computed } from "vue";
import FavoriteToggleButton from "~/components/FavoriteToggleButton.vue";
import LevelChip from "~/components/LevelChip.vue";
import VideoChannel from "~/components/videos/VideoChannel.vue";
import VideoMetaChip from "~/components/videos/VideoMetaChip.vue";
import VideoThumbnail from "~/components/videos/VideoThumbnail.vue";
import type { VideoInfo } from "~/types/video";
import ContentCategoryChip from "~/components/content/ContentCategoryChip.vue";
import ThemeChip from "~/components/ThemeChip.vue";
import { buildVideoMetaItems, VIDEO_CATEGORIES } from "~/utils/videos";
import { THEMES } from "~/utils/themes";

interface Props {
  /** The video to show */
  video: VideoInfo;
  /** Share already watched, from 0 to 1; no progress bar when null or 0 */
  progress?: number | null;
  /** Gated content: the heart becomes a lock */
  locked?: boolean;
  /** Shows the channel above the title; off when the card sits under its channel's heading */
  showChannel?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  progress: null,
  locked: false,
  showChannel: true,
});

const emit = defineEmits<{
  /** Fired when the lock is clicked on gated content */
  lockedClick: [];
  /** Fired when the thumbnail is clicked or activated with the keyboard */
  select: [];
}>();

/** Whether the video is in the user's favorites */
const isFavorite = defineModel<boolean>("favorite", { default: false });

const metaItems = computed(() =>
  buildVideoMetaItems(props.video.subtitles, props.video.speechRate),
);

const category = computed(() =>
  props.video.category ? VIDEO_CATEGORIES[props.video.category] : null,
);

const theme1 = computed(() =>
  props.video.theme1 ? THEMES[props.video.theme1] : null,
);

const theme2 = computed(() =>
  props.video.theme2 ? THEMES[props.video.theme2] : null,
);
// Clamped so a bad value never draws the bar outside the thumbnail.
const progressWidth = computed(() => {
  if (!props.progress || props.progress <= 0) return null;
  return `${Math.min(props.progress, 1) * 100}%`;
});
</script>

<template>
  <article class="video-card" data-testid="video-card">
    <!-- Not a <button>: it already holds the heart button. .self keeps the
         heart's own Enter/Space from opening the video. -->
    <div
      class="video-card__cover"
      role="button"
      tabindex="0"
      :aria-label="`Play ${video.title}`"
      data-testid="video-card-cover"
      @click="emit('select')"
      @keydown.enter.self.prevent="emit('select')"
      @keydown.space.self.prevent="emit('select')"
    >
      <VideoThumbnail
        :image-url="video.thumbnailUrl"
        :duration="video.duration"
      >
        <FavoriteToggleButton
          v-model="isFavorite"
          :locked="locked"
          class="video-card__favorite"
          @click.stop
          @locked-click="emit('lockedClick')"
        />
        <template v-if="progressWidth">
          <span class="video-card__progress-track" aria-hidden="true" />
          <span
            class="video-card__progress"
            :style="{ width: progressWidth }"
            aria-hidden="true"
            data-testid="video-card-progress"
          />
        </template>
      </VideoThumbnail>
    </div>

    <div class="video-card__text">
      <VideoChannel
        v-if="showChannel && video.channel"
        :name="video.channel"
        :avatar-url="video.channelAvatarUrl"
      />
      <h3
        class="video-card__title"
        :title="video.title"
        data-testid="video-card-title"
      >
        {{ video.title }}
      </h3>
      <div v-if="metaItems.length" class="video-card__meta"></div>
      <div class="video-card__tags">
        <LevelChip
          v-if="video.level"
          :level="video.level"
          :label="video.level"
          selected
          light
        />
        <ContentCategoryChip
          v-if="category"
          :label="category.label"
          :icon="category.icon"
          light
        />
        <ThemeChip
          v-if="theme1"
          :label="theme1.label"
          :icon="theme1.icon"
          light
        />
        <ThemeChip
          v-if="theme2"
          :label="theme2.label"
          :icon="theme2.icon"
          light
        />
      </div>
    </div>
  </article>
</template>

<style scoped>
.video-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.video-card__cover {
  border-radius: 12px;
  cursor: pointer;
}

.video-card__cover:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.video-card__favorite,
.video-card__progress-track,
.video-card__progress {
  position: absolute;
}

.video-card__favorite {
  top: 8px;
  right: 8px;
}

.video-card__progress-track,
.video-card__progress {
  bottom: 0;
  left: 0;
  height: 4px;
}

.video-card__progress-track {
  right: 0;
  background-color: rgb(255 255 255 / 40%);
}

.video-card__progress {
  background-color: var(--color-secondary);
}

.video-card__text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

/* Wraps on 2 lines, "…" only at the end of the second one. */
.video-card__title {
  display: -webkit-box;
  overflow: hidden;
  color: var(--color-text-primary);
  font-size: 16px;
  font-weight: 500;
  line-height: 21px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.video-card__tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  padding-top: 4px;
}

.video-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding-top: 4px;
}
</style>

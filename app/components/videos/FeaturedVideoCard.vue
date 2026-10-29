<script setup lang="ts">
/**
 * FeaturedVideoCard — the large "Featured this week" card of the Videos page
 * (Figma FeaturedVideo): big thumbnail on the left, then badges, title,
 * channel, description, level / meta chips and a "Watch now" button.
 * The thumbnail and the button both emit "select"; the heart does not.
 *
 * @example
 * <FeaturedVideoCard v-model:favorite="isFavorite" :video="video" @select="play(video)" />
 */
import { computed } from "vue";
import BaseButton from "~/components/base/BaseButton.vue";
import ContentCategoryChip from "~/components/content/ContentCategoryChip.vue";
import FavoriteToggleButton from "~/components/FavoriteToggleButton.vue";
import LevelChip from "~/components/LevelChip.vue";
import NewChip from "~/components/NewChip.vue";
import VideoChannel from "~/components/videos/VideoChannel.vue";
import VideoMetaChip from "~/components/videos/VideoMetaChip.vue";
import VideoThumbnail from "~/components/videos/VideoThumbnail.vue";
import type { VideoInfo } from "~/types/video";
import { buildVideoMetaItems, VIDEO_CATEGORIES } from "~/utils/videos";
import { THEMES } from "~/utils/themes";

interface Props {
  /** The video to feature */
  video: VideoInfo;
  /** Gated content: the heart becomes a lock */
  locked?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  locked: false,
});

const emit = defineEmits<{
  /** Fired when the lock is clicked on gated content */
  lockedClick: [];
  /** Fired when the thumbnail or "Watch now" is activated */
  select: [];
}>();

/** Whether the video is in the user's favorites */
const isFavorite = defineModel<boolean>("favorite", { default: false });

const category = computed(() =>
  props.video.category ? VIDEO_CATEGORIES[props.video.category] : null,
);

const metaItems = computed(() =>
  buildVideoMetaItems(
    // props.video.subtitles,
    // props.video.speechRate,
    props.video.duration,
  ),
);
</script>

<template>
  <article class="featured-video-card" data-testid="featured-video-card">
    <div
      class="featured-video-card__cover"
      role="button"
      tabindex="0"
      :aria-label="`Play ${video.title}`"
      data-testid="featured-video-card-cover"
      @click="emit('select')"
      @keydown.enter.self.prevent="emit('select')"
      @keydown.space.self.prevent="emit('select')"
    >
      <VideoThumbnail
        :image-url="video.thumbnailUrl"
        :duration="video.duration"
        size="lg"
        class="featured-video-card__thumbnail"
      >
        <FavoriteToggleButton
          v-model="isFavorite"
          :locked="locked"
          class="featured-video-card__favorite"
          @click.stop
          @locked-click="emit('lockedClick')"
        />
      </VideoThumbnail>
    </div>

    <div class="featured-video-card__body">
      <div v-if="video.isNew || category" class="featured-video-card__row">
        <NewChip v-if="video.isNew" />
        <ContentCategoryChip
          v-if="category"
          :label="category.label"
          :icon="category.icon"
        />
      </div>
      <h3
        class="featured-video-card__title"
        data-testid="featured-video-card-title"
      >
        {{ video.title }}
      </h3>
      <VideoChannel
        v-if="video.channel"
        :name="video.channel"
        :avatar-url="video.channelAvatarUrl"
        size="md"
      />
      <p
        v-if="video.description"
        class="featured-video-card__description"
        data-testid="featured-video-card-description"
      >
        {{ video.description }}
      </p>
      <div
        v-if="video.level || metaItems.length"
        class="featured-video-card__row"
      >
        <LevelChip
          v-if="video.level"
          :level="video.level"
          :label="video.level"
          selected
          class="px-2 py-1"
        />
        <ThemeChip
          v-if="video.theme1"
          :label="THEMES[video.theme1].label"
          :icon="THEMES[video.theme1].icon"
        />
        <ThemeChip
          v-if="video.theme2"
          :label="THEMES[video.theme2].label"
          :icon="THEMES[video.theme2].icon"
        />
        <!-- <VideoMetaChip
          v-for="item in metaItems"
          :key="item.id"
          :icon="item.icon"
          :label="item.label"
          size="md"
        /> -->
      </div>
      <BaseButton
        icon="fa-solid fa-play"
        class="featured-video-card__action"
        @click="emit('select')"
      >
        Watch now
      </BaseButton>
    </div>
  </article>
</template>

<style scoped>
.featured-video-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 16px;
  background-color: var(--color-bg);
  box-shadow: 0 4px 12px rgb(0 0 0 / 8%);
}

.featured-video-card__cover {
  cursor: pointer;
}

.featured-video-card__cover:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: -2px;
}

.featured-video-card__thumbnail {
  aspect-ratio: 16 / 9;
}

.featured-video-card__favorite {
  position: absolute;
  top: 12px;
  right: 12px;
}

.featured-video-card__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  min-width: 0;
  padding: 28px 32px;
}

.featured-video-card__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.featured-video-card__title {
  color: var(--color-text-primary);
  font-size: 26px;
  font-weight: 600;
  line-height: 32px;
}

.featured-video-card__description {
  color: var(--color-text-light);
  font-size: 15px;
  line-height: 22px;
}

.featured-video-card__action {
  width: 220px;
  border-radius: 14px;
}

/* Side by side once there is room for the thumbnail and the text. */
@media (min-width: 1024px) {
  .featured-video-card {
    flex-direction: row;
  }

  .featured-video-card__cover {
    flex: 0 0 55%;
  }

  /* Fills the card height, which the text sets, instead of keeping 16:9. */
  .featured-video-card__thumbnail {
    aspect-ratio: auto;
    height: 100%;
    min-height: 330px;
  }
}
</style>

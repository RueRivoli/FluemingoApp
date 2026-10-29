<script setup lang="ts">
/**
 * VideoThumbnail — 16:9 video thumbnail with a centred play badge and the
 * length bottom-right. A primary gradient stands in for a missing image.
 * Overlays (favorite, level, NEW…) go in the default slot, positioned by the parent.
 *
 * @example
 * <VideoThumbnail image-url="https://…/thumb.jpg" :duration="522">
 *   <FavoriteToggleButton class="absolute top-2 right-2" />
 * </VideoThumbnail>
 */
import { computed } from "vue";
import { formatVideoDuration } from "~/utils/videos";

interface Props {
  /** Thumbnail URL; the gradient placeholder shows when missing */
  imageUrl?: string | null;
  /** Length in seconds; no length badge when null */
  duration?: number | null;
  /** "lg" for the featured video, "sm" for the cards */
  size?: "sm" | "lg";
}

const props = withDefaults(defineProps<Props>(), {
  imageUrl: null,
  duration: null,
  size: "sm",
});

const durationLabel = computed(() => formatVideoDuration(props.duration));
</script>

<template>
  <div
    :class="['video-thumbnail', `video-thumbnail--${size}`]"
    data-testid="video-thumbnail"
  >
    <NuxtImg
      v-if="imageUrl"
      :src="imageUrl"
      alt=""
      loading="lazy"
      class="video-thumbnail__image"
      data-testid="video-thumbnail-image"
    />
    <span class="video-thumbnail__play" aria-hidden="true">
      <span class="fa-solid fa-play" />
    </span>
    <span
      v-if="durationLabel"
      class="video-thumbnail__duration"
      data-testid="video-thumbnail-duration"
    >
      {{ durationLabel }}
    </span>
    <slot />
  </div>
</template>

<style scoped>
.video-thumbnail {
  position: relative;
  overflow: hidden;
  background-image: linear-gradient(
    140deg,
    var(--color-primary-pastel) 0%,
    var(--color-primary-dark) 71%
  );
}

.video-thumbnail--sm {
  aspect-ratio: 16 / 9;
  border-radius: 12px;
}

.video-thumbnail__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-thumbnail__play {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: rgb(255 255 255 / 92%);
  color: var(--color-text-primary);
  transform: translate(-50%, -50%);
}

.video-thumbnail--sm .video-thumbnail__play {
  width: 44px;
  height: 44px;
  padding-left: 3px;
  font-size: 15px;
}

.video-thumbnail--lg .video-thumbnail__play {
  width: 64px;
  height: 64px;
  padding-left: 4px;
  font-size: 22px;
}

.video-thumbnail__duration {
  position: absolute;
  right: 8px;
  border-radius: 4px;
  background-color: rgb(0 0 0 / 72%);
  color: var(--color-bg);
  font-weight: 500;
}

.video-thumbnail--sm .video-thumbnail__duration {
  bottom: 12px;
  padding: 3px 7px;
  font-size: 12px;
}

.video-thumbnail--lg .video-thumbnail__duration {
  right: 12px;
  bottom: 12px;
  padding: 4px 8px;
  font-size: 13px;
}
</style>

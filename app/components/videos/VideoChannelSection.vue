<script setup lang="ts">
/**
 * VideoChannelSection — the videos of one YouTube channel, shown once a
 * category is selected on the Videos page: channel avatar + name and video
 * count, then the videos as a grid of VideoCards (without repeating the channel).
 *
 * @example
 * <VideoChannelSection channel="Easy French" :avatar-url="avatar" :videos="videos" @select="play" />
 */
import { computed } from "vue";
import VideoCard from "~/components/videos/VideoCard.vue";
import VideoChannel from "~/components/videos/VideoChannel.vue";
import type { VideoInfo } from "~/types/video";

interface Props {
  /** Channel name; null for the videos whose channel is unknown */
  channel: string | null;
  /** Avatar of the channel; a neutral circle shows when missing */
  avatarUrl?: string | null;
  /** Videos of the channel, in display order */
  videos: readonly VideoInfo[];
}

const props = withDefaults(defineProps<Props>(), {
  avatarUrl: null,
});

const emit = defineEmits<{
  /** Fired when a video card is activated */
  select: [video: VideoInfo];
}>();

const UNKNOWN_CHANNEL_LABEL = "Other channels";

const channelName = computed(() => props.channel ?? UNKNOWN_CHANNEL_LABEL);
const countLabel = computed(() =>
  props.videos.length === 1 ? "1 video" : `${props.videos.length} videos`,
);
// Channel names are free text: keep only id-safe characters.
const headingId = computed(
  () => `video-channel-${channelName.value.replace(/[^\w-]+/g, "-")}`,
);
</script>

<template>
  <section
    class="video-channel-section"
    :aria-labelledby="headingId"
    data-testid="video-channel-section"
  >
    <header class="video-channel-section__header">
      <h2
        :id="headingId"
        class="video-channel-section__title"
        data-testid="video-channel-section-title"
      >
        <VideoChannel :name="channelName" :avatar-url="avatarUrl" size="md" />
      </h2>
      <span
        class="video-channel-section__count"
        data-testid="video-channel-section-count"
      >
        {{ countLabel }}
      </span>
    </header>

    <div class="video-channel-section__grid">
      <VideoCard
        v-for="video in videos"
        :key="video.id"
        :video="video"
        :show-channel="false"
        @select="emit('select', video)"
      />
    </div>
  </section>
</template>

<style scoped>
.video-channel-section__header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.video-channel-section__title {
  min-width: 0;
  margin: 0;
  font-size: inherit;
  font-weight: 400;
}

/* VideoChannel is grey and small for the cards; as a heading it reads as a title. */
.video-channel-section__title :deep(.video-channel) {
  color: var(--color-text-primary);
  font-size: 20px;
}

.video-channel-section__count {
  color: var(--color-text-light);
  font-size: 14px;
}

.video-channel-section__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 240px), 1fr));
  gap: 24px;
}
</style>

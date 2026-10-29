<script setup lang="ts">
/**
 * VideoPlayer — 16:9 YouTube player of the video page, in privacy-enhanced
 * mode (youtube-nocookie.com: no cookie until the viewer presses play).
 * Reports its current time and can be sent to a moment (subtitles sync).
 *
 * @example
 * <VideoPlayer ref="player" youtube-id="dQw4w9WgXcQ" title="Une journée à Paris" @time-update="onTime" />
 * player.value?.seekTo(14)
 * player.value?.pause()
 */
import { computed, ref, watch } from "vue";
import { useYoutubePlayer } from "~/composables/useYoutubePlayer";

const YOUTUBE_EMBED_URL = "https://www.youtube-nocookie.com/embed/";

interface Props {
  /** YouTube video id */
  youtubeId: string;
  /** Video title, read by screen readers on the iframe */
  title: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  /** Fired when the current time of the video changes, in seconds */
  timeUpdate: [seconds: number];
}>();

const frame = ref<HTMLIFrameElement | null>(null);
const { currentTime, seekTo, pause } = useYoutubePlayer(frame);

// rel=0: suggestions at the end come from the same channel, not all of YouTube.
// enablejsapi=1 + origin: let the page follow and move the playback.
const src = computed(() => {
  const params = new URLSearchParams({
    rel: "0",
    enablejsapi: "1",
    origin: window.location.origin,
  });
  return `${YOUTUBE_EMBED_URL}${encodeURIComponent(props.youtubeId)}?${params}`;
});

watch(currentTime, (seconds) => emit("timeUpdate", seconds));

// The parent drives the playback from outside (a subtitle line or word is
// clicked): methods are the natural API for one-off commands.
defineExpose({ seekTo, pause });
</script>

<template>
  <div class="video-player" data-testid="video-player">
    <iframe
      ref="frame"
      :src="src"
      :title="title"
      class="video-player__frame"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
      data-testid="video-player-frame"
    />
  </div>
</template>

<style scoped>
.video-player {
  overflow: hidden;
  aspect-ratio: 16 / 9;
  border-radius: 16px;
  background-color: var(--color-bg-dark);
}

.video-player__frame {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}
</style>

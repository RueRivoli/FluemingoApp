<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useAsyncData, useRoute } from "#imports";
import VideoPlayer from "~/components/videos/VideoPlayer.vue";
import VideoQuiz from "~/components/videos/VideoQuiz.vue";
import VideoSubtitlesPanel from "~/components/videos/VideoSubtitlesPanel.vue";
import VideoTabs, { type VideoTabValue } from "~/components/videos/VideoTabs.vue";
import * as videoService from "~/services/videoService";
import VocabularyList from "~/components/content/VocabularyList.vue";
import { useAudioPlayer } from "~/composables/useAudioPlayer";
import { toContentFileUrl } from "~/services/contentStorage";
import * as quizService from "~/services/quizService";
import * as vocabularyService from "~/services/vocabularyService";
import { useUserStore } from "~/stores/user";
import type { VocabularyItem } from "~/types/vocabulary";

const VIDEOS_PATH = "/app/browse/videos";

const route = useRoute();
// NaN for a non-numeric id: the page then shows "not found" without querying.
const videoId = computed(() => Number(route.params.id));

const { contentLanguage } = storeToRefs(useUserStore());

const {
  data: video,
  pending,
  error,
} = await useAsyncData(
  () => `video-${contentLanguage.value}-${route.params.id}`,
  () =>
    Number.isInteger(videoId.value)
      ? videoService.getVideo(videoId.value)
      : Promise.resolve(null),
);

// Same words as the mobile app (fr_vocabulary, content_type 3). Lazy: the
// Video tab shows first, the vocabulary loads meanwhile.
const {
  data: vocabulary,
  pending: isVocabularyPending,
  error: vocabularyError,
} = useAsyncData(
  () => `video-vocabulary-${contentLanguage.value}-${route.params.id}`,
  () =>
    Number.isInteger(videoId.value)
      ? vocabularyService.getVideoVocabulary(videoId.value)
      : Promise.resolve([]),
  { lazy: true },
);

// Same questions as the mobile app (fr_quiz_models, type 3). Lazy, like the vocabulary.
const {
  data: quiz,
  pending: isQuizPending,
  error: quizError,
} = useAsyncData(
  () => `video-quiz-${contentLanguage.value}-${route.params.id}`,
  () =>
    Number.isInteger(videoId.value)
      ? quizService.getVideoQuiz(videoId.value)
      : Promise.resolve([]),
  { lazy: true },
);

const { play: playAudio, isPlaying: isAudioPlaying } = useAudioPlayer();

const activeTab = ref<VideoTabValue>("video");
const player = ref<InstanceType<typeof VideoPlayer> | null>(null);
// Current time of the video, in seconds: drives the highlighted subtitle.
const currentTime = ref(0);
// Word whose pronunciation was last played; its icon is coloured while it plays.
const lastPlayedWordId = ref<number | null>(null);

const title = computed(() => video.value?.title ?? "Video");
const playingWordId = computed(() =>
  isAudioPlaying.value ? lastPlayedWordId.value : null,
);

/** Plays the pronunciation of a word (audio_url is a path of the content bucket). */
function playWordAudio(word: VocabularyItem) {
  const src = toContentFileUrl(word.audioUrl);
  if (!src) return;
  lastPlayedWordId.value = word.id;
  playAudio(src);
}

useHead(() => ({ title: `${title.value} — Fluemingo` }));
</script>

<template>
  <PageTitle
    :title="title"
    :crumbs="[
      { text: 'Home', href: '/' },
      { text: 'Videos', href: VIDEOS_PATH },
      { text: title, href: route.path },
    ]"
  />

  <p v-if="error" class="mt-8 text-error" role="alert">
    The video could not be loaded.
  </p>
  <p v-else-if="!pending && !video" class="mt-8 text-text-light">
    This video does not exist.
    <NuxtLink :to="VIDEOS_PATH" class="text-primary-dark">Back to videos</NuxtLink>
  </p>

  <VideoTabs v-else-if="video" v-model:tab="activeTab" class="mt-6">
    <template #video>
      <!-- Figma "Video page": player column capped at 680px, subtitles panel
           taking the rest, as tall as the player column but at least 600px (it
           scrolls inside). -->
      <section class="flex flex-col gap-6 lg:flex-row lg:items-stretch">
        <div class="flex w-full flex-col gap-4 lg:max-w-170 lg:flex-[0_1_680px]">
          <VideoPlayer
            ref="player"
            :youtube-id="video.youtubeId"
            :title="video.title"
            @time-update="(seconds: number) => (currentTime = seconds)"
          />
          <p
            v-if="video.description"
            class="whitespace-pre-line text-[15px] leading-5.5 text-text-light"
          >
            {{ video.description }}
          </p>
        </div>

        <div class="relative h-130 lg:h-auto lg:min-h-150 lg:min-w-[320px] lg:flex-1">
          <VideoSubtitlesPanel
            class="absolute inset-0"
            :cues="video.subtitles"
            :has-units="video.hasUnits"
            :current-time="currentTime"
            @seek="(seconds: number) => player?.seekTo(seconds)"
            @word-open="player?.pause()"
          />
        </div>
      </section>
    </template>

    <template #vocabulary>
      <p v-if="vocabularyError" class="py-10 text-center text-error" role="alert">
        The vocabulary could not be loaded.
      </p>
      <p v-else-if="isVocabularyPending" class="py-10 text-center text-text-light">
        Loading the vocabulary…
      </p>
      <VocabularyList
        v-else
        class="mt-2"
        :main-words="vocabulary ?? []"
        :playing-id="playingWordId"
        @play-audio="playWordAudio"
      />
    </template>

    <template #quiz>
      <p v-if="quizError" class="py-10 text-center text-error" role="alert">
        The quiz could not be loaded.
      </p>
      <p v-else-if="isQuizPending" class="py-10 text-center text-text-light">
        Loading the quiz…
      </p>
      <VideoQuiz v-else class="mt-2" :questions="quiz ?? []" />
    </template>
  </VideoTabs>
</template>

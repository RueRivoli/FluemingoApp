<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { navigateTo, useAsyncData } from "#imports";
import FeaturedVideoCard from "~/components/videos/FeaturedVideoCard.vue";
import VideoCategoryChipRow from "~/components/videos/VideoCategoryChipRow.vue";
import VideoChannelSection from "~/components/videos/VideoChannelSection.vue";
import VideoSection from "~/components/videos/VideoSection.vue";
import * as videoService from "~/services/videoService";
import type { VideoInfo } from "~/types/video";
import { useUserStore } from "~/stores/user";
import { LEVELS, type Level } from "~/utils/constants";
import { buildVideoPageContent, type VideoCategory } from "~/utils/videos";

useHead({ title: "Videos — Fluemingo" });

// null = every category.
const selectedCategory = ref<VideoCategory | null>(null);
const selectedLevel = ref<Level>(LEVELS[0]);

// The service picks the table from the user's language by itself; the page only
// needs it in the key, so the list reloads when the level or the language changes.
const { contentLanguage } = storeToRefs(useUserStore());

const {
  data: videos,
  pending,
  error,
} = await useAsyncData(
  () => `videos-${contentLanguage.value}-${selectedLevel.value}`,
  () => videoService.getVideos(selectedLevel.value),
);

const content = computed(() =>
  buildVideoPageContent(videos.value ?? [], selectedCategory.value),
);
const isEmpty = computed(
  () =>
    !content.value.featured &&
    content.value.sections.length === 0 &&
    content.value.channels.length === 0,
);

function openVideo(video: VideoInfo) {
  return navigateTo(`/app/videos/${video.id}`);
}
</script>

<template>
  <PageTitle
    title="Videos"
    :crumbs="[
      { text: 'Home', href: '/' },
      { text: 'Videos', href: '/app/browse/videos' },
    ]"
  />

  <VideoCategoryChipRow
    :selected-category="selectedCategory"
    @category-change="(category) => (selectedCategory = category)"
  />

  <div class="mt-4">
    <LevelChipRow
      :selected-level="selectedLevel"
      @level-change="(level: Level) => (selectedLevel = level)"
    />
  </div>

  <p v-if="error" class="mt-8 text-error" role="alert">
    The videos could not be loaded.
  </p>
  <p v-else-if="!pending && isEmpty" class="mt-8 text-text-light">
    No videos match these filters yet.
  </p>

  <section
    v-if="content.featured"
    class="mt-8"
    aria-labelledby="featured-video-heading"
  >
    <h2
      id="featured-video-heading"
      class="mb-3.5 flex items-center gap-2.5 text-[22px] text-text-primary"
    >
      <span class="fa-solid fa-star text-base" aria-hidden="true" />
      Featured this week
    </h2>
    <FeaturedVideoCard
      :video="content.featured"
      @select="openVideo(content.featured)"
    />
  </section>

  <VideoSection
    v-for="section in content.sections"
    :key="section.category"
    class="mt-9"
    :category="section.category"
    :videos="section.videos"
    :show-see-all="selectedCategory === null"
    @see-all="selectedCategory = section.category"
    @select="openVideo"
  />

  <!-- A category is selected: its videos, one section per YouTube channel. -->
  <VideoChannelSection
    v-for="group in content.channels"
    :key="group.channel ?? ''"
    class="mt-9"
    :channel="group.channel"
    :avatar-url="group.avatarUrl"
    :videos="group.videos"
    @select="openVideo"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import type { Level } from "~/utils/constants";
import { LEVELS } from "~/utils/constants";
import { useAsyncData } from "#imports";
import { useUserStore } from "~/stores/user";
import * as audiobookService from "~/services/audiobookService";
import { audiobookCategoryLabel } from "~/utils/audiobooks";
import type { ThemeId } from "~/utils/themes";

useHead({ title: "Audiobooks — Fluemingo" });

// null = every level.
const selectedLevel = ref<Level | null>(LEVELS[0]);
const selectedThemes = ref<ThemeId[]>([]);

// The service picks the table from the user's language by itself; the page only
// needs it in the key, so the list reloads when the level or the language changes.
const { contentLanguage } = storeToRefs(useUserStore());

const { data: audiobooks } = await useAsyncData(
  () =>
    `audiobooks-${contentLanguage.value}-${selectedLevel.value}-${selectedThemes.value.join(",")}`,
  () =>
    audiobookService.getAudiobooks(selectedLevel.value, selectedThemes.value),
);

function handleSelectionChange(theme: ThemeId) {
  if (selectedThemes.value.includes(theme))
    selectedThemes.value = selectedThemes.value.filter((id) => id !== theme);
  else selectedThemes.value.push(theme);
}
</script>

<template>
  <PageTitle
    title="Audiobooks"
    :crumbs="[
      { text: 'Home', href: '/' },
      { text: 'Audiobooks', href: '/app/browse/audiobooks' },
    ]"
  />

  <LevelChipRow
    :selectedLevel="selectedLevel"
    @level-change="(level) => (selectedLevel = level)"
  ></LevelChipRow>

  <ThemeChipRow
    :selectedThemes="selectedThemes"
    @theme-selection-change="(theme) => handleSelectionChange(theme)"
  ></ThemeChipRow>

  <!-- One section per category: { novel: [...], biography: [...] } -->
  <section
    v-for="(categoryAudiobooks, categoryKey) in audiobooks"
    :key="categoryKey"
    class="mt-6"
  >
    <h2 class="mb-3 text-lg font-semibold text-text-primary">
      {{ audiobookCategoryLabel(categoryKey) }}
    </h2>
    <div
      class="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-x-4 gap-y-6"
    >
      <AudiobookCard
        v-for="audiobook in categoryAudiobooks"
        :key="audiobook.id"
        class="cursor-pointer"
        :title="audiobook.title"
        :author="audiobook.author"
        :image-url="audiobook.imageUrl"
        :level="audiobook.level"
        :is-new="audiobook.isNew"
      />
    </div>
  </section>
</template>

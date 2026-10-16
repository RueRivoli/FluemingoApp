<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ref } from "vue";

import type { Level } from "~/utils/constants";
import { LEVELS } from "~/utils/constants";
import { useAsyncData } from "#imports";
import { useUserStore } from "~/stores/user";
import * as articleService from "~/services/articleService";
import type { ThemeId } from "~/utils/themes";
import * as vocabularyService from "~/services/vocabularyService";
import type { NewsArticleInfo } from "~/types/article";
import type { VocabularyItem } from "~/types/vocabulary";

useHead({ title: "Articles — Fluemingo" });

// null = every level.
const selectedLevel = ref<Level | null>(LEVELS[0]);
const selectedThemes = ref<ThemeId[]>([]);
// The service picks the table from the user's language by itself; the page only
// needs it in the key, so the list reloads when the level or the language changes.
const { contentLanguage } = storeToRefs(useUserStore());

const { data } = await useAsyncData(
  () =>
    `newsArticles-${contentLanguage.value}-${selectedLevel.value}-${selectedThemes.value.join(",")}`,
  () =>
    articleService.getNewsArticles(selectedLevel.value, selectedThemes.value),
);

// Article shown in the detail modal; kept after closing so the content does
// not vanish during the close.
const selectedArticle = ref<NewsArticleInfo | null>(null);
const isDetailOpen = ref(false);
const mainVocabulary = ref<VocabularyItem[]>([]);
const personalVocabulary = ref<VocabularyItem[]>([]);

async function openArticle(article: NewsArticleInfo) {
  selectedArticle.value = article;
  isDetailOpen.value = true;
  const vocabulary = await vocabularyService.getArticleVocabulary(article.id);
  mainVocabulary.value = vocabulary.mainVocabulary;
  personalVocabulary.value = vocabulary.personalVocabulary;
}

function handleSelectionChange(theme: ThemeId) {
  if (selectedThemes.value.includes(theme))
    selectedThemes.value = selectedThemes.value.filter((id) => id !== theme);
  else selectedThemes.value.push(theme);
}
</script>

<template>
  <PageTitle
    title="Articles"
    :crumbs="[
      { text: 'Home', href: '/app/home' },
      { text: 'Articles', href: '/app/browse/news' },
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
  <div class="mt-4 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
    <!-- Props listed explicitly: the article's other fields (author, translations…) are not card props. -->
    <ArticleCard
      class="cursor-pointer"
      v-for="article in data"
      :key="article.id"
      :title="article.title"
      :description="article.description"
      :image-url="article.imageUrl"
      :level="article.level"
      :published-at="article.publishedAt"
      :themes="article.themes"
      @click="openArticle(article)"
    />
  </div>

  <ArticleDetailModal
    v-if="selectedArticle"
    v-model:visible="isDetailOpen"
    :title="selectedArticle.title"
    :id="selectedArticle.id"
    :description="selectedArticle.description"
    :image-url="selectedArticle.imageUrl"
    :level="selectedArticle.level"
    :published-at="selectedArticle.publishedAt"
    :themes="selectedArticle.themes"
    :main-vocabulary="mainVocabulary"
    :personal-vocabulary="personalVocabulary"
  />
</template>

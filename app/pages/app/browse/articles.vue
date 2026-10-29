<script setup lang="ts">
import { storeToRefs } from "pinia";
import Paginator, { type PageState } from "primevue/paginator";
import { computed, ref, watch } from "vue";

import type { Level } from "~/utils/constants";
import { LEVELS } from "~/utils/constants";
import { useAsyncData } from "#imports";
import { useUserStore } from "~/stores/user";
import * as articleService from "~/services/articleService";
import { ARTICLES_PAGE_SIZE } from "~/utils/articles";
import type { ThemeId } from "~/utils/themes";
import * as vocabularyService from "~/services/vocabularyService";
import type { NewsArticleInfo } from "~/types/article";
import type { VocabularyItem } from "~/types/vocabulary";

useHead({ title: "Articles — Fluemingo" });

// null = every level.
const selectedLevel = ref<Level | null>(LEVELS[0]);
const selectedThemes = ref<ThemeId[]>([]);
// 1-based, as articleService expects.
const currentPage = ref(1);
// The service picks the table from the user's language by itself; the page only
// needs it in the key, so the list reloads when the level or the language changes.
const { contentLanguage } = storeToRefs(useUserStore());

const { data } = await useAsyncData(
  () =>
    `newsArticles-${contentLanguage.value}-${selectedLevel.value}-${selectedThemes.value.join(",")}-${currentPage.value}`,
  () =>
    articleService.getNewsArticles(
      selectedLevel.value,
      selectedThemes.value,
      currentPage.value,
    ),
);

const articles = computed(() => data.value?.articles ?? []);
const totalArticles = computed(() => data.value?.total ?? 0);
// Paginator works with the index of the first row, not a page number.
const firstArticleIndex = computed(
  () => (currentPage.value - 1) * ARTICLES_PAGE_SIZE,
);

// Other filters give other results: the current page may not exist any more.
// Sync flush: the page is reset before the data key is recomputed, so the
// old page of the new filters is never fetched.
watch(
  [selectedLevel, selectedThemes, contentLanguage],
  () => {
    currentPage.value = 1;
  },
  { deep: true, flush: "sync" },
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

function handlePageChange(state: PageState) {
  currentPage.value = state.page + 1;
  window.scrollTo({ top: 0, behavior: "smooth" });
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
      v-for="article in articles"
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

  <Paginator
    v-if="totalArticles > ARTICLES_PAGE_SIZE"
    class="mt-6"
    :first="firstArticleIndex"
    :rows="ARTICLES_PAGE_SIZE"
    :total-records="totalArticles"
    @page="handlePageChange"
  />

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

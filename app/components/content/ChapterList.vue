<script setup lang="ts">
/**
 * ChapterList — "Chapters" section of an audiobook: one numbered ChapterRow
 * per chapter, or a loading / error / empty message instead.
 *
 * @example
 * <ChapterList :chapters="chapters" :is-loading="isLoading" />
 */
import ChapterRow from "~/components/content/ChapterRow.vue";
import type { AudiobookChapter } from "~/types/audiobook";

interface Props {
  /** Chapters, in reading order */
  chapters?: readonly AudiobookChapter[];
  /** Shows a loading message while the chapters are fetched */
  isLoading?: boolean;
  /** Shows an error message when the chapters could not be loaded */
  hasError?: boolean;
}

withDefaults(defineProps<Props>(), {
  chapters: () => [],
  isLoading: false,
  hasError: false,
});

const HEADING_ID = "chapter-list-heading";
</script>

<template>
  <section class="chapter-list" :aria-labelledby="HEADING_ID" data-testid="chapter-list">
    <h3 :id="HEADING_ID" class="chapter-list__heading">Chapters</h3>

    <p v-if="isLoading" class="chapter-list__message" data-testid="chapter-list-loading">
      Loading chapters…
    </p>
    <p
      v-else-if="hasError"
      class="chapter-list__message"
      role="alert"
      data-testid="chapter-list-error"
    >
      The chapters could not be loaded.
    </p>
    <p
      v-else-if="chapters.length === 0"
      class="chapter-list__message"
      data-testid="chapter-list-empty"
    >
      No chapters yet.
    </p>
    <ol v-else class="chapter-list__items">
      <ChapterRow
        v-for="(chapter, index) in chapters"
        :key="chapter.id"
        :number="index + 1"
        :title="chapter.title"
        :translated-title="chapter.translatedTitle"
        :duration="chapter.duration"
      />
    </ol>
  </section>
</template>

<style scoped>
.chapter-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.chapter-list__heading {
  margin: 0;
  color: var(--color-text-primary);
  font-size: 22px;
  font-weight: 600;
  line-height: 30px;
}

.chapter-list__items {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 0;
}

.chapter-list__message {
  margin: 0;
  color: #8a8a8a;
  font-size: 16px;
}
</style>

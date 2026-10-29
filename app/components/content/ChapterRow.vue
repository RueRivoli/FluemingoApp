<script setup lang="ts">
/**
 * ChapterRow — one chapter of an audiobook: its number, then a card with the
 * title (and its translation) and the duration pill (Figma ChapterRow).
 *
 * @example
 * <ChapterRow :number="1" title="Le narrateur et le dessin" :duration="480" />
 */
import { computed } from "vue";
import { formatDuration } from "~/utils/formatDuration";

interface Props {
  /** Position of the chapter in the book, starting at 1 */
  number: number;
  /** Chapter title, in the learned language */
  title: string;
  /** Title in the user's native language, shown below in grey */
  translatedTitle?: string | null;
  /** Length in seconds; the pill is hidden when unknown */
  duration?: number | null;
}

const props = withDefaults(defineProps<Props>(), {
  translatedTitle: null,
  duration: null,
});

const formattedDuration = computed(() => formatDuration(props.duration));
</script>

<template>
  <li class="chapter-row" data-testid="chapter-row">
    <span class="chapter-row__number" data-testid="chapter-row-number">
      {{ number }}
    </span>
    <div class="chapter-row__card">
      <div class="chapter-row__titles">
        <p class="chapter-row__title" data-testid="chapter-row-title">
          {{ title }}
        </p>
        <p
          v-if="translatedTitle"
          class="chapter-row__translated-title"
          data-testid="chapter-row-translated-title"
        >
          {{ translatedTitle }}
        </p>
      </div>
      <span
        v-if="formattedDuration"
        class="chapter-row__duration"
        data-testid="chapter-row-duration"
      >
        {{ formattedDuration }}
      </span>
    </div>
  </li>
</template>

<style scoped>
.chapter-row {
  display: flex;
  align-items: center;
  gap: 16px;
  list-style: none;
}

.chapter-row__number {
  flex-shrink: 0;
  width: 20px;
  color: var(--color-text-primary);
  font-size: 22px;
  text-align: center;
}

.chapter-row__card {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 12px;
  min-width: 0;
  padding: 14px 16px 14px 20px;
  border: 1px solid var(--color-neutral);
  border-radius: 14px;
  background-color: var(--color-chip-theme);
}

.chapter-row__titles {
  flex: 1;
  min-width: 0;
}

.chapter-row__title,
.chapter-row__translated-title {
  margin: 0;
}

.chapter-row__title {
  color: var(--color-text-primary);
  font-size: 16px;
  line-height: 22px;
}

.chapter-row__translated-title {
  color: #8a8a8a;
  font-size: 14px;
  line-height: 20px;
}

.chapter-row__duration {
  flex-shrink: 0;
  padding: 4px 12px;
  border: 1px solid var(--color-neutral);
  border-radius: 10px;
  background-color: var(--color-secondary);
  color: var(--color-text-primary);
  font-size: 14px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}
</style>

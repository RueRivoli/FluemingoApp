<script setup lang="ts">
/**
 * ContentCategoryChip — shows the category of a piece of content
 * (icon + label) on a dark grey chip, as on the mobile app's cards.
 *
 * @example
 * <ContentCategoryChip category="Literature" />
 * <ContentCategoryChip category="Literature" icon="fa-solid fa-book" />
 */
import { computed } from "vue";
import {
  AUDIOBOOK_CATEGORIES,
  type AudiobookCategory,
} from "~/utils/audiobooks";

interface Props {
  /** Category id, one of AUDIOBOOK_CATEGORY_IDS */
  category: AudiobookCategory;
  /** Font Awesome classes of the leading icon; the category's own icon when omitted */
  icon?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  icon: null,
});

const label = computed(() => AUDIOBOOK_CATEGORIES[props.category].label);
const iconClasses = computed(() => props.icon ?? AUDIOBOOK_CATEGORIES[props.category].icon);
</script>

<template>
  <span class="content-category-chip" data-testid="content-category-chip">
    <span
      :class="['content-category-chip__icon', iconClasses]"
      aria-hidden="true"
      data-testid="content-category-chip-icon"
    />
    <span data-testid="content-category-chip-label">{{ label }}</span>
  </span>
</template>

<style scoped>
.content-category-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 6px;
  background-color: var(--color-chip-category);
  color: var(--color-bg);
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  white-space: nowrap;
}

.content-category-chip__icon {
  width: 16px;
  text-align: center;
}
</style>

<script setup lang="ts">
/**
 * ContentCategoryChip — shows the category of a piece of content
 * (icon + label) on a dark grey chip, as on the mobile app's cards.
 *
 * @example
 * <ContentCategoryChip category="Literature" />
 * <ContentCategoryChip category="Literature" icon="fa-solid fa-book" />
 * <ContentCategoryChip label="Slow French" icon="fa-solid fa-person-walking" />
 * <ContentCategoryChip category="Literature" light />
 */
import { computed } from "vue";
import {
  AUDIOBOOK_CATEGORIES,
  type AudiobookCategory,
} from "~/utils/audiobooks";

interface Props {
  /** Audiobook category id, one of AUDIOBOOK_CATEGORY_IDS; gives the default label and icon */
  category?: AudiobookCategory | null;
  /** Text of the chip, for other kinds of content (e.g. video categories); the category's own label when omitted */
  label?: string | null;
  /** Font Awesome classes of the leading icon; the category's own icon when omitted */
  icon?: string | null;
  /** Compact version (smaller padding and text), for dense cards */
  light?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  category: null,
  label: null,
  icon: null,
  light: false,
});

const category = computed(() =>
  props.category ? AUDIOBOOK_CATEGORIES[props.category] : null,
);
const displayLabel = computed(() => props.label ?? category.value?.label ?? "");
const iconClasses = computed(() => props.icon ?? category.value?.icon ?? null);
</script>

<template>
  <span
    :class="['content-category-chip', { 'content-category-chip--light': light }]"
    data-testid="content-category-chip"
  >
    <span
      v-if="iconClasses"
      :class="['content-category-chip__icon', iconClasses]"
      aria-hidden="true"
      data-testid="content-category-chip-icon"
    />
    <span data-testid="content-category-chip-label">{{ displayLabel }}</span>
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

.content-category-chip--light {
  gap: 4px;
  padding: 3px 7px;
  font-size: 12px;
  line-height: 16px;
}

.content-category-chip--light .content-category-chip__icon {
  width: 12px;
}
</style>

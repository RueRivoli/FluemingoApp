<script setup lang="ts">
/**
 * ContentDateBadge — publication date laid over a cover image, with a
 * calendar icon ("Oct 7, 2026"). Renders nothing when the date is invalid.
 *
 * @example
 * <ContentDateBadge :date="article.published_at" />
 */
import { computed } from "vue";
import { formatShortDate } from "~/utils/formatShortDate";

interface Props {
  /** Date to show: a Date or an ISO string such as Supabase's published_at */
  date: string | Date;
}

const props = defineProps<Props>();

const label = computed(() => formatShortDate(props.date));
// Only read when label is set, i.e. when the date is valid.
const isoDate = computed(() => new Date(props.date).toISOString());
</script>

<template>
  <span v-if="label" class="content-date-badge" data-testid="content-date-badge">
    <span
      class="content-date-badge__icon fa-regular fa-calendar"
      aria-hidden="true"
      data-testid="content-date-badge-icon"
    />
    <time :datetime="isoDate" data-testid="content-date-badge-label">{{ label }}</time>
  </span>
</template>

<style scoped>
.content-date-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: var(--color-overlay);
  color: var(--color-bg);
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  white-space: nowrap;
}

.content-date-badge__icon {
  width: 14px;
  text-align: center;
}
</style>

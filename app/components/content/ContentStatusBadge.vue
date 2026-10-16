<script setup lang="ts">
/**
 * ContentStatusBadge — reading-progress badge laid over a cover image:
 * "Not started", "In progress" (orange dots) or "Finished" (green check).
 *
 * @example
 * <ContentStatusBadge status="in_progress" />
 */
import { computed } from "vue";
import { CONTENT_STATUS_LABELS, type ContentStatus } from "~/utils/contentStatus";

interface Props {
  /** Reading progress to display */
  status: ContentStatus;
}

const props = defineProps<Props>();

// "Not started" is text only, as in the mobile app.
const STATUS_ICONS: Partial<Record<ContentStatus, string>> = {
  in_progress: "fa-solid fa-ellipsis",
  finished: "fa-solid fa-check",
};

const label = computed(() => CONTENT_STATUS_LABELS[props.status]);
const icon = computed(() => STATUS_ICONS[props.status]);
</script>

<template>
  <span
    :class="['content-status-badge', `content-status-badge--${status}`]"
    data-testid="content-status-badge"
  >
    <span
      v-if="icon"
      :class="['content-status-badge__icon', icon]"
      aria-hidden="true"
      data-testid="content-status-badge-icon"
    />
    <span data-testid="content-status-badge-label">{{ label }}</span>
  </span>
</template>

<style scoped>
.content-status-badge {
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

.content-status-badge__icon {
  font-size: 11px;
}

.content-status-badge--in_progress .content-status-badge__icon {
  color: var(--color-status-in-progress);
}

.content-status-badge--finished .content-status-badge__icon {
  color: var(--color-success);
}
</style>

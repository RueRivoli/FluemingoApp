<script setup lang="ts">
/**
 * VideoFilterChip — quick filter chip of the Videos page (Figma
 * VideoFilterChip): optional leading Font Awesome icon and a label, tinted
 * in the primary colour when active.
 *
 * @example
 * <VideoFilterChip label="Vlogs" icon="fa-solid fa-video" :active="isVlogs" @click="pickVlogs" />
 */
interface Props {
  /** Text of the chip */
  label: string;
  /** Font Awesome classes of the leading icon; no icon when omitted */
  icon?: string | null;
  /** Whether the filter is the selected one */
  active?: boolean;
}

withDefaults(defineProps<Props>(), {
  icon: null,
  active: false,
});

const emit = defineEmits<{
  /** Fired when the chip is clicked */
  click: [];
}>();
</script>

<template>
  <button
    type="button"
    :class="['video-filter-chip', { 'video-filter-chip--active': active }]"
    :aria-pressed="active"
    data-testid="video-filter-chip"
    @click="emit('click')"
  >
    <span
      v-if="icon"
      :class="['video-filter-chip__icon', icon]"
      aria-hidden="true"
      data-testid="video-filter-chip-icon"
    />
    <span data-testid="video-filter-chip-label">{{ label }}</span>
  </button>
</template>

<style scoped>
.video-filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid var(--color-border-muted);
  border-radius: 8px;
  background-color: var(--color-bg);
  color: var(--color-text-primary);
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  white-space: nowrap;
  cursor: pointer;
}

.video-filter-chip__icon {
  color: var(--color-text-light);
  font-size: 13px;
}

.video-filter-chip--active {
  border-color: color-mix(in srgb, var(--color-primary-dark) 60%, transparent);
  background-color: color-mix(in srgb, var(--color-primary-dark) 10%, var(--color-bg));
  color: var(--color-primary-dark);
}

.video-filter-chip--active .video-filter-chip__icon {
  color: inherit;
}

.video-filter-chip:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>

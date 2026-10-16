<script setup lang="ts">
/**
 * NewChip — yellow "NEW" badge with a star, marking fresh content.
 *
 * @example
 * <NewChip />
 * <NewChip label="NOUVEAU" />
 */
interface Props {
  /** Text of the badge */
  label?: string;
}

withDefaults(defineProps<Props>(), {
  label: "NEW",
});
</script>

<template>
  <span class="new-chip" data-testid="new-chip">
    <span
      class="new-chip__icon fa-solid fa-star"
      aria-hidden="true"
      data-testid="new-chip-icon"
    />
    <span data-testid="new-chip-label">{{ label }}</span>
  </span>
</template>

<style scoped>
.new-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 8px;
  background-color: var(--color-secondary);
  color: var(--color-text-primary);
  font-size: 14px;
  font-weight: 600;
  line-height: 18px;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.new-chip__icon {
  font-size: 13px;
}
</style>

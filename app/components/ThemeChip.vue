<script setup lang="ts">
/**
 * ThemeChip — light grey tag naming one theme of a piece of content,
 * with an optional leading Font Awesome icon. Built on PrimeVue's Chip.
 *
 * @example
 * <ThemeChip label="Education" icon="fa-regular fa-graduation-cap" />
 */
import Chip from "primevue/chip";

interface Props {
  /** Text of the chip */
  label: string;
  /** Font Awesome classes of the leading icon; no icon when omitted */
  icon?: string;
  /** If theme is selected */
  selected: boolean;
}

const props = defineProps<Props>();

// Chip has no attribute props for its inner elements: pass-through adds the
// test hooks and hides the decorative icon from screen readers.
const PASS_THROUGH = {
  root: { "data-testid": "theme-chip" },
  icon: { "aria-hidden": "true", "data-testid": "theme-chip-icon" },
  label: { "data-testid": "theme-chip-label" },
} as const;
</script>

<template>
  <Chip
    class="theme-chip"
    :class="{ selected: props.selected }"
    :label="label"
    :icon="icon"
    :pt="PASS_THROUGH"
  />
</template>

<style scoped>
.theme-chip {
  gap: 6px;
  padding: 6px 10px;
  border-radius: 6px;
  background-color: var(--color-chip-theme);
  border: 1px solid var(--color-background);
  color: var(--color-chip-theme-text);
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  white-space: nowrap;
}

.selected {
  background-color: var(--color-secondary);
  border: 1px solid var(--color-neutral);
}
.theme-chip :deep(.p-chip-icon) {
  width: 16px;
  color: inherit;
  font-size: inherit;
  text-align: center;
}

.theme-chip :deep(.p-chip-label) {
  line-height: inherit;
}
</style>

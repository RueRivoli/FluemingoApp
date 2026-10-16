<script setup lang="ts">
/**
 * LevelChip — CEFR level chip (PrimeVue Chip). The border always takes the
 * level colour, as in the Figma LevelChip; the pastel fill shows when selected.
 *
 * @example
 * <LevelChip level="B1" label="B1" selected />
 */
import Chip from "primevue/chip";
import { computed } from "vue";

interface Props {
  /** CEFR level ("A1" … "C1", any casing) or "All" */
  level?: string;
  /** Fills the chip with the pastel level colour */
  selected?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  level: "a1",
  selected: false,
});

// Full class names, never built with `bg-${...}`: Tailwind only generates
// the classes it finds written as-is in the source.
// Border: level colour at 60%, like the Figma LevelChip.
const BORDER_CLASSES: Record<string, string> = {
  a1: "border-cefr-a1/60",
  a2: "border-cefr-a2/60",
  b1: "border-cefr-b1/60",
  b2: "border-cefr-b2/60",
  c1: "border-cefr-c1/60",
};
// Pastel background, like the mobile app.
const SELECTED_CLASSES: Record<string, string> = {
  a1: "bg-cefr-a1-pastel",
  a2: "bg-cefr-a2-pastel",
  b1: "bg-cefr-b1-pastel",
  b2: "bg-cefr-b2-pastel",
  c1: "bg-cefr-c1-pastel",
};
// "All" and unknown values have no level colour.
const DEFAULT_BORDER_CLASS = "border-outline/30";
const DEFAULT_SELECTED_CLASS = "bg-primary-pastel text-primary-dark";
const UNSELECTED_CLASS = "bg-white";

const levelKey = computed(() => props.level.toLowerCase());

const borderClass = computed(() => {
  if (!props.selected) return DEFAULT_BORDER_CLASS;
  return BORDER_CLASSES[levelKey.value] ?? DEFAULT_BORDER_CLASS;
});

const colorClass = computed(() => {
  if (!props.selected) return UNSELECTED_CLASS;
  return SELECTED_CLASSES[levelKey.value] ?? DEFAULT_SELECTED_CLASS;
});
</script>

<template>
  <Chip
    class="border rounded-md cursor-pointer"
    :class="[borderClass, colorClass]"
    data-testid="level-chip"
  />
</template>

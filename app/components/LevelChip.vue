<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    level?: string;
    selected?: boolean;
  }>(),
  {
    level: "a1",
    selected: false,
  },
);

// Full class names, never built with `bg-${...}`: Tailwind only generates
// the classes it finds written as-is in the source.
// Pastel background + level color text, like the mobile app.
const selectedClasses: Record<string, string> = {
  a1: "bg-cefr-a1-pastel",
  a2: "bg-cefr-a2-pastel",
  b1: "bg-cefr-b1-pastel",
  b2: "bg-cefr-b2-pastel",
  c1: "bg-cefr-c1-pastel",
};

const colorClass = computed(() =>
  props.selected
    ? (selectedClasses[props.level.toLowerCase()] ??
      "bg-primary-pastel text-primary-dark")
    : "bg-white",
);
</script>

<template>
  <Chip
    class="border border-outline/30 rounded-md cursor-pointer"
    :class="colorClass"
  />
</template>

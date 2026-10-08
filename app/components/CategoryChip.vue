<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    category?: string;
    logo: string;
    selected?: boolean;
  }>(),
  {
    category: "vlogs",
    logo: "",
    selected: false,
  },
);

const colorClass = computed(() => (props.selected ? "bg-red" : "bg-white"));
</script>

<template>
  <Chip
    class="border border-outline/30 rounded-md cursor-pointer"
    :class="colorClass"
  >
    <template #icon> </template>
  </Chip>
</template>

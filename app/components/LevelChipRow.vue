<script setup lang="ts">
import { LEVELS, type Level } from "~/utils/constants";

const props = withDefaults(
  defineProps<{
    selectedLevel?: string;
  }>(),
  {
    selectedLevel: "a1",
  },
);
</script>

<template>
  <h3 class="mb-2 text-text-primary font-medium">Level</h3>
  <LevelChip
    class="mr-2"
    v-for="level in LEVELS"
    :key="level"
    :label="level"
    :level="level"
    :selected="props.selectedLevel === level"
    @click="$emit('level-change', level)"
  >
  </LevelChip>
</template>

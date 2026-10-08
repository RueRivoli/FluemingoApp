<script setup lang="ts">
import { ref } from "vue";

useHead({ title: "Audiobooks — Fluemingo" });

const levels = ["All", "A1", "A2", "B1", "B2", "C1"];
const selectedLevel = ref("All");
</script>

<template>
  <PageTitle
    title="Audiobooks"
    :crumbs="[
      { text: 'Home', href: '/' },
      { text: 'Audiobooks', href: '/app/browse/audiobooks' },
    ]"
  />
  <div class="">
    <h3 class="mb-2 text-text-primary font-medium">Level</h3>
    <LevelChip
      v-for="(level, n) in levels"
      :key="n"
      :label="level"
      :level="level"
      class="mr-2"
      :selected="selectedLevel === level"
      @click="selectedLevel = level"
    >
    </LevelChip>
  </div>
</template>

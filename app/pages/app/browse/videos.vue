<script setup lang="ts">
useHead({ title: "Videos — Fluemingo" });

const categories = ["All", "Slow French", "Vlogs", "History"];
const selectedCategory = ref("All");
</script>

<template>
  <PageTitle
    title="Videos"
    :crumbs="[
      { text: 'Home', href: '/' },
      { text: 'Videos', href: '/app/browse/videos' },
    ]"
  />
  <div class="">
    <h3 class="mb-2 text-text-primary font-medium">Category</h3>
    <CategoryChip
      v-for="(cat, n) in categories"
      :key="n"
      :label="cat"
      :level="cat"
      class="mr-2"
      :selected="selectedCategory === cat"
      @click="selectedCategory = cat"
    >
    </CategoryChip>
  </div>
</template>

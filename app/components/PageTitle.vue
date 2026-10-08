<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    title: string;
    crumbs?: Array<{ text: string; href: string }>;
  }>(),
  {
    crumbs: () => [],
  },
);

// PrimeVue Breadcrumb expects { label, ... }; the last crumb is the current page.
const items = computed(() =>
  props.crumbs.map((crumb, index) => ({
    label: crumb.text,
    href: crumb.href,
    current: index === props.crumbs.length - 1,
  })),
);
</script>

<template>
  <header class="page-title">
    <Breadcrumb v-if="items.length" :model="items" class="page-breadcrumb">
      <template #item="{ item }">
        <span v-if="item.current" aria-current="page" class="font-bold">
          {{ item.label }}
        </span>
        <NuxtLink v-else :to="item.href" class="text-primary-dark no-underline">
          {{ item.label }}
        </NuxtLink>
      </template>
    </Breadcrumb>
    <h1>{{ props.title }}</h1>
  </header>
</template>

<style scoped>
.page-title {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.page-breadcrumb {
  padding: 0;
  background: transparent;
}
</style>

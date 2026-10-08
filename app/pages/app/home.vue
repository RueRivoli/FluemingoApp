<script setup lang="ts">
useHead({ title: "Home — Fluemingo" });

const userStore = useUserStore();
</script>

<template>
  <h1 v-if="userStore.isLoggedIn">
    Welcome, <span class="accent">{{ userStore.fullName }}</span>
  </h1>
  <ProgressSpinner v-else style="width: 2.5rem; height: 2.5rem" />
</template>

<style scoped>
h1 {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  overflow-wrap: anywhere;
}

.accent {
  color: var(--color-primary-dark);
}
</style>

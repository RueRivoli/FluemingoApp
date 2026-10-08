<script setup lang="ts">
// Parent of every /app/* page: shared layout and auth guard.
definePageMeta({ layout: "app", middleware: "auth" });
</script>

<template>
  <NuxtPage />
</template>

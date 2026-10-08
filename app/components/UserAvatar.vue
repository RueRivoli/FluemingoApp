<script setup lang="ts">
const props = withDefaults(defineProps<{ avatarUrl?: string }>(), {
  avatarUrl: "https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png",
});
</script>

<template>
  <Avatar :image="props.avatarUrl" size="large" shape="circle" />
</template>

<style scoped></style>

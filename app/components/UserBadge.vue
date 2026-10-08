<script setup lang="ts">
const props = withDefaults(defineProps<{ avatarUrl?: string; fullName?: string }>(), {
  avatarUrl: "https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png",
  fullName: "John Doe",
});
</script>

<template>
  <div class="flex items-center space-x-2">
    <UserAvatar :avatarUrl="props.avatarUrl" />
    <span>{{ props.fullName }}</span>
  </div>
</template>

<style scoped></style>

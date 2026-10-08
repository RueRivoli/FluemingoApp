<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { User } from "@supabase/supabase-js";

useHead({ title: "Home — Fluemingo" });

const user = ref<User | null>(null);

onMounted(async () => {
  const { data } = await useSupabase().auth.getUser();
  user.value = data.user;
});
</script>

<template>
  <h1 v-if="user">
    Welcome, <span class="accent">{{ user.user_metadata?.full_name || user.email }}</span>
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

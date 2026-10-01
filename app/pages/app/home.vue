<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { User } from "@supabase/supabase-js";

definePageMeta({ middleware: "auth" });
useHead({ title: "Home — Fluemingo" });

const user = ref<User | null>(null);
const signingOut = ref(false);

onMounted(async () => {
  const { data } = await useSupabase().auth.getUser();
  user.value = data.user;
});

async function logOut() {
  signingOut.value = true;
  await useSupabase().auth.signOut();
  await navigateTo("/auth", { replace: true });
}
</script>

<template>
  <div class="app-home">
    <header class="app-header">
      <BadgeLogo theme="light" />
      <Button
        label="Log out"
        severity="secondary"
        outlined
        size="small"
        :loading="signingOut"
        @click="logOut"
      />
    </header>

    <main class="app-main">
      <!-- Rendered client-side only: the prerendered HTML has no user. -->
      <ClientOnly>
        <h1 v-if="user">
          Welcome, <span class="accent">{{ user.user_metadata?.full_name || user.email }}</span>
        </h1>
        <ProgressSpinner v-else style="width: 2.5rem; height: 2.5rem" />
      </ClientOnly>
    </main>
  </div>
</template>

<style scoped>
.app-home {
  min-height: 100vh;
  background-color: var(--color-background);
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: min(100%, var(--page-max-width));
  margin: 0 auto;
  padding: 1rem var(--page-gutter);
}

.app-main {
  width: min(100%, var(--page-max-width));
  margin: 0 auto;
  padding: var(--section-spacing) var(--page-gutter);
}

.app-main h1 {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  overflow-wrap: anywhere;
}

.accent {
  color: var(--color-primary-dark);
}
</style>

<script setup lang="ts">
import { ref } from "vue";

const route = useRoute();
const userStore = useUserStore();

const signingOut = ref(false);

async function logOut() {
  signingOut.value = true;
  await userStore.signOut();
  await navigateTo(AUTH_PATH, { replace: true });
}

// Static menu: "Browse" is a fixed group header, not a collapsible panel.
const items = [
  {
    label: "Browse",
    items: [
      {
        label: "Videos",
        icon: "fa-regular fa-play",
        route: "/app/browse/videos",
      },
      {
        label: "Audiobooks",
        icon: "fa-regular fa-headphones",
        route: "/app/browse/audiobooks",
      },
      {
        label: "Articles",
        icon: "fa-regular fa-file-lines",
        route: "/app/browse/news",
      },
      {
        label: "Flashcards",
        icon: "fa-regular fa-cards-blank",
        route: "/app/browse/flashcards",
      },
    ],
  },
];

function isActive(path?: string) {
  return !!path && route.path.replace(/\/$/, "") === path;
}
</script>

<template>
  <nav class="app-sidebar" aria-label="App navigation">
    <NuxtLink to="/app/home" class="sidebar-logo" aria-label="Home">
      <UserBadge :full-name="userStore.fullName" :avatar-url="userStore.avatarUrl" />
    </NuxtLink>

    <Menu
      :model="items"
      class="sidebar-menu"
      :pt="{ root: { style: { border: 'none' } } }"
    >
      <template #item="{ item, props }">
        <NuxtLink
          :to="item.route"
          class="sidebar-link"
          :class="{ active: isActive(item.route) }"
          v-bind="props.action"
        >
          <span :class="item.icon" class="sidebar-icon" />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </template>
    </Menu>

    <Button
      class="sidebar-logout"
      label="Log out"
      severity="secondary"
      outlined
      size="small"
      :loading="signingOut"
      @click="logOut"
    />
  </nav>
</template>

<style scoped>
.app-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
  padding: 1rem;
  background-color: var(--color-bg);
  overflow-y: auto;
}

.sidebar-logo {
  display: inline-flex;
  padding: 0 0.5rem;
}

.sidebar-menu {
  width: 100%;
  background: transparent;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.9rem;
  color: var(--color-text);
  text-decoration: none;
  border-radius: 6px;
}

.sidebar-link.active {
  color: var(--color-primary-dark);
  background-color: var(--p-highlight-background);
  font-weight: 700;
}

/* Pushed to the bottom of the sidebar. */
.sidebar-logout {
  margin-top: auto;
}

.sidebar-icon {
  width: 1.1rem;
  text-align: center;
  color: var(--color-primary-dark);
}
</style>

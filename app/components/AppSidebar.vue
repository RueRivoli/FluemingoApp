<script setup lang="ts">
/**
 * AppSidebar — navigation of the app: user badge, Browse menu and log out.
 * A toggle reduces it to an icon rail (avatar, menu icons, log-out icon).
 *
 * @example
 * <AppSidebar v-model:collapsed="isSidebarCollapsed" />
 */
import { computed, ref } from "vue";
import { navigateTo, useRoute } from "#imports";
import { useUserStore } from "~/stores/user";
import { AUTH_PATH } from "~/utils/constants";

/** Icon rail mode: only icons, labels moved to tooltips and aria-labels */
const isCollapsed = defineModel<boolean>("collapsed", { default: false });

const route = useRoute();
const userStore = useUserStore();

const signingOut = ref(false);

const toggleLabel = computed(() =>
  isCollapsed.value ? "Expand sidebar" : "Collapse sidebar",
);

async function logOut() {
  signingOut.value = true;
  // The store forgets the user even when Supabase fails, so leave the app
  // either way.
  try {
    await userStore.signOut();
  } finally {
    await navigateTo(AUTH_PATH, { replace: true });
  }
}

function toggleCollapsed() {
  isCollapsed.value = !isCollapsed.value;
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
        route: "/app/browse/articles",
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
  <nav
    id="app-sidebar"
    class="app-sidebar"
    :class="{ 'app-sidebar--collapsed': isCollapsed }"
    aria-label="App navigation"
    data-testid="app-sidebar"
  >
    <div class="sidebar-header">
      <NuxtLink to="/app/home" class="sidebar-logo" aria-label="Home">
        <!-- Same footprint as the badge, so the menu doesn't jump once the profile arrives. -->
        <Skeleton
          v-if="userStore.isProfileLoading"
          :width="isCollapsed ? '3rem' : '10rem'"
          height="3rem"
          border-radius="1.5rem"
        />
        <UserAvatar
          v-else-if="isCollapsed"
          :avatar-url="userStore.avatarUrl"
          data-testid="app-sidebar-avatar"
        />
        <UserBadge
          v-else
          :full-name="userStore.fullName"
          :avatar-url="userStore.avatarUrl"
          data-testid="app-sidebar-badge"
        />
      </NuxtLink>

      <button
        type="button"
        class="sidebar-toggle"
        :aria-label="toggleLabel"
        :title="toggleLabel"
        :aria-expanded="!isCollapsed"
        aria-controls="app-sidebar"
        data-testid="app-sidebar-toggle"
        @click="toggleCollapsed"
      >
        <span class="fa-regular fa-sidebar" aria-hidden="true" />
      </button>
    </div>

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
          :aria-label="isCollapsed ? item.label : undefined"
          :title="isCollapsed ? item.label : undefined"
          v-bind="props.action"
          data-testid="app-sidebar-link"
        >
          <span :class="item.icon" class="sidebar-icon" aria-hidden="true" />
          <span v-if="!isCollapsed" data-testid="app-sidebar-link-label">
            {{ item.label }}
          </span>
        </NuxtLink>
      </template>
    </Menu>

    <Button
      class="sidebar-logout"
      :label="isCollapsed ? undefined : 'Log out'"
      :icon="isCollapsed ? 'fa-regular fa-arrow-right-from-bracket' : undefined"
      :aria-label="isCollapsed ? 'Log out' : undefined"
      severity="secondary"
      outlined
      size="small"
      :loading="signingOut"
      data-testid="app-sidebar-logout"
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
  overflow-x: hidden;
  overflow-y: auto;
}

.app-sidebar--collapsed {
  align-items: center;
  padding: 1rem 0.75rem;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.app-sidebar--collapsed .sidebar-header {
  flex-direction: column;
  gap: 0.75rem;
}

.sidebar-logo {
  display: inline-flex;
  min-width: 0;
  padding: 0 0.5rem;
  overflow: hidden;
  text-decoration: none;
}

.app-sidebar--collapsed .sidebar-logo {
  padding: 0;
}

.sidebar-toggle {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: none;
  color: var(--color-text-light);
  cursor: pointer;
}

.sidebar-toggle:hover {
  background-color: var(--color-bg-muted);
  color: var(--color-text-primary);
}

.sidebar-toggle:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.sidebar-menu {
  width: 100%;
  background: transparent;
}

/* The "Browse" group header has no room in the icon rail. */
.app-sidebar--collapsed :deep(.p-menu-submenu-label) {
  display: none;
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

.app-sidebar--collapsed .sidebar-link {
  justify-content: center;
  padding: 0.75rem 0;
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

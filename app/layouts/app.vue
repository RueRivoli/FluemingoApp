<script setup lang="ts"></script>

<template>
  <div class="app-layout">
    <aside class="app-aside">
      <AppSidebar />
    </aside>

    <div class="app-content">
      <main class="app-main">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  --sidebar-width: 240px;
  min-height: 100vh;
  background-color: var(--color-background);
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem var(--page-gutter);
}

.app-main {
  padding: 1rem var(--page-gutter) var(--section-spacing);
}

/* Desktop: sidebar pinned to the left edge of the screen, full height. */
@media (min-width: 768px) {
  .app-aside {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: var(--sidebar-width);
  }

  .app-content {
    margin-left: var(--sidebar-width);
  }
}
</style>

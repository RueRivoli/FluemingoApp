<script setup lang="ts">
import BadgeLogo from "./BadgeLogo.vue";

const props = withDefaults(
  defineProps<{
    theme?: "light" | "blue";
  }>(),
  {
    theme: "blue",
  },
);

const route = useRoute();

// Sur la home : remonte en haut. Ailleurs : retour à la home.
async function goHome() {
  if (route.path !== "/") {
    await navigateTo("/");
    return;
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Sur la home : scroll fluide. Ailleurs (blog, etc.) : retour à la home sur la section.
async function scrollToSection(id: string) {
  if (route.path !== "/") {
    await navigateTo(`/#${id}`);
    return;
  }
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth" });
}
</script>

<template>
  <nav class="navbar" :class="`navbar-${theme}`">
    <BadgeLogo :theme="theme" />
    <ul class="nav-links" :class="`nav-links-${theme}`">
      <li>
        <a href="/" @click.prevent="goHome">Home</a>
      </li>
      <li>
        <NuxtLink to="/blog">Blog</NuxtLink>
      </li>
      <li>
        <a href="/#features" @click.prevent="scrollToSection('features')"
          >Features</a
        >
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem 2rem;
  width: min(100%, var(--page-max-width));
  margin: 0 auto;
  padding: 1rem var(--page-gutter);
  flex-shrink: 0;
}

.navbar-blue {
  background-color: var(--color-primary);
  color: white;
}
.navbar-light {
  background-color: var(--color-background);
  color: var(--color-text);
}
.nav-links {
  display: flex;
  justify-content: flex-end;
  flex: 1 1 auto;
  width: auto;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-links a,
.nav-links :deep(a) {
  font-size: 0.9375rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
}

.nav-links a:hover,
.nav-links :deep(a:hover) {
  color: var(--color-secondary);
}
.nav-links-light a,
.nav-links-light :deep(a) {
  color: var(--color-text);
}
.nav-links-blue a,
.nav-links-blue :deep(a) {
  color: white;
}

@media (max-width: 900px) {
  .navbar {
    justify-content: center;
  }

  .nav-links {
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .navbar {
    flex-direction: column;
    gap: 0.75rem;
    padding-top: 1.25rem;
  }

  .nav-links {
    width: 100%;
    gap: 0.75rem 1.25rem;
  }

  .nav-links a,
  .nav-links :deep(a) {
    font-size: 0.875rem;
  }
}
</style>

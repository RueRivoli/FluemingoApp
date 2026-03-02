<script setup lang="ts">
import BadgeLogo from './BadgeLogo.vue';

const props = withDefaults(
  defineProps<{
    theme?: 'light' | 'blue'
  }>(),
  {
    theme: 'blue'
  }
)

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  el?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
    <nav class="navbar" :class="`navbar-${theme}`">
      <BadgeLogo :theme="theme" />
      <ul class="nav-links" :class="`nav-links-${theme}`">
        <li>
          <a href="#features" @click.prevent="scrollToSection('features')">Features</a>
        </li>
        <li>
          <a href="#apercu" @click.prevent="scrollToSection('apercu')">Aperçu</a>
        </li>
      </ul>
    </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
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
  justify-content: flex-start;
  width: 40vw;
  align-items: center;
  gap: 8rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-links a {
  font-size: 0.9375rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: var(--color-secondary);
}
.nav-links-light a{
  color: var(--color-text);
}
.nav-links-blue a{
  color: white;
}
</style>

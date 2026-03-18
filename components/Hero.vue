<script setup lang="ts">
import NavBar from './NavBar.vue';

const props = withDefaults(
  defineProps<{
    appStoreUrl?: string
    googlePlayUrl?: string
  }>(),
  {
    appStoreUrl: 'https://apps.apple.com/app/ton-app-id',
    googlePlayUrl: 'https://play.google.com/store/apps/details?id=ton.app.id',
  }
)
</script>

<template>
  <div class="hero hero-content">
   <NavBar />
    <div class="hero-body">
      <div class="hero-text enter">
        <p>Learn <img class="flag ml-4 mr-2" src="../assets/flags/english.svg" alt="English"><img class="flag mr-2" src="../assets/flags/french.svg" alt="French"><img class="flag mr-4" src="../assets/flags/spanish.svg" alt="Spanish"> with your</p>
        <p class="highlight">Favorite Content</p>
        <br>
        <p>Build a </p>
        <p class="highlight">Strong and Lasting Vocabulary</p>
        <br>
        <div class="store-badges">
          <a
            :href="appStoreUrl"
            class="store-badge"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Télécharger sur l'App Store"
          >
            <img src="../assets/download/apple-store/en/logo.svg" alt="App Store" />
          </a>
          <a
            :href="googlePlayUrl"
            class="store-badge"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Disponible sur Google Play"
          >
            <img src="../assets/download/google-play/en/logo.svg" alt="Google Play" />
          </a>
        </div>
      </div>
      <div class="hero-image">
        <img src="../assets/img/hero-large-min.png" width="800" height="auto" alt="Hero Image" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero {
  display: flex;
  flex-direction: column;
  background-color: var(--color-primary);
  padding: 0;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  min-height: 100vh;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  color: white;
  flex-shrink: 0;
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
  color: white;
  text-decoration: none;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: var(--color-secondary);
}

.hero-body {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex: 1;
  padding: 0 4rem 4rem;
}

.flag {
  width: 2rem;
  height: 2rem;
}

.mr-2 {
  margin-right: 0.5rem;
}

.ml-4 {
  margin-left: 1rem;
}

.mr-4 {
  margin-right: 1rem;
}

.store-badges {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.store-badge {
  display: inline-block;
  line-height: 0;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.store-badge:hover {
  transform: scale(1.05);
  opacity: 0.9;
}

.store-badge img {
  height: 56px;
  width: auto;
  display: block;
}

.hero-text {
  font-size: 2rem;
}

.highlight {
  color: var(--color-secondary);
  font-weight: bold;
}

@media (max-width: 640px) {
  .navbar {
    padding: 0.6rem 1rem;
  }

  .nav-links {
    gap: 1.25rem;
  }

  .nav-links a {
    font-size: 0.875rem;
  }

  .hero-body {
    padding: 0 1.5rem 2rem;
    flex-direction: column;
    gap: 2rem;
  }

  .hero-text {
    font-size: 1.5rem;
  }
}
</style>

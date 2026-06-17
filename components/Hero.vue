<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    appStoreUrl?: string;
    googlePlayUrl?: string;
  }>(),
  {
    appStoreUrl: "https://apps.apple.com/app/ton-app-id",
    googlePlayUrl: "https://play.google.com/store/apps/details?id=ton.app.id",
  },
);
</script>

<template>
  <div class="hero hero-content">
    <NavBar />
    <div class="hero-body">
      <div class="hero-text enter">
        <p class="hero-line">
          Learn
          <NuxtImg
            class="flag ml-1 mr-2"
            src="/flags/french.svg"
            alt="French"
            loading="lazy"
          ></NuxtImg>
          <NuxtImg
            class="flag mr-2"
            src="/flags/english.svg"
            alt="French"
            loading="lazy"
          ></NuxtImg>
          with your
        </p>
        <p class="highlight">Favorite Content</p>
        <p class="hero-line hero-line-spaced">Build a</p>
        <p class="highlight">Strong and Lasting Vocabulary</p>
        <div class="store-badges">
          <a
            :href="appStoreUrl"
            class="store-badge"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Télécharger sur l'App Store"
          >
            <NuxtImg src="/download/apple-store/en/logo.svg" alt="App Store" />
          </a>
          <a
            :href="googlePlayUrl"
            class="store-badge"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Disponible sur Google Play"
          >
            <NuxtImg
              src="/download/google-play/en/logo.svg"
              alt="Google Play"
            />
          </a>
        </div>
      </div>
      <div class="hero-image">
        <NuxtImg
          src="/img/hero-large-min.png"
          width="800"
          height="auto"
          alt="Hero Image"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero {
  display: flex;
  flex-direction: column;
  background-color: var(--color-primary);
  padding: 0 0 2rem;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  min-height: 100vh;
  min-height: 100svh;
}

.hero-body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 0.95fr);
  gap: clamp(2rem, 5vw, 4rem);
  align-items: center;
  flex: 1;
  width: min(100%, var(--page-max-width));
  margin: 0 auto;
  padding: 1rem var(--page-gutter) 3rem;
}

.flag {
  width: clamp(2rem, 4vw, 2.5rem);
  height: clamp(2rem, 4vw, 2.5rem);
}

.mr-2 {
  margin-right: 0.5rem;
}

.ml-4 {
  margin-left: 1rem;
}
.ml-1 {
  margin-left: 1rem;
}
.mr-4 {
  margin-right: 1rem;
}

.store-badges {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2rem;
}

.store-badge {
  display: inline-block;
  line-height: 0;
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.store-badge:hover {
  transform: scale(1.05);
  opacity: 0.9;
}

.store-badge img {
  height: clamp(44px, 8vw, 56px);
  width: auto;
  display: block;
}

.hero-text {
  font-size: clamp(1.5rem, 2vw + 1rem, 2.65rem);
  line-height: 1.15;
  max-width: 16ch;
}

.hero-line {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.hero-line-spaced {
  margin-top: 1rem;
}

.highlight {
  color: var(--color-secondary);
  font-weight: bold;
}

@media (max-width: 1024px) {
  .hero-body {
    grid-template-columns: minmax(0, 1fr);
    justify-items: center;
    text-align: center;
  }

  .hero-text {
    max-width: 18ch;
  }

  .hero-line,
  .store-badges {
    justify-content: center;
  }

  .hero-image {
    width: min(100%, 640px);
  }
}

@media (max-width: 640px) {
  .hero-text {
    max-width: 100%;
  }

  .hero-body {
    padding-bottom: 2rem;
  }

  .ml-1 {
    margin-left: 0.5rem;
  }

  .mr-2 {
    margin-right: 0.375rem;
  }
}
</style>

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
  <div id="apercu" class="banner">
    <div class="banner-content">
      <div class="banner-content-left">
        <h2>Everything you need to stay consistent</h2>
        <ul>
          <li>10+ News Articles per week</li>
          <li>2+ New Audiobooks per week</li>
          <li>Flashcards to learn vocabulary</li>
          <li>Progress tracking</li>
        </ul>
        <div class="store-badges">
          <div>
            <a
              :href="appStoreUrl"
              class="store-badge"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download on the App Store"
            >
              <NuxtImg
                src="/download/apple-store/en/logo.svg"
                alt="App Store"
              />
            </a>
          </div>
          <div>
            <a
              :href="googlePlayUrl"
              class="store-badge"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Available on Google Play"
            >
              <NuxtImg
                src="/download/google-play/en/logo.svg"
                alt="Google Play"
              />
            </a>
          </div>
        </div>
      </div>
      <div class="banner-content-right">
        <NuxtImg
          src="/screenshots/metro-flamingo.png"
          width="1000"
          height="auto"
          alt="Banner"
          loading="lazy"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.banner {
  color: var(--color-text);
  background-color: var(--color-bg);
  border-radius: 1.5rem;
  margin: 0 auto var(--section-spacing);
  width: min(calc(100% - (2 * var(--page-gutter))), var(--page-max-width));
  overflow: hidden;
  box-shadow: 0 18px 50px rgba(26, 26, 26, 0.08);
}
.banner-content {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(280px, 1fr);
  gap: 2rem;
}
.banner-content-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(1.5rem, 4vw, 3rem);

  h2 {
    font-size: clamp(1.6rem, 1.3rem + 1vw, 2.3rem);
    margin-bottom: 1rem;
    line-height: 1.15;
  }

  ul {
    padding-left: 1rem;
    list-style-type: disc;
    display: grid;
    gap: 0.75rem;
  }
}
.banner-content-right {
  width: 100%;
  height: 100%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.store-badges {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1.5rem;
}

.store-badge {
  display: inline-block;
  line-height: 0;
}

.store-badge img {
  height: 48px;
  width: auto;
  display: block;
}

@media (max-width: 900px) {
  .banner-content {
    grid-template-columns: minmax(0, 1fr);
  }

  .banner-content-left {
    text-align: center;
    align-items: center;
  }

  .banner-content-left ul {
    text-align: left;
  }

  .store-badges {
    justify-content: center;
  }

  .banner-content-right {
    max-height: 520px;
  }
}
</style>

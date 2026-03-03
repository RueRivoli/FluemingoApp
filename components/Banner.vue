<script setup lang="ts">
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
    <div class="banner">
        <div class="banner-content">
            <div>
                <p>
                    <ul>
                        <li>
                            10+ Articles per week
                        </li>
                        <li>
                            5+ Audiobooks per week
                        </li>
                        <li>
                            Flashcards to learn vocabulary
                        </li>
                        <li>
                            Progress tracking
                        </li>
                        <li>
                            Recommendations
                        </li>
                    </ul>
<br>
<div class="store-badges">
          <a
            :href="appStoreUrl"
            class="store-badge"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download on the App Store"
          >
            <img src="../assets/download/apple-store/en/logo.svg" alt="App Store" />
          </a>
          <a
            :href="googlePlayUrl"
            class="store-badge"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Available on Google Play"
          >
            <img src="../assets/download/google-play/en/logo.svg" alt="Google Play" />
          </a>
        </div>
                </p>
            </div>
            <img src="../assets/screenshots/flamingo.png" width="50%" height="auto" alt="Banner" />
        </div>
    </div>
</template>

<style scoped>
.banner{
    color:var(--color-text);
    background-color:var(--background-color);
    border-radius:1rem;
    margin: 2rem;
    max-width:100%;
    overflow:hidden;
}
.banner-content{
    display: flex;
    justify-content: center;
    align-items: center;
}
.store-badges {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
}
</style>
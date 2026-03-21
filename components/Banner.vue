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
            <div class="banner-content-left">
                <ul>
                    <li>
                        10+ News Articles per week
                    </li>
                    <li>
                        5+ New Audiobooks per week
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
                <div class="store-badges">
                    <div>
                    <a
                        :href="appStoreUrl"
                        class="store-badge"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Download on the App Store"
                    >
                        <img src="/download/apple-store/en/logo.svg" alt="App Store" />
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
                    <img src="/download/google-play/en/logo.svg" alt="Google Play" />
                </a>
            </div>
                </div>
            </div>
            <div class="banner-content-right">
                <img src="/screenshots/flamingo-min.png" width="1000" height="auto" alt="Banner" loading="lazy" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.banner{
    color: var(--color-text);
    background-color:var(--background-color);
    border-radius:1rem;
    margin: 2rem;
    max-width:100%;
    overflow:hidden;
}
.banner-content{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
}
.banner-content-left{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    ul {
    padding-left: 1rem;
    list-style-type: disc;
  }
}
.banner-content-right{
    width: 100%;
    height: 100%;
    overflow: hidden;
    img{
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 1rem;
    }
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
}

.store-badge img {
  height: 48px;
  width: auto;
  display: block;
}
</style>
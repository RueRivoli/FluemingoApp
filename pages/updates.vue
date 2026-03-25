<script setup lang="ts">
import NavBar from '../components/NavBar.vue';
import Footer from '../components/Footer.vue';
</script>

<template>
  <div class="landing">
    <NavBar theme="light" />
    <div class="updates-container">
      <div class="updates-content">
        <h1>Update</h1>
        <p>We are constantly working to improve the app and add new features. Here are the latest updates:</p>
        <ul>
          <li>2026-03-03: Release of the app on the App Store and Google Play.</li>
        </ul>
      </div>
    </div>
    <Footer />
  </div>
</template>

<style scoped>
.landing {
  background-color: var(--color-background);
  min-height: 100vh;
}

.updates-container {
  width: min(100%, var(--page-max-width-narrow));
  margin: 0 auto;
  padding: clamp(2rem, 5vw, 3rem) var(--page-gutter);
}

.updates-content {
  padding: 1rem 0 0;
}

.updates-content ul {
  padding-left: 1.25rem;
}
</style>

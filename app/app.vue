<script setup lang="ts">
const route = useRoute();
const site = useSiteConfig();

// One canonical URL per page (with the trailing slash Netlify redirects to),
// so the .netlify.app and www variants never compete with fluemingo-app.com.
const canonicalUrl = computed(() => {
  const path = route.path.endsWith("/") ? route.path : `${route.path}/`;
  return `${site.url.replace(/\/$/, "")}${path}`;
});

useHead({
  link: [{ rel: "canonical", href: canonicalUrl }],
  meta: [{ property: "og:url", content: canonicalUrl }],
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

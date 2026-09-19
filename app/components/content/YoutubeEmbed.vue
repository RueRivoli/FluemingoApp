<script setup lang="ts">
const props = defineProps<{
  id: string;
  start?: string | number;
  title?: string;
}>();

const src = computed(() => {
  const url = new URL(`https://www.youtube-nocookie.com/embed/${props.id}`);
  if (props.start) url.searchParams.set("start", String(props.start));
  return url.toString();
});
</script>

<template>
  <figure class="youtube-embed">
    <iframe
      :src="src"
      :title="title ?? 'YouTube video'"
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
    />
  </figure>
</template>

<style scoped>
.youtube-embed {
  margin: 1.5rem 0;
  aspect-ratio: 16 / 9;
  max-width: 100%;
  border-radius: 0.75rem;
  overflow: hidden;
  background-color: var(--color-bg-dark);
}

.youtube-embed iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}
</style>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const imgError = ref(false)
function onImgError() {
  imgError.value = true
}

const props = withDefaults(defineProps<{ theme?: 'blue' | 'light' }>(), {
  theme: 'blue',
})

const logoSrc = computed(() =>
  props.theme === 'light'
    ? '/logo/official_small.png'
    : '/logo/official_small_white.png'
)

// If the theme changes, retry loading the new src
watch(logoSrc, () => {
  imgError.value = false
})
</script>

<template>
  <div :class="`badge-logo badge-${props.theme}`">
    <a href="/" >
    <img
      v-if="!imgError"
      :src="logoSrc"
      alt="Logo Fluemingo"
      href="/"
      width="32"
      height="32"
      @error="onImgError"
    />
</a>
    <span>Fluemingo</span>

  </div>
</template>

<style scoped>
.badge-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 2rem;

  &.badge-light{
    span{
        color: black;
    }
  }
}

.badge-logo img {
  width: 2rem;
  height: 2rem;
  object-fit: contain;
  display: block;
}
.badge-logo span {
    font-size: clamp(1.2rem, 2vw, 1.5rem);
    font-weight: 600;
    color: white;
}
</style>

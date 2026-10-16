<script setup lang="ts">
/**
 * FavoriteToggleButton — heart button laid over a cover image that toggles
 * the favorite state, or a lock when the content is gated.
 *
 * @example
 * <FavoriteToggleButton v-model="isFavorite" />
 * <FavoriteToggleButton locked @locked-click="openPaywall" />
 */
import { computed } from "vue";

interface Props {
  /** Shows a lock instead of the heart; clicks emit "lockedClick" and never toggle */
  locked?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  locked: false,
});

const emit = defineEmits<{
  /** Fired when the button is clicked while locked */
  lockedClick: [];
}>();

/** Whether the content is in the user's favorites */
const isFavorite = defineModel<boolean>({ default: false });

const iconClass = computed(() => {
  if (props.locked) return "fa-solid fa-lock";
  return isFavorite.value ? "fa-solid fa-heart" : "fa-regular fa-heart";
});

const ariaLabel = computed(() => {
  if (props.locked) return "Locked content";
  return isFavorite.value ? "Remove from favorites" : "Add to favorites";
});

function handleClick() {
  if (props.locked) {
    emit("lockedClick");
    return;
  }
  isFavorite.value = !isFavorite.value;
}
</script>

<template>
  <button
    type="button"
    :class="[
      'favorite-toggle-button',
      { 'favorite-toggle-button--active': isFavorite && !locked },
    ]"
    :aria-label="ariaLabel"
    :aria-pressed="locked ? undefined : isFavorite"
    data-testid="favorite-toggle-button"
    @click="handleClick"
  >
    <span
      :class="iconClass"
      aria-hidden="true"
      data-testid="favorite-toggle-button-icon"
    />
  </button>
</template>

<style scoped>
.favorite-toggle-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background-color: var(--color-overlay);
  color: var(--color-bg);
  font-size: 16px;
  cursor: pointer;
}

.favorite-toggle-button--active {
  color: var(--color-secondary);
}

.favorite-toggle-button:focus-visible {
  outline: 2px solid var(--color-secondary);
  outline-offset: 2px;
}
</style>

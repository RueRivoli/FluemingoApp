<script setup lang="ts">
/**
 * BaseButton — generic call-to-action button with an optional leading
 * Font Awesome icon. "primary" is the yellow main action, "outline" the
 * secondary one (Figma ActionButton).
 *
 * @example
 * <BaseButton icon="fa-regular fa-book-open" @click="read">Start Reading</BaseButton>
 * <BaseButton variant="outline" icon="fa-solid fa-download">Download</BaseButton>
 */
interface Props {
  /** Visual style of the button */
  variant?: "primary" | "outline";
  /** Font Awesome classes of the leading icon; no icon when omitted */
  icon?: string | null;
  /** Disables the button */
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  variant: "primary",
  icon: null,
  disabled: false,
});

const emit = defineEmits<{
  /** Fired when the button is clicked and not disabled */
  click: [event: MouseEvent];
}>();
</script>

<template>
  <button
    type="button"
    :class="['base-button', `base-button--${variant}`]"
    :disabled="disabled"
    data-testid="base-button"
    @click="emit('click', $event)"
  >
    <span
      v-if="icon"
      :class="['base-button__icon', icon]"
      aria-hidden="true"
      data-testid="base-button-icon"
    />
    <slot />
  </button>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 52px;
  padding: 0 24px;
  border: 1.5px solid transparent;
  border-radius: 10px;
  color: var(--color-text-primary);
  font-size: 17px;
  font-weight: 500;
  line-height: 24px;
  cursor: pointer;
  transition: filter 0.15s ease;
}

.base-button:hover:not(:disabled) {
  filter: brightness(0.96);
}

.base-button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.base-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.base-button--primary {
  background-color: var(--color-secondary);
}

.base-button--outline {
  border-color: var(--color-neutral);
  background-color: var(--color-bg);
}

.base-button__icon {
  font-size: 18px;
}
</style>

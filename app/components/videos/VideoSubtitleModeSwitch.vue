<script setup lang="ts">
/**
 * VideoSubtitleModeSwitch — segmented control of the subtitles panel to choose
 * what can be clicked in the lines: the transcript's units (Contextual), every
 * single word (Words) or nothing (Standard). Only the given modes are shown.
 *
 * @example
 * <VideoSubtitleModeSwitch v-model="mode" :modes="['words', 'standard']" />
 */
import { computed } from "vue";
import { SUBTITLE_MODES, type SubtitleMode } from "~/types/video";

interface ModeOption {
  value: SubtitleMode;
  label: string;
  /** Font Awesome icon class */
  icon: string;
  /** Tooltip explaining the mode */
  hint: string;
}

interface Props {
  /** Modes offered, e.g. without "contextual" when the transcript has no units */
  modes?: readonly SubtitleMode[];
}

const props = withDefaults(defineProps<Props>(), {
  modes: () => SUBTITLE_MODES,
});

const mode = defineModel<SubtitleMode>({ default: "contextual" });

const MODES: readonly ModeOption[] = [
  {
    value: "contextual",
    label: "Contextual",
    icon: "fa-puzzle-piece",
    hint: "Click words and expressions for their meaning in this sentence",
  },
  {
    value: "words",
    label: "Words",
    icon: "fa-language",
    hint: "Click any single word to translate it",
  },
  {
    value: "standard",
    label: "Standard",
    icon: "fa-closed-captioning",
    hint: "Plain subtitles",
  },
];

const options = computed(() => MODES.filter((option) => props.modes.includes(option.value)));
</script>

<template>
  <div
    class="video-subtitle-mode-switch"
    role="group"
    aria-label="Subtitle mode"
    data-testid="video-subtitle-mode-switch"
  >
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      :class="[
        'video-subtitle-mode-switch__option',
        { 'video-subtitle-mode-switch__option--active': option.value === mode },
      ]"
      :aria-pressed="option.value === mode"
      :title="option.hint"
      :data-testid="`video-subtitle-mode-${option.value}`"
      @click="mode = option.value"
    >
      <span :class="['fa-solid', option.icon]" aria-hidden="true" />
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped>
.video-subtitle-mode-switch {
  display: flex;
  width: fit-content;
  gap: 4px;
  padding: 3px;
  border-radius: 10px;
  background-color: var(--color-chip-theme);
}

.video-subtitle-mode-switch__option {
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  border: none;
  border-radius: 8px;
  background: none;
  color: var(--color-chip-theme-text);
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  line-height: 16px;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.video-subtitle-mode-switch__option > span {
  font-size: 12px;
}

.video-subtitle-mode-switch__option:hover:not(.video-subtitle-mode-switch__option--active) {
  background-color: color-mix(in srgb, var(--color-bg) 50%, transparent);
}

.video-subtitle-mode-switch__option--active {
  background-color: var(--color-bg);
  color: var(--color-text-primary);
  font-weight: 600;
  box-shadow: 0 1px 2px rgb(20 20 26 / 8%);
}

.video-subtitle-mode-switch__option--active > span {
  color: var(--color-primary-dark);
}

.video-subtitle-mode-switch__option:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 1px;
}
</style>

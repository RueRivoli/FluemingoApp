<script setup lang="ts">
/**
 * ThemeChipRow — every theme as a ThemeChip, to pick the themes to filter on.
 * Works with theme ids (e.g. "japaneseCulture"), not labels, so the selection
 * can be passed to the services as-is.
 *
 * @example
 * <ThemeChipRow :selected-themes="themes" @theme-selection-change="toggleTheme" />
 */
import ThemeChip from "~/components/ThemeChip.vue";
import { THEME_IDS, THEMES, type ThemeId } from "~/utils/themes";

interface Props {
  /** Ids of the selected themes */
  selectedThemes?: readonly ThemeId[];
}

const props = withDefaults(defineProps<Props>(), {
  selectedThemes: () => [],
});

const emit = defineEmits<{
  /** Fired when a chip is clicked; carries the theme id to toggle */
  themeSelectionChange: [theme: ThemeId];
}>();
</script>

<template>
  <h3 class="mt-4 mb-2 text-text-primary font-medium">Themes</h3>
  <ThemeChip
    v-for="themeId in THEME_IDS"
    :key="themeId"
    class="mr-2 mb-2 cursor-pointer"
    :label="THEMES[themeId].label"
    :icon="THEMES[themeId].icon"
    :selected="props.selectedThemes.includes(themeId)"
    @click="emit('themeSelectionChange', themeId)"
  />
</template>

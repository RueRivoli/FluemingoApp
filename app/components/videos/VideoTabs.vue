<script setup lang="ts">
/**
 * VideoTabs — switcher of the video page (Figma VideoTabs): Video, Vocabulary
 * and Quiz as a pill track whose active tab is a coloured segment with a dark
 * outline (Video yellow, Vocabulary blue, Quiz white), like the Article /
 * Vocabulary / Quiz tabs of the reading screen.
 * Built on PrimeVue Tabs (keyboard navigation, tab / tabpanel roles); each
 * panel's content comes from the slot of the same name.
 *
 * @example
 * <VideoTabs v-model:tab="tab">
 *   <template #video><VideoPlayer … /></template>
 *   <template #vocabulary>…</template>
 *   <template #quiz>…</template>
 * </VideoTabs>
 */
import Tab from "primevue/tab";
import TabList from "primevue/tablist";
import TabPanel from "primevue/tabpanel";
import TabPanels from "primevue/tabpanels";
import Tabs from "primevue/tabs";

/** Tabs of the video page, in display order. */
const VIDEO_TABS = [
  { value: "video", label: "Video" },
  { value: "vocabulary", label: "Vocabulary" },
  { value: "quiz", label: "Quiz" },
] as const;

export type VideoTabValue = (typeof VIDEO_TABS)[number]["value"];

/** Tab currently shown */
const activeTab = defineModel<VideoTabValue>("tab", { default: "video" });

defineSlots<{
  /** Content of the Video tab */
  video?: () => unknown;
  /** Content of the Vocabulary tab */
  vocabulary?: () => unknown;
  /** Content of the Quiz tab */
  quiz?: () => unknown;
}>();

// PrimeVue's underline indicator has no place in a pill track.
const TAB_LIST_PT = { activeBar: { style: { display: "none" } } } as const;

/** PrimeVue types the value as string | number: keep only our tab ids. */
function updateTab(value: string | number) {
  const tab = VIDEO_TABS.find((candidate) => candidate.value === value);
  if (tab) activeTab.value = tab.value;
}
</script>

<template>
  <Tabs
    :value="activeTab"
    class="video-tabs"
    data-testid="video-tabs"
    @update:value="updateTab"
  >
    <TabList class="video-tabs__list" :pt="TAB_LIST_PT">
      <Tab
        v-for="tab in VIDEO_TABS"
        :key="tab.value"
        :value="tab.value"
        :class="['video-tabs__tab', `video-tabs__tab--${tab.value}`]"
        :data-testid="`video-tab-${tab.value}`"
      >
        {{ tab.label }}
      </Tab>
    </TabList>

    <TabPanels class="video-tabs__panels">
      <TabPanel
        v-for="tab in VIDEO_TABS"
        :key="tab.value"
        :value="tab.value"
        :data-testid="`video-tab-panel-${tab.value}`"
      >
        <slot :name="tab.value" />
      </TabPanel>
    </TabPanels>
  </Tabs>
</template>

<style scoped>
/* Pill track: grey background, tabs as equal segments. */
/* .p-tablist gets a white background from Aura (tabs.tablist.background):
   only the grey track should show. */
.video-tabs .video-tabs__list {
  width: 100%;
  max-width: 440px;
  background: transparent;
}

.video-tabs :deep(.p-tablist-content),
.video-tabs :deep(.p-tablist-tab-list) {
  border: none;
  background: transparent;
}

.video-tabs :deep(.p-tablist-tab-list) {
  gap: 4px;
  padding: 4px;
  border-radius: 16px;
  background-color: var(--color-chip-theme);
}

/* Prefixed with .video-tabs to beat Aura's runtime .p-tab rules
   (e.g. .p-tab:not(.p-tab-active):not(.p-disabled):hover). */
.video-tabs .video-tabs__tab {
  flex: 1;
  justify-content: center;
  margin: 0;
  padding: 9px 20px;
  border: 1.5px solid transparent;
  border-radius: 12px;
  background: transparent;
  color: var(--color-chip-theme-text);
  font-size: 15px;
  font-weight: 500;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.video-tabs .video-tabs__tab:not(.p-tab-active):hover {
  border-color: transparent;
  background-color: rgb(255 255 255 / 55%);
  color: var(--color-text-primary);
}

.video-tabs .video-tabs__tab.p-tab-active {
  border-color: var(--color-neutral);
  background-color: var(--color-secondary);
  color: var(--color-text-primary);
  font-weight: 600;
}

/* Each tab has its own colour once active (Video keeps the yellow above). */
.video-tabs .video-tabs__tab--vocabulary.p-tab-active {
  background-color: var(--color-primary);
  color: var(--color-bg);
}

.video-tabs .video-tabs__tab--quiz.p-tab-active {
  background-color: var(--color-bg);
}

.video-tabs .video-tabs__tab:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  box-shadow: none;
}

/* The panels sit on the page background, spaced like the Figma page. */
.video-tabs__panels {
  padding: 20px 0 0;
  background: transparent;
}
</style>

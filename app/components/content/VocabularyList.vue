<script setup lang="ts">
/**
 * VocabularyList — "Vocabulary" section of a content: Main / Personal tabs
 * (Figma VocabularyTab) and a grid of VocabularyCard. Main lists the
 * content's words, Personal the words the user added.
 *
 * @example
 * <VocabularyList
 *   :main-words="words"
 *   :personal-words="myWords"
 *   :saved-ids="savedIds"
 *   :playing-id="playingWordId"
 *   :max-columns="2"
 *   @play-audio="play"
 *   @toggle-saved="(word, saved) => …"
 * />
 */
import { computed, ref } from "vue";
import VocabularyCard from "~/components/content/VocabularyCard.vue";
import type { VocabularyItem } from "~/types/vocabulary";

interface Props {
  /** Words of the content */
  mainWords?: readonly VocabularyItem[];
  /** Words the user added to this content */
  personalWords?: readonly VocabularyItem[];
  /** Ids of the words saved to the user's flashcards */
  savedIds?: readonly number[];
  /** Id of the word whose pronunciation is playing; null when none */
  playingId?: number | null;
  /** Upper bound on the grid columns (fewer on narrow screens); no bound when null */
  maxColumns?: number | null;
}

const props = withDefaults(defineProps<Props>(), {
  mainWords: () => [],
  personalWords: () => [],
  savedIds: () => [],
  playingId: null,
  maxColumns: null,
});

const emit = defineEmits<{
  /** Fired when a word's audio button is clicked */
  playAudio: [word: VocabularyItem];
  /** Fired when a word's bookmark is toggled; carries its new saved state */
  toggleSaved: [word: VocabularyItem, saved: boolean];
}>();

const TABS = [
  { id: "main", label: "Main", empty: "No vocabulary for this content yet." },
  {
    id: "personal",
    label: "Personal",
    empty: "You haven't added any words yet.",
  },
] as const;

type TabId = (typeof TABS)[number]["id"];

const activeTab = ref<TabId>("main");

const words = computed(() =>
  activeTab.value === "main" ? props.mainWords : props.personalWords,
);
// Read by the grid's CSS; without a bound, as many 280px columns as fit.
const gridStyle = computed(() =>
  props.maxColumns ? { "--vocabulary-list-max-columns": props.maxColumns } : {},
);
const emptyMessage = computed(
  () => TABS.find((tab) => tab.id === activeTab.value)?.empty ?? "",
);
</script>

<template>
  <section class="vocabulary-list" data-testid="vocabulary-list">
    <h3 class="vocabulary-list__heading">Vocabulary</h3>
    <div class="vocabulary-list__tabs" role="tablist" aria-label="Vocabulary">
      <button
        v-for="tab in TABS"
        :key="tab.id"
        type="button"
        role="tab"
        :aria-selected="activeTab === tab.id"
        :class="[
          'vocabulary-list__tab',
          { 'vocabulary-list__tab--active': activeTab === tab.id },
        ]"
        :data-testid="`vocabulary-list-tab-${tab.id}`"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <div role="tabpanel" data-testid="vocabulary-list-panel">
      <div
        v-if="words.length > 0"
        :class="['vocabulary-list__grid', { 'vocabulary-list__grid--bounded': maxColumns }]"
        :style="gridStyle"
        data-testid="vocabulary-list-grid"
      >
        <VocabularyCard
          v-for="word in words"
          :key="word.id"
          :word="word.text"
          :type="word.type"
          :translation="word.translation"
          :has-audio="Boolean(word.audioUrl)"
          :is-playing="word.id === playingId"
          :saved="word.status !== null"
          @play-audio="emit('playAudio', word)"
          @update:saved="(saved) => emit('toggleSaved', word, saved)"
        />
      </div>
      <p
        v-else
        class="vocabulary-list__empty"
        data-testid="vocabulary-list-empty"
      >
        {{ emptyMessage }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.vocabulary-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.vocabulary-list__heading {
  margin: 0;
  color: var(--color-text-primary);
  font-size: 22px;
  font-weight: 600;
  line-height: 30px;
}

.vocabulary-list__tabs {
  display: flex;
  gap: 20px;
}

.vocabulary-list__tab {
  padding: 4px;
  border: none;
  border-bottom: 2px solid transparent;
  background: none;
  color: #8a8a8a;
  font-size: 18px;
  font-weight: 500;
  line-height: 24px;
  cursor: pointer;
}

.vocabulary-list__tab--active {
  border-bottom-color: var(--color-neutral);
  color: var(--color-text-primary);
}

.vocabulary-list__grid {
  --vocabulary-list-column-gap: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px var(--vocabulary-list-column-gap);
}

/* A column is never narrower than 1/N of the row, so at most N fit; below
   280px per column it still drops to fewer. */
.vocabulary-list__grid--bounded {
  grid-template-columns: repeat(
    auto-fill,
    minmax(
      max(
        min(100%, 280px),
        calc(
          (100% - (var(--vocabulary-list-max-columns) - 1) * var(--vocabulary-list-column-gap)) /
            var(--vocabulary-list-max-columns)
        )
      ),
      1fr
    )
  );
}

.vocabulary-list__empty {
  margin: 0;
  color: var(--color-text-light);
  font-size: 15px;
}
</style>

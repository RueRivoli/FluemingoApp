<script setup lang="ts">
/**
 * VideoWordDictionary — other meanings of a clicked word, from the dictionary
 * (Azure Translator), under its definition in the subtitles pop-up. The
 * translation the transcript already gives is not repeated.
 *
 * @example
 * <VideoWordDictionary :translations="translations" :loading="isLoading" known-translation="friends" />
 */
import { computed } from "vue";
import type { DictionaryTranslation } from "~/types/dictionary";

interface Props {
  /** Translations from the dictionary, most frequent first */
  translations: DictionaryTranslation[];
  /** Shown while the dictionary answers */
  loading?: boolean;
  /** The lookup failed */
  hasError?: boolean;
  /** Translation already shown above, left out of the list */
  knownTranslation?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  hasError: false,
  knownTranslation: null,
});

const otherTranslations = computed(() => {
  const known = props.knownTranslation?.trim().toLowerCase();
  return props.translations.filter(
    (translation) => translation.text.trim().toLowerCase() !== known,
  );
});

const isVisible = computed(
  () => props.loading || props.hasError || otherTranslations.value.length > 0,
);
</script>

<template>
  <section
    v-if="isVisible"
    class="video-word-dictionary"
    aria-label="Dictionary"
    aria-live="polite"
    data-testid="video-word-dictionary"
  >
    <h4 class="video-word-dictionary__title">Dictionary</h4>
    <p
      v-if="loading"
      class="video-word-dictionary__status"
      data-testid="video-word-dictionary-loading"
    >
      Looking it up…
    </p>
    <p
      v-else-if="hasError"
      class="video-word-dictionary__status"
      data-testid="video-word-dictionary-error"
    >
      The dictionary is unavailable right now.
    </p>
    <ul v-else class="video-word-dictionary__list">
      <li
        v-for="translation in otherTranslations"
        :key="translation.text"
        class="video-word-dictionary__item"
        data-testid="video-word-dictionary-item"
      >
        <span class="video-word-dictionary__text" data-testid="video-word-dictionary-text">
          {{ translation.text }}
        </span>
        <span
          v-if="translation.partOfSpeech"
          class="video-word-dictionary__pos"
          data-testid="video-word-dictionary-pos"
        >
          {{ translation.partOfSpeech }}
        </span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.video-word-dictionary {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 12px;
  border-top: 1px solid var(--color-word-border);
}

.video-word-dictionary__title {
  margin: 0;
  color: var(--color-text-light);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  line-height: 15px;
  text-transform: uppercase;
}

.video-word-dictionary__status {
  margin: 0;
  color: var(--color-text-light);
  font-size: 14px;
  line-height: 20px;
}

.video-word-dictionary__list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.video-word-dictionary__item {
  display: flex;
  gap: 8px;
  align-items: baseline;
}

.video-word-dictionary__text {
  color: var(--color-text-primary);
  font-size: 15px;
  font-weight: 500;
  line-height: 20px;
}

.video-word-dictionary__pos {
  color: var(--color-text-light);
  font-size: 13px;
  font-style: italic;
  line-height: 18px;
}
</style>

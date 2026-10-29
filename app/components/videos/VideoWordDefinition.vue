<script setup lang="ts">
/**
 * VideoWordDefinition — content of the pop-up opened on a word of the
 * subtitles (Figma WordDefinitionPopover): the word with its base form,
 * slow / normal pronunciation buttons, grammar chips, the translation in the
 * user's language and the note. The default slot goes at the bottom (e.g.
 * the dictionary translations).
 *
 * @example
 * <VideoWordDefinition :word="definition" can-listen @listen="(slow) => speak(definition.text, slow)" />
 */
import { computed } from "vue";
import type { WordDefinition } from "~/types/video";
import { grammarLabel } from "~/utils/grammar";

interface Props {
  /** The word to describe */
  word: WordDefinition;
  /** Shows the pronunciation buttons (the browser can read aloud) */
  canListen?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  canListen: false,
});

const emit = defineEmits<{
  /** Fired by a pronunciation button; slow is true for the snail one */
  listen: [slow: boolean];
}>();

const PROPER_NOUN_LABEL = "proper noun";
const ICONS = {
  slow: "/img/icons/word-popover/snail.svg",
  listen: "/img/icons/word-popover/volume.svg",
} as const;

/** Shown under the word only when it differs: "les amis" → "ami". */
const baseForm = computed(() => {
  const { basis, text } = props.word;
  return basis && basis.toLowerCase() !== text.toLowerCase() ? basis : null;
});

const chips = computed(() =>
  [
    grammarLabel(props.word.type),
    props.word.isProperName ? PROPER_NOUN_LABEL : null,
  ].filter((chip): chip is string => chip !== null),
);
</script>

<template>
  <article class="video-word-definition" data-testid="video-word-definition">
    <header class="video-word-definition__header">
      <div class="video-word-definition__word-block">
        <h3 class="video-word-definition__word" data-testid="video-word-definition-word">
          {{ word.text }}
        </h3>
        <p
          v-if="baseForm"
          class="video-word-definition__basis"
          data-testid="video-word-definition-basis"
        >
          {{ baseForm }}
        </p>
      </div>
      <div v-if="canListen" class="video-word-definition__listen">
        <button
          type="button"
          class="video-word-definition__listen-button"
          :aria-label="`Listen to “${word.text}” slowly`"
          data-testid="video-word-definition-listen-slow"
          @click="emit('listen', true)"
        >
          <NuxtImg :src="ICONS.slow" alt="" width="20" height="20" />
        </button>
        <button
          type="button"
          class="video-word-definition__listen-button video-word-definition__listen-button--primary"
          :aria-label="`Listen to “${word.text}”`"
          data-testid="video-word-definition-listen"
          @click="emit('listen', false)"
        >
          <NuxtImg :src="ICONS.listen" alt="" width="20" height="20" />
        </button>
      </div>
    </header>

    <ul v-if="chips.length" class="video-word-definition__chips">
      <li
        v-for="chip in chips"
        :key="chip"
        class="video-word-definition__chip"
        data-testid="video-word-definition-chip"
      >
        {{ chip }}
      </li>
    </ul>

    <div v-if="word.translation || word.note" class="video-word-definition__meaning">
      <p
        v-if="word.translation"
        class="video-word-definition__translation"
        data-testid="video-word-definition-translation"
      >
        {{ word.translation }}
      </p>
      <p
        v-if="word.note"
        class="video-word-definition__note"
        data-testid="video-word-definition-note"
      >
        {{ word.note }}
      </p>
    </div>

    <slot />
  </article>
</template>

<style scoped>
.video-word-definition {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 320px;
  max-width: calc(100vw - 48px);
}

.video-word-definition__header {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.video-word-definition__word-block {
  flex: 1;
  min-width: 0;
}

.video-word-definition__word {
  margin: 0;
  color: var(--color-text-primary);
  font-family: Literata, Georgia, serif;
  font-size: 24px;
  font-weight: 600;
  line-height: 30px;
  overflow-wrap: anywhere;
}

.video-word-definition__basis {
  margin: 2px 0 0;
  color: var(--color-word-text-faint);
  font-family: Literata, Georgia, serif;
  font-size: 14px;
  line-height: 20px;
}

.video-word-definition__listen {
  display: flex;
  flex-shrink: 0;
  gap: 8px;
}

.video-word-definition__listen-button {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background-color: var(--color-word-surface);
  cursor: pointer;
  transition: filter 0.15s ease;
}

.video-word-definition__listen-button--primary {
  background-color: var(--color-word-accent);
}

.video-word-definition__listen-button:hover {
  filter: brightness(0.95);
}

.video-word-definition__listen-button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.video-word-definition__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.video-word-definition__chip {
  padding: 4px 10px;
  border-radius: 8px;
  background-color: var(--color-word-surface);
  color: var(--color-word-text);
  font-size: 12px;
  font-weight: 500;
  line-height: 15px;
}

.video-word-definition__meaning {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.video-word-definition__translation {
  margin: 0;
  color: var(--color-text-primary);
  font-size: 18px;
  font-weight: 600;
  line-height: 24px;
}

.video-word-definition__note {
  margin: 0;
  color: var(--color-word-text);
  font-size: 14px;
  line-height: 20px;
}
</style>

<script setup lang="ts">
/**
 * VideoSubtitleCue — one subtitle line of the video page (Figma SubtitleCue):
 * timestamp, French sentence and its translation. The active line (being
 * spoken) is tinted with a left accent. Clicking the line emits "select" to
 * replay it; the words of the sentence are buttons that emit "wordSelect" to
 * show their definition, the selected one highlighted.
 *
 * @example
 * <VideoSubtitleCue
 *   :start="14.2"
 *   text="Je prends un café."
 *   :segments="cue.segments"
 *   translation="I have a coffee."
 *   is-active
 *   @select="seek(14.2)"
 *   @word-select="(word, target) => popover.open(target, word)"
 * />
 */
import { computed } from "vue";
import type { SubtitleSegment, WordDefinition } from "~/types/video";
import { formatVideoDuration } from "~/utils/videos";

interface Props {
  /** Start of the sentence, in seconds */
  start: number;
  /** French sentence */
  text: string;
  /** The sentence cut into words and plain text; the plain sentence is shown when empty */
  segments?: readonly SubtitleSegment[];
  /** Translation; no second line when null */
  translation?: string | null;
  /** Shows the translation line (the panel's "Translation" switch) */
  showTranslation?: boolean;
  /** Line currently spoken in the video */
  isActive?: boolean;
  /** Index in segments of the word whose definition is open; null when none */
  selectedSegmentIndex?: number | null;
}

const props = withDefaults(defineProps<Props>(), {
  segments: () => [],
  translation: null,
  showTranslation: true,
  isActive: false,
  selectedSegmentIndex: null,
});

const emit = defineEmits<{
  /** Fired when the line is clicked, to replay it */
  select: [];
  /** Fired when a word is clicked, with the word button to anchor the pop-up to */
  wordSelect: [word: WordDefinition, target: HTMLElement];
}>();

const time = computed(() => formatVideoDuration(props.start) ?? "0:00");
const hasTranslationLine = computed(
  () => props.showTranslation && !!props.translation,
);
const hasWords = computed(() => props.segments.some((segment) => segment.word));

function selectWord(word: WordDefinition, event: MouseEvent) {
  emit("wordSelect", word, event.currentTarget as HTMLElement);
}
</script>

<template>
  <!-- Clicking anywhere on the line replays it (mouse shortcut); the time
       button is the keyboard and screen-reader way to do the same. -->
  <div
    :class="['video-subtitle-cue', { 'video-subtitle-cue--active': isActive }]"
    :aria-current="isActive ? 'true' : undefined"
    data-testid="video-subtitle-cue"
    @click="emit('select')"
  >
    <button
      type="button"
      class="video-subtitle-cue__time"
      :aria-label="`Replay from ${time}: ${text}`"
      data-testid="video-subtitle-cue-time"
      @click.stop="emit('select')"
    >
      {{ time }}
    </button>
    <span class="video-subtitle-cue__lines">
      <span class="video-subtitle-cue__text" data-testid="video-subtitle-cue-text">
        <template v-if="hasWords">
          <template v-for="(segment, index) in segments" :key="index">
            <button
              v-if="segment.word"
              type="button"
              :class="[
                'video-subtitle-cue__word',
                { 'video-subtitle-cue__word--selected': index === selectedSegmentIndex },
              ]"
              :aria-expanded="index === selectedSegmentIndex"
              aria-haspopup="dialog"
              data-testid="video-subtitle-cue-word"
              @click.stop="selectWord(segment.word, $event)"
            >{{ segment.text }}</button>
            <template v-else>{{ segment.text }}</template>
          </template>
        </template>
        <template v-else>{{ text }}</template>
      </span>
      <span
        v-if="hasTranslationLine"
        class="video-subtitle-cue__translation"
        data-testid="video-subtitle-cue-translation"
      >
        {{ translation }}
      </span>
    </span>
  </div>
</template>

<style scoped>
.video-subtitle-cue {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  width: 100%;
  padding: 10px 14px;
  border-left: 3px solid transparent;
  border-radius: 10px;
  text-align: left;
  cursor: pointer;
}

.video-subtitle-cue:hover {
  background-color: var(--color-bg-muted);
}

.video-subtitle-cue--active,
.video-subtitle-cue--active:hover {
  border-left-color: var(--color-primary-dark);
  background-color: var(--color-primary-pastel);
}

.video-subtitle-cue__time {
  flex-shrink: 0;
  width: 34px;
  padding: 0;
  border: none;
  border-radius: 4px;
  background: none;
  color: var(--color-text-light);
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  font-variant-numeric: tabular-nums;
  text-align: left;
  cursor: pointer;
}

.video-subtitle-cue--active .video-subtitle-cue__time {
  color: var(--color-primary-dark);
  font-weight: 600;
}

.video-subtitle-cue__time:focus-visible,
.video-subtitle-cue__word:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 1px;
}

.video-subtitle-cue__lines {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.video-subtitle-cue__text {
  color: var(--color-text-primary);
  font-size: 15px;
  font-weight: 500;
  line-height: 20px;
}

/* A dotted underline marks what can be clicked, without weighing on the sentence. */
.video-subtitle-cue__word {
  margin: 0 -2px;
  padding: 0 2px;
  border: none;
  border-radius: 4px;
  background: none;
  color: inherit;
  font: inherit;
  text-decoration: underline dotted;
  text-decoration-color: var(--color-word-text-faint);
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;
  cursor: pointer;
  transition: background-color 0.12s ease;
}

.video-subtitle-cue__word:hover {
  background-color: color-mix(in srgb, var(--color-secondary) 35%, transparent);
}

.video-subtitle-cue__word--selected,
.video-subtitle-cue__word--selected:hover {
  background-color: color-mix(in srgb, var(--color-secondary) 60%, transparent);
  font-weight: 600;
}

.video-subtitle-cue__translation {
  color: var(--color-text-light);
  font-size: 14px;
  line-height: 18px;
}

.video-subtitle-cue--active .video-subtitle-cue__translation {
  color: var(--color-chip-theme-text);
}
</style>

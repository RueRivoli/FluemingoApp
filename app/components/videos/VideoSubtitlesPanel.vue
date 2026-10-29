<script setup lang="ts">
/**
 * VideoSubtitlesPanel — subtitles column of the video page (Figma
 * SubtitlesPanel): header with a "Translation" switch (only when the
 * transcript has translations) and the mode switch — Contextual: the units of
 * the transcript are clickable; Words: every single word is; Standard: none —,
 * the scrolling list of lines with the one
 * being spoken highlighted and kept in view, and a hint. Clicking a line
 * emits "seek" with its start time; clicking a word opens its definition in a
 * pop-up (VideoWordPopover) and emits "wordOpen".
 *
 * @example
 * <VideoSubtitlesPanel
 *   :cues="video.subtitles"
 *   :current-time="time"
 *   @seek="player?.seekTo($event)"
 *   @word-open="player?.pause()"
 * />
 */
import { computed, nextTick, ref, watch } from "vue";
import ToggleSwitch from "primevue/toggleswitch";
import VideoSubtitleCue from "~/components/videos/VideoSubtitleCue.vue";
import VideoSubtitleModeSwitch from "~/components/videos/VideoSubtitleModeSwitch.vue";
import VideoWordPopover from "~/components/videos/VideoWordPopover.vue";
import {
  SUBTITLE_MODES,
  type SubtitleCue,
  type SubtitleMode,
  type SubtitleSegment,
  type WordDefinition,
} from "~/types/video";
import { splitCueIntoWords } from "~/utils/subtitleWords";
import { findActiveCueIndex } from "~/utils/subtitles";

interface Props {
  /** Subtitle lines, in time order */
  cues: readonly SubtitleCue[];
  /** Current time of the video, in seconds */
  currentTime?: number;
  /** The transcript has units: offers the contextual mode, selected first */
  hasUnits?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  currentTime: 0,
  hasUnits: false,
});

const emit = defineEmits<{
  /** Fired when a line is clicked: the video should play from this time */
  seek: [seconds: number];
  /** Fired when the definition of a word opens (e.g. to pause the video) */
  wordOpen: [word: WordDefinition];
}>();

/** Share of the list height left above the active line once scrolled to it. */
const ACTIVE_LINE_OFFSET_RATIO = 1 / 3;

/** Where the word whose definition is open sits. */
interface SelectedWord {
  cueIndex: number;
  segmentIndex: number;
}

const showTranslation = ref(true);
const mode = ref<SubtitleMode>(defaultMode(props.hasUnits));
const list = ref<HTMLElement | null>(null);
const popover = ref<InstanceType<typeof VideoWordPopover> | null>(null);
const selectedWord = ref<SelectedWord | null>(null);

const hasTranslations = computed(() =>
  props.cues.some((cue) => cue.translation),
);
const modes = computed<readonly SubtitleMode[]>(() =>
  props.hasUnits ? SUBTITLE_MODES : SUBTITLE_MODES.filter((value) => value !== "contextual"),
);
// Words of each line, computed once per transcript (not on every mode switch).
const wordSegments = computed(() => props.cues.map(splitCueIntoWords));
/** Clickable pieces of each line in the current mode; empty = plain text. */
const segmentsByCue = computed<readonly (readonly SubtitleSegment[])[]>(() => {
  if (mode.value === "words") return wordSegments.value;
  if (mode.value === "contextual") return props.cues.map((cue) => cue.segments);
  return props.cues.map(() => []);
});
const hint = computed(() =>
  mode.value === "standard"
    ? "Click a line to replay it"
    : "Click a line to replay it · click a word to translate it",
);
const activeIndex = computed(() =>
  findActiveCueIndex(props.cues, props.currentTime),
);

// Keeps the spoken line in view inside the list only: scrollIntoView would
// also scroll the whole page.
watch(activeIndex, async (index) => {
  await nextTick();
  const container = list.value;
  const line = container?.querySelector<HTMLElement>(`[data-cue-index="${index}"]`);
  if (!container || !line) return;
  container.scrollTo?.({
    top: line.offsetTop - container.clientHeight * ACTIVE_LINE_OFFSET_RATIO,
    behavior: "smooth",
  });
});

// The open word belongs to the previous mode's pieces: close it.
watch(mode, () => popover.value?.close());

// Another video: back to the best mode it offers.
watch(
  () => props.hasUnits,
  (hasUnits) => (mode.value = defaultMode(hasUnits)),
);

/** Contextual when the transcript has units, single words otherwise. */
function defaultMode(hasUnits: boolean): SubtitleMode {
  return hasUnits ? "contextual" : "words";
}

function openWord(cueIndex: number, word: WordDefinition, target: HTMLElement) {
  const segmentIndex = segmentsByCue.value[cueIndex]?.findIndex(
    (segment) => segment.word === word,
  );
  selectedWord.value = { cueIndex, segmentIndex: segmentIndex ?? -1 };
  popover.value?.open(target, word);
  emit("wordOpen", word);
}

function selectedSegmentIndex(cueIndex: number): number | null {
  return selectedWord.value?.cueIndex === cueIndex
    ? selectedWord.value.segmentIndex
    : null;
}
</script>

<template>
  <section
    class="video-subtitles-panel"
    aria-labelledby="video-subtitles-title"
    data-testid="video-subtitles-panel"
  >
    <header class="video-subtitles-panel__header">
      <span class="fa-regular fa-closed-captioning video-subtitles-panel__icon" aria-hidden="true" />
      <h2 id="video-subtitles-title" class="video-subtitles-panel__title">Subtitles</h2>
      <div
        v-if="hasTranslations"
        class="video-subtitles-panel__toggle"
        data-testid="video-subtitles-translation-toggle"
      >
        <label for="video-subtitles-translation">Translation</label>
        <ToggleSwitch v-model="showTranslation" input-id="video-subtitles-translation" />
      </div>
      <div class="video-subtitles-panel__modes">
        <VideoSubtitleModeSwitch v-model="mode" :modes="modes" />
      </div>
    </header>

    <div ref="list" class="video-subtitles-panel__cues" data-testid="video-subtitles-cues">
      <VideoSubtitleCue
        v-for="(cue, index) in cues"
        :key="`${cue.start}-${index}`"
        :data-cue-index="index"
        :start="cue.start"
        :text="cue.text"
        :segments="segmentsByCue[index]"
        :selected-segment-index="selectedSegmentIndex(index)"
        :translation="cue.translation"
        :show-translation="showTranslation"
        :is-active="index === activeIndex"
        @select="emit('seek', cue.start)"
        @word-select="(word, target) => openWord(index, word, target)"
      />
      <p
        v-if="cues.length === 0"
        class="video-subtitles-panel__empty"
        data-testid="video-subtitles-empty"
      >
        No subtitles for this video yet.
      </p>
    </div>

    <p v-if="cues.length > 0" class="video-subtitles-panel__hint">
      <span class="fa-solid fa-circle-info" aria-hidden="true" />
      {{ hint }}
    </p>

    <!-- Contextual units carry their translation in the sentence: no dictionary. -->
    <VideoWordPopover
      ref="popover"
      :with-dictionary="mode !== 'contextual'"
      @hide="selectedWord = null"
    />
  </section>
</template>

<style scoped>
.video-subtitles-panel {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--color-chip-theme);
  border-radius: 16px;
  background-color: var(--color-bg);
}

.video-subtitles-panel__header {
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  padding: 14px 18px;
  border-bottom: 1px solid var(--color-chip-theme);
}

/* Own row under the title; the switch inside keeps its content width. */
.video-subtitles-panel__modes {
  flex: 1 0 100%;
}

.video-subtitles-panel__icon {
  color: var(--color-primary-dark);
  font-size: 16px;
}

.video-subtitles-panel__title {
  flex: 1;
  min-width: 0;
  margin: 0;
  color: var(--color-text-primary);
  font-size: 17px;
  font-weight: 600;
}

.video-subtitles-panel__toggle {
  display: flex;
  gap: 8px;
  align-items: center;
  color: var(--color-chip-theme-text);
  font-size: 13px;
  font-weight: 500;
}

/* Scrolls on its own: the panel keeps the height of the player column. */
.video-subtitles-panel__cues {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-height: 0;
  padding: 8px;
  overflow-y: auto;
}

.video-subtitles-panel__empty {
  margin: auto;
  padding: 24px;
  color: var(--color-text-light);
  font-size: 14px;
  text-align: center;
}

.video-subtitles-panel__hint {
  display: flex;
  flex-shrink: 0;
  gap: 8px;
  align-items: center;
  margin: 0;
  padding: 10px 18px;
  background-color: var(--color-background);
  color: var(--color-text-light);
  font-size: 13px;
}

.video-subtitles-panel__hint > span {
  font-size: 12px;
}
</style>

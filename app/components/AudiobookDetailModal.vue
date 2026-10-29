<script setup lang="ts">
/**
 * AudiobookDetailModal — audiobook details opened from an AudiobookCard: the
 * cover (status) and the info column (title, author, favorite, chips,
 * description, Start Reading) then the chapter list
 * (Figma "Modal · AudiobookDetail · v2"). The columns stack on narrow screens.
 * Closes with the ✕ button, Escape or a click on the backdrop.
 *
 * @example
 * <AudiobookDetailModal
 *   v-model:visible="isOpen"
 *   v-model:favorite="isFavorite"
 *   title="Le Petit Prince"
 *   author="Antoine de Saint-Exupéry"
 *   level="A2"
 *   :chapters="chapters"
 *   @start-reading="read"
 * />
 */
import { nextTick, onBeforeUnmount, ref, watch } from "vue";
import BaseButton from "~/components/base/BaseButton.vue";
import ChapterList from "~/components/content/ChapterList.vue";
import ContentStatusBadge from "~/components/content/ContentStatusBadge.vue";
import FavoriteToggleButton from "~/components/FavoriteToggleButton.vue";
import LevelChip from "~/components/LevelChip.vue";
import NewChip from "~/components/NewChip.vue";
import ThemeChip from "~/components/ThemeChip.vue";
import type { AudiobookChapter } from "~/types/audiobook";
import type { ArticleCardTheme } from "~/types/theme";
import type { Level } from "~/utils/constants";
import type { ContentStatus } from "~/utils/contentStatus";

interface Props {
  /** Audiobook title */
  title: string;
  /** Author, shown below the title in grey */
  author?: string | null;
  /** Audiobook summary */
  description?: string | null;
  /** Cover image URL; a neutral placeholder is shown when missing */
  imageUrl?: string | null;
  /** CEFR level of the audiobook */
  level?: Level | null;
  /** Listening progress, shown bottom-left of the cover */
  status?: ContentStatus | null;
  /** Shows the NEW badge, bottom-right of the cover */
  isNew?: boolean;
  /** Themes, shown after the level chip */
  themes?: readonly ArticleCardTheme[];
  /** Gated content: the heart becomes a lock */
  locked?: boolean;
  /** Chapters, in reading order */
  chapters?: readonly AudiobookChapter[];
  /** The chapters are being fetched */
  isLoadingChapters?: boolean;
  /** The chapters could not be loaded */
  hasChaptersError?: boolean;
}

withDefaults(defineProps<Props>(), {
  author: null,
  description: null,
  imageUrl: null,
  level: null,
  status: null,
  isNew: false,
  themes: () => [],
  locked: false,
  chapters: () => [],
  isLoadingChapters: false,
  hasChaptersError: false,
});

const emit = defineEmits<{
  /** Fired by the Start Reading button */
  startReading: [];
  /** Fired when the lock is clicked on gated content */
  lockedClick: [];
}>();

/** Whether the modal is open */
const isVisible = defineModel<boolean>("visible", { default: false });
/** Whether the audiobook is in the user's favorites */
const isFavorite = defineModel<boolean>("favorite", { default: false });

const TITLE_ID = "audiobook-detail-modal-title";

const closeButton = ref<HTMLButtonElement | null>(null);

// Listen to Escape only while open, and move focus into the dialog so
// keyboard users land on it.
watch(
  isVisible,
  async (visible) => {
    if (!visible) {
      document.removeEventListener("keydown", handleKeydown);
      return;
    }
    document.addEventListener("keydown", handleKeydown);
    await nextTick();
    closeButton.value?.focus();
  },
  { immediate: true },
);

function close() {
  isVisible.value = false;
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") close();
}

onBeforeUnmount(() => document.removeEventListener("keydown", handleKeydown));
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isVisible"
      class="audiobook-detail-modal"
      data-testid="audiobook-detail-modal-backdrop"
      @click.self="close"
    >
      <div
        class="audiobook-detail-modal__dialog"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="TITLE_ID"
        data-testid="audiobook-detail-modal"
      >
        <button
          ref="closeButton"
          type="button"
          class="audiobook-detail-modal__close"
          aria-label="Close"
          data-testid="audiobook-detail-modal-close"
          @click="close"
        >
          <span class="fa-solid fa-xmark" aria-hidden="true" />
        </button>

        <div class="audiobook-detail-modal__body">
          <div class="audiobook-detail-modal__hero">
            <div class="audiobook-detail-modal__media">
              <NuxtImg
                v-if="imageUrl"
                :src="imageUrl"
                alt=""
                class="audiobook-detail-modal__image"
                data-testid="audiobook-detail-modal-image"
              />
              <ContentStatusBadge
                v-if="status"
                :status="status"
                class="audiobook-detail-modal__status"
              />
              <NewChip v-if="isNew" class="audiobook-detail-modal__new" />
            </div>

            <div class="audiobook-detail-modal__info">
              <div class="audiobook-detail-modal__title-row">
                <div class="audiobook-detail-modal__titles">
                  <h2
                    :id="TITLE_ID"
                    class="audiobook-detail-modal__title"
                    data-testid="audiobook-detail-modal-title"
                  >
                    {{ title }}
                  </h2>
                  <p
                    v-if="author"
                    class="audiobook-detail-modal__author"
                    data-testid="audiobook-detail-modal-author"
                  >
                    {{ author }}
                  </p>
                </div>
                <FavoriteToggleButton
                  v-model="isFavorite"
                  :locked="locked"
                  class="audiobook-detail-modal__favorite"
                  @locked-click="emit('lockedClick')"
                />
              </div>

              <div
                class="audiobook-detail-modal__chips"
                data-testid="audiobook-detail-modal-chips"
              >
                <LevelChip
                  v-if="level"
                  class="px-2 py-1"
                  :level="level"
                  :label="level"
                  selected
                />
                <ThemeChip
                  v-for="theme in themes"
                  :key="theme.id"
                  :label="theme.label"
                  :icon="theme.icon"
                  :selected="false"
                />
              </div>

              <p
                v-if="description"
                class="audiobook-detail-modal__description"
                data-testid="audiobook-detail-modal-description"
              >
                {{ description }}
              </p>

              <div class="audiobook-detail-modal__actions">
                <BaseButton
                  icon="fa-regular fa-book-open"
                  data-testid="audiobook-detail-modal-start-reading"
                  @click="emit('startReading')"
                >
                  Start Reading
                </BaseButton>
              </div>
            </div>
          </div>

          <ChapterList
            class="audiobook-detail-modal__chapters"
            :chapters="chapters"
            :is-loading="isLoadingChapters"
            :has-error="hasChaptersError"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.audiobook-detail-modal {
  position: fixed;
  z-index: 1000;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background-color: rgba(0, 0, 0, 0.5);
}

.audiobook-detail-modal__dialog {
  position: relative;
  display: flex;
  width: min(1040px, 100%);
  max-height: min(820px, 100%);
  overflow: hidden;
  border-radius: 20px;
  background-color: var(--color-bg);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.25);
}

.audiobook-detail-modal__close {
  position: absolute;
  z-index: 1;
  top: 16px;
  right: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background-color: #f0f0f0;
  color: var(--color-text-primary);
  font-size: 18px;
  cursor: pointer;
}

.audiobook-detail-modal__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 32px;
  overflow-y: auto;
  padding: 32px;
}

/* Cover | info on the same row; stacked below 760px. */
.audiobook-detail-modal__hero {
  display: grid;
  grid-template-columns: minmax(0, 440px) minmax(0, 1fr);
  gap: 32px;
}

.audiobook-detail-modal__media {
  position: relative;
  aspect-ratio: 11 / 8;
  overflow: hidden;
  border-radius: 16px;
  background-color: var(--color-chip-theme);
}

.audiobook-detail-modal__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.audiobook-detail-modal__status,
.audiobook-detail-modal__new {
  position: absolute;
  bottom: 16px;
}

.audiobook-detail-modal__status {
  left: 16px;
}

.audiobook-detail-modal__new {
  right: 16px;
}

.audiobook-detail-modal__info {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

/* Room for the close button floating in the dialog's corner. */
.audiobook-detail-modal__title-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding-right: 40px;
}

.audiobook-detail-modal__titles {
  flex: 1;
  min-width: 0;
}

.audiobook-detail-modal__title {
  margin: 0;
  color: var(--color-text-primary);
  font-size: 30px;
  font-weight: 600;
  line-height: 38px;
}

.audiobook-detail-modal__author {
  margin: 4px 0 0;
  color: #8a8a8a;
  font-size: 20px;
  line-height: 28px;
}

.audiobook-detail-modal__favorite {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
}

.audiobook-detail-modal__chips {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.audiobook-detail-modal__description {
  margin: 0;
  color: #8a8a8a;
  font-size: 16px;
  line-height: 24px;
}

/* Pushed to the bottom of the info column, level with the cover's bottom edge. */
.audiobook-detail-modal__actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: auto;
}

/* Rows stay readable instead of stretching across the whole dialog. */
.audiobook-detail-modal__chapters {
  width: 100%;
  max-width: 520px;
}

@media (max-width: 760px) {
  .audiobook-detail-modal__hero,
  .audiobook-detail-modal__actions {
    grid-template-columns: 1fr;
  }
}
</style>

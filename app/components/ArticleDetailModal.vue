<script setup lang="ts">
/**
 * ArticleDetailModal — article details opened from an ArticleCard: the cover
 * (status, date) and the info column (titles, favorite, chips, description,
 * Start Reading then the vocabulary
 * (Figma ArticleDetailModal). The columns stack on narrow screens.
 * Closes with the ✕ button, Escape or a click on the backdrop.
 *
 * @example
 * <ArticleDetailModal
 *   v-model:visible="isOpen"
 *   v-model:favorite="isFavorite"
 *   title="Nouvelle crue au Népal"
 *   translated-title="New Flooding in Nepal"
 *   level="B1"
 *   :main-words="vocabulary"
 *   @start-reading="read"
 * />
 */
import { nextTick, onBeforeUnmount, ref, watch } from "vue";
import BaseButton from "~/components/base/BaseButton.vue";
import ContentDateBadge from "~/components/content/ContentDateBadge.vue";
import ContentStatusBadge from "~/components/content/ContentStatusBadge.vue";
import VocabularyList from "~/components/content/VocabularyList.vue";
import FavoriteToggleButton from "~/components/FavoriteToggleButton.vue";
import LevelChip from "~/components/LevelChip.vue";
import NewChip from "~/components/NewChip.vue";
import ThemeChip from "~/components/ThemeChip.vue";
import * as vocabularyService from "~/services/vocabularyService";
import type { ArticleCardTheme } from "~/types/theme";
import type { VocabularyItem } from "~/types/vocabulary";
import type { Level } from "~/utils/constants";
import type { ContentStatus } from "~/utils/contentStatus";

interface Props {
  /** Article id */
  id: number | null;
  /** Article title, in the learned language */
  title: string;
  /** Title in the user's language, shown below in grey */
  translatedTitle?: string | null;
  /** Article summary */
  description?: string | null;
  /** Cover image URL; a neutral placeholder is shown when missing */
  imageUrl?: string | null;
  /** CEFR level of the article */
  level?: Level | null;
  /** Publication date (ISO string), shown bottom-right of the cover */
  publishedAt?: string | null;
  /** Reading progress, shown bottom-left of the cover */
  status?: ContentStatus | null;
  /** Shows the NEW badge after the chips */
  isNew?: boolean;
  /** Themes, shown after the level chip */
  themes?: readonly ArticleCardTheme[];
  /** Gated content: the heart becomes a lock */
  locked?: boolean;
  /** Words of the article */
  mainVocabulary?: readonly VocabularyItem[];
  /** Words the user added to the article */
  personalVocabulary?: readonly VocabularyItem[];
}

const props = withDefaults(defineProps<Props>(), {
  id: null,
  translatedTitle: null,
  description: null,
  imageUrl: null,
  level: null,
  publishedAt: null,
  status: null,
  isNew: false,
  themes: () => [],
  locked: false,
  mainVocabulary: () => [],
  personalVocabulary: () => [],
});

const emit = defineEmits<{
  /** Fired by the Start Reading button */
  startReading: [];
  /** Fired when the lock is clicked on gated content */
  lockedClick: [];
  /** Fired when a word's audio button is clicked */
  playAudio: [word: VocabularyItem];
  /** Fired when a word's bookmark is toggled; carries its new saved state */
  toggleSaved: [word: VocabularyItem, saved: boolean];
}>();

/** Whether the modal is open */
const isVisible = defineModel<boolean>("visible", { default: false });
/** Whether the article is in the user's favorites */
const isFavorite = defineModel<boolean>("favorite", { default: false });

const TITLE_ID = "article-detail-modal-title";

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
    if (props.id !== null) {
    }
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
      class="article-detail-modal"
      data-testid="article-detail-modal-backdrop"
      @click.self="close"
    >
      <div
        class="article-detail-modal__dialog"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="TITLE_ID"
        data-testid="article-detail-modal"
      >
        <button
          ref="closeButton"
          type="button"
          class="article-detail-modal__close"
          aria-label="Close"
          data-testid="article-detail-modal-close"
          @click="close"
        >
          <span class="fa-solid fa-xmark" aria-hidden="true" />
        </button>

        <div class="article-detail-modal__body">
          <div class="article-detail-modal__hero">
            <div class="article-detail-modal__media">
              <NuxtImg
                v-if="imageUrl"
                :src="imageUrl"
                alt=""
                class="article-detail-modal__image"
                data-testid="article-detail-modal-image"
              />
              <ContentStatusBadge
                v-if="status"
                :status="status"
                class="article-detail-modal__status"
              />
              <NewChip v-if="isNew" />
              <ContentDateBadge
                v-else-if="publishedAt"
                :date="publishedAt"
                class="article-detail-modal__date"
              />
            </div>

            <div class="article-detail-modal__info">
              <div class="article-detail-modal__title-row">
                <div class="article-detail-modal__titles">
                  <h2
                    :id="TITLE_ID"
                    class="article-detail-modal__title"
                    data-testid="article-detail-modal-title"
                  >
                    {{ title }}
                  </h2>
                  <p
                    v-if="translatedTitle"
                    class="article-detail-modal__translated-title"
                    data-testid="article-detail-modal-translated-title"
                  >
                    {{ translatedTitle }}
                  </p>
                </div>
              </div>

              <div
                class="article-detail-modal__chips"
                data-testid="article-detail-modal-chips"
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
                <FavoriteToggleButton
                  v-model="isFavorite"
                  :locked="locked"
                  @locked-click="emit('lockedClick')"
                />
              </div>

              <p
                v-if="description"
                class="article-detail-modal__description"
                data-testid="article-detail-modal-description"
              >
                {{ description }}
              </p>

              <div class="article-detail-modal__actions">
                <BaseButton
                  icon="fa-regular fa-book-open"
                  data-testid="article-detail-modal-start-reading"
                  @click="emit('startReading')"
                >
                  Start Reading
                </BaseButton>
              </div>
            </div>
          </div>

          <VocabularyList
            :main-words="mainVocabulary"
            :personal-words="personalVocabulary"
            @play-audio="(word) => emit('playAudio', word)"
            @toggle-saved="(word, saved) => emit('toggleSaved', word, saved)"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.article-detail-modal {
  position: fixed;
  z-index: 1000;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background-color: rgba(0, 0, 0, 0.5);
}

.article-detail-modal__dialog {
  position: relative;
  display: flex;
  width: min(1040px, 100%);
  max-height: min(820px, 100%);
  overflow: hidden;
  border-radius: 20px;
  background-color: var(--color-bg);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.25);
}

.article-detail-modal__close {
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

.article-detail-modal__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 32px;
  overflow-y: auto;
  padding: 32px;
}

/* Cover | info on the same row; stacked below 760px. */
.article-detail-modal__hero {
  display: grid;
  grid-template-columns: minmax(0, 440px) minmax(0, 1fr);
  gap: 32px;
}

.article-detail-modal__media {
  position: relative;
  aspect-ratio: 11 / 8;
  overflow: hidden;
  border-radius: 16px;
  background-color: var(--color-chip-theme);
}

.article-detail-modal__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-detail-modal__status,
.article-detail-modal__date {
  position: absolute;
  bottom: 16px;
}

.article-detail-modal__status {
  left: 16px;
}

.article-detail-modal__date {
  right: 16px;
}

.article-detail-modal__info {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

/* Room for the close button floating in the dialog's corner. */
.article-detail-modal__title-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding-right: 40px;
}

.article-detail-modal__titles {
  flex: 1;
  min-width: 0;
}

.article-detail-modal__title {
  margin: 0;
  color: var(--color-text-primary);
  font-size: 30px;
  font-weight: 600;
  line-height: 38px;
}

.article-detail-modal__translated-title {
  margin: 4px 0 0;
  color: #8a8a8a;
  font-size: 20px;
  line-height: 28px;
}

.article-detail-modal__chips {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.article-detail-modal__description {
  margin: 0;
  color: #8a8a8a;
  font-size: 16px;
  line-height: 24px;
}

/* Pushed to the bottom of the info column, level with the cover's bottom edge. */
.article-detail-modal__actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: auto;
}

@media (max-width: 760px) {
  .article-detail-modal__hero,
  .article-detail-modal__actions {
    grid-template-columns: 1fr;
  }
}
</style>

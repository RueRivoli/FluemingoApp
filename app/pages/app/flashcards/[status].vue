<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useAsyncData, useRoute } from "#imports";
import BaseButton from "~/components/base/BaseButton.vue";
import FlashcardWordGrid from "~/components/flashcards/FlashcardWordGrid.vue";
import { useAudioPlayer } from "~/composables/useAudioPlayer";
import { toContentFileUrl } from "~/services/contentStorage";
import * as flashcardService from "~/services/flashcardService";
import { useUserStore } from "~/stores/user";
import type { VocabularyItem } from "~/types/vocabulary";
import { deckWordCountLabel, findFlashcardDeck } from "~/utils/flashcardDecks";

const FLASHCARDS_PATH = "/app/browse/flashcards";
// The quiz and the flashcard reader do not exist on the web yet.
const COMING_SOON = "Coming soon";

const route = useRoute();
// null for an unknown status: the page then shows "not found" without querying.
const deck = computed(() => findFlashcardDeck(route.params.status));

const { contentLanguage } = storeToRefs(useUserStore());

const {
  data: words,
  pending,
  error,
} = await useAsyncData(
  () => `flashcards-${contentLanguage.value}-${route.params.status}`,
  () =>
    deck.value
      ? flashcardService.getFlashcardsByStatus(deck.value.status)
      : Promise.resolve([]),
);

const { play: playAudio, isPlaying: isAudioPlaying } = useAudioPlayer();

// Word whose pronunciation was last played; its button is highlighted while it plays.
const lastPlayedWordId = ref<number | null>(null);

const title = computed(() => deck.value?.subtitle ?? "Flashcards");
const countLabel = computed(() =>
  deck.value && words.value ? deckWordCountLabel(deck.value, words.value.length) : null,
);
const playingWordId = computed(() => (isAudioPlaying.value ? lastPlayedWordId.value : null));

/** Plays the pronunciation of a word (audio_url is a path of the content bucket). */
function playWordAudio(word: VocabularyItem) {
  const src = toContentFileUrl(word.audioUrl);
  if (!src) return;
  lastPlayedWordId.value = word.id;
  playAudio(src);
}

useHead(() => ({ title: `${title.value} — Fluemingo` }));
</script>

<template>
  <!-- Figma "Flashcards group page": title and count on the left, the two
       actions on the right (the mobile bottom buttons). -->
  <div class="mb-10 flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
    <div class="min-w-0">
      <PageTitle
        :title="title"
        :crumbs="[
          { text: 'Home', href: '/app/home' },
          { text: 'Flashcards', href: FLASHCARDS_PATH },
          { text: title, href: route.path },
        ]"
      />
      <p v-if="countLabel" class="mt-1 text-[15px] leading-5.5 text-word-text">
        {{ countLabel }}
      </p>
    </div>

    <div v-if="deck" class="flex flex-wrap gap-3">
      <BaseButton
        variant="outline"
        icon="fa-solid fa-circle-question"
        class="w-55"
        disabled
        :title="COMING_SOON"
      >
        Test your knowledge
      </BaseButton>
      <BaseButton icon="fa-solid fa-clone" class="w-55" disabled :title="COMING_SOON">
        Read flashcards
      </BaseButton>
    </div>
  </div>

  <p v-if="!deck" class="text-text-light">
    This deck does not exist.
    <NuxtLink :to="FLASHCARDS_PATH" class="text-primary-dark">Back to flashcards</NuxtLink>
  </p>
  <p v-else-if="error" class="text-error" role="alert">
    Your flashcards could not be loaded.
  </p>
  <p v-else-if="pending" class="py-10 text-center text-text-light">Loading the words…</p>
  <FlashcardWordGrid
    v-else
    :words="words ?? []"
    :status="deck.status"
    :playing-id="playingWordId"
    @play-audio="playWordAudio"
  />
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAsyncData } from "#imports";
import FlashcardDeckCard from "~/components/flashcards/FlashcardDeckCard.vue";
import { useUserStore } from "~/stores/user";
import * as flashcardService from "~/services/flashcardService";
import { FLASHCARD_DECKS, flashcardDeckPath } from "~/utils/flashcardDecks";

useHead({ title: "Flashcards — Fluemingo" });

// The service picks the table from the user's language by itself; the page only
// needs it in the key, so the counts reload when the language changes.
const { contentLanguage } = storeToRefs(useUserStore());

const { data: counts, error } = await useAsyncData(
  () => `flashcard-counts-${contentLanguage.value}`,
  () => flashcardService.getFlashcardCounts(),
);
</script>

<template>
  <PageTitle
    title="Flashcards"
    :crumbs="[
      { text: 'Home', href: '/' },
      { text: 'Flashcards', href: '/app/browse/flashcards' },
    ]"
  />

  <section class="mt-6" aria-labelledby="vocabulary-flashcards-heading">
    <h3 class="mb-2 text-text-primary font-medium">Vocabulary Flashcards</h3>

    <p v-if="error" class="mb-4 text-error" role="alert">
      Your flashcards could not be loaded.
    </p>

    <div
      class="grid max-w-190 grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-4"
    >
      <NuxtLink
        v-for="deck in FLASHCARD_DECKS"
        :key="deck.status"
        :to="flashcardDeckPath(deck.status)"
        class="block rounded-xl no-underline"
      >
        <FlashcardDeckCard
          :status="deck.status"
          :title="deck.title"
          :subtitle="deck.subtitle"
          :icon="deck.icon"
          :image-url="deck.imageUrl"
          :count="counts?.[deck.status] ?? null"
        />
      </NuxtLink>
    </div>
  </section>
</template>

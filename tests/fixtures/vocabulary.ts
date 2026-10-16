import type { VocabularyItem } from "~/types/vocabulary";

/** Builds a VocabularyItem with neutral defaults; override what the test needs. */
export function vocabularyItem(overrides: Partial<VocabularyItem> = {}): VocabularyItem {
  return {
    id: 1,
    text: "une crue",
    type: "nf",
    translation: "a flood",
    audioUrl: null,
    exampleSentence: null,
    exampleTranslation: null,
    basis: null,
    note: null,
    properName: false,
    status: null,
    isAddedByUser: false,
    ...overrides,
  };
}

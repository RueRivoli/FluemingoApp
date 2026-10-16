import type { Tables } from "~~/shared/types/database";

/** One vocabulary entry of a piece of content, in the shape the app displays. */
export interface VocabularyItem {
  id: number;
  /** Word or expression in the learned language, e.g. "une crue" */
  text: string;
  /** Grammatical tag, e.g. "nf", "nm", "v" */
  type: string | null;
  /** Translation in the user's language */
  translation: string | null;
  /** Pronunciation audio */
  audioUrl: string | null;
  /** Example sentence */
  exampleSentence: string | null;
  /** Example translation */
  exampleTranslation: string | null;
  /** Basis: infinitive form for verbs, singular form for nouns */
  basis: string | null;
  /** Explanation */
  note: string | null;
  /** If it's a proper noun */
  properName: boolean;
  /** Id of the user's flashcard for this word; undefined when not saved */
  flashcardId?: number;
  /** Status group: "saved", "difficult", "training", "mastered"; null when not saved */
  status: string | null;
  /** Is it an item added by the user */
  isAddedByUser: boolean;
}

/** Row of a <language>_vocabulary table (fr_vocabulary, en_vocabulary…). */
export type Vocabulary = Tables<
  "fr_vocabulary" | "en_vocabulary" | "es_vocabulary"
>;

/** Row of a <language>_flashcards table (fr_flashcards, en_flashcards…). */
export type Flashcard = Tables<
  "fr_flashcards" | "en_flashcards" | "es_flashcards"
>;

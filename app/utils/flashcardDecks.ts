/** Learning stages a flashcard can be in, as stored in <language>_flashcards.status. */
export const FLASHCARD_STATUSES = ["saved", "difficult", "training", "mastered"] as const;

export type FlashcardStatus = (typeof FLASHCARD_STATUSES)[number];

/** Number of the user's flashcards in each status. */
export type FlashcardCounts = Record<FlashcardStatus, number>;

/** How a flashcard deck is presented on the Flashcards page. */
export interface FlashcardDeck {
  status: FlashcardStatus;
  /** Deck name, e.g. "Oops" */
  title: string;
  /** One-line explanation below the name */
  subtitle: string;
  /** Font Awesome classes of the icon before the name */
  icon: string;
  /** Illustration shown on the colored panel (served from public/) */
  imageUrl: string;
  /** End of the word count on the deck page, e.g. "saved to your flashcards" */
  countSuffix: string;
}

/** The four decks, in the order the mobile app shows them. */
export const FLASHCARD_DECKS: readonly FlashcardDeck[] = [
  {
    status: "saved",
    title: "Saved",
    subtitle: "Saved vocabulary",
    icon: "fa-regular fa-bookmark",
    imageUrl: "/img/flashcards/saved.png",
    countSuffix: "saved to your flashcards",
  },
  {
    status: "difficult",
    title: "Oops",
    subtitle: "Difficult vocabulary",
    icon: "fa-regular fa-triangle-exclamation",
    imageUrl: "/img/flashcards/difficult.png",
    countSuffix: "marked as difficult",
  },
  {
    status: "training",
    title: "Practice",
    subtitle: "Training vocabulary",
    icon: "fa-regular fa-dumbbell",
    imageUrl: "/img/flashcards/training.png",
    countSuffix: "in training",
  },
  {
    status: "mastered",
    title: "Mastered",
    subtitle: "Acquired vocabulary",
    icon: "fa-regular fa-badge-check",
    imageUrl: "/img/flashcards/mastered.png",
    countSuffix: "mastered",
  },
] as const;

/**
 * Label of an expression count: "1 Expression", "0 Expressions", "22 Expressions".
 * @param count - Number of expressions
 * @returns "Expression" for exactly one, "Expressions" otherwise
 */
export function expressionsLabel(count: number): string {
  return count === 1 ? "Expression" : "Expressions";
}

/** Path of the page listing the words of a deck, e.g. "/app/flashcards/saved". */
export function flashcardDeckPath(status: FlashcardStatus): string {
  return `/app/flashcards/${status}`;
}

/**
 * Finds the deck of a status taken from the URL.
 * @returns The deck, or null when the value is not a flashcard status
 */
export function findFlashcardDeck(value: unknown): FlashcardDeck | null {
  return FLASHCARD_DECKS.find((deck) => deck.status === value) ?? null;
}

/**
 * Word count shown under the deck page title: "1 word marked as difficult",
 * "7 words saved to your flashcards".
 */
export function deckWordCountLabel(deck: FlashcardDeck, count: number): string {
  const noun = count === 1 ? "word" : "words";
  return `${count} ${noun} ${deck.countSuffix}`;
}

/**
 * @file Unit tests for flashcardDecks.
 *
 * Covers:
 * - FLASHCARD_DECKS: one deck per status, in the mobile app's order, each with its illustration
 * - expressionsLabel: singular for exactly one, plural otherwise
 * - flashcardDeckPath: the deck page of a status
 * - findFlashcardDeck: deck of a URL status; null for anything else
 * - deckWordCountLabel: singular / plural word count followed by the deck's suffix
 */
import {
  FLASHCARD_DECKS,
  FLASHCARD_STATUSES,
  deckWordCountLabel,
  expressionsLabel,
  findFlashcardDeck,
  flashcardDeckPath,
} from "./flashcardDecks";

describe("FLASHCARD_DECKS", () => {
  it("has one deck per status, in the mobile app's order", () => {
    expect(FLASHCARD_DECKS.map((deck) => deck.status)).toEqual([...FLASHCARD_STATUSES]);
    expect(FLASHCARD_DECKS.map((deck) => deck.title)).toEqual([
      "Saved",
      "Oops",
      "Practice",
      "Mastered",
    ]);
  });

  it("points each deck to its own illustration", () => {
    expect(FLASHCARD_DECKS.map((deck) => deck.imageUrl)).toEqual(
      FLASHCARD_STATUSES.map((status) => `/img/flashcards/${status}.png`),
    );
  });
});

describe("expressionsLabel", () => {
  it.each([
    [0, "Expressions"],
    [1, "Expression"],
    [2, "Expressions"],
    [22, "Expressions"],
  ])("labels %p as %p", (count, expected) => {
    expect(expressionsLabel(count)).toBe(expected);
  });
});

describe("flashcardDeckPath", () => {
  it("points to the deck page of the status", () => {
    expect(flashcardDeckPath("difficult")).toBe("/app/flashcards/difficult");
  });
});

describe("findFlashcardDeck", () => {
  it.each(FLASHCARD_STATUSES)("finds the deck of %p", (status) => {
    expect(findFlashcardDeck(status)?.status).toBe(status);
  });

  it.each([
    ["an unknown status", "favorites"],
    ["a differently cased status", "Saved"],
    ["a missing param", undefined],
    ["a repeated param", ["saved", "difficult"]],
  ])("returns null for %s", (_label, value) => {
    expect(findFlashcardDeck(value)).toBeNull();
  });
});

describe("deckWordCountLabel", () => {
  // The decks are a constant list: index 0 and 1 always exist.
  const saved = FLASHCARD_DECKS[0]!;
  const difficult = FLASHCARD_DECKS[1]!;

  it("uses the singular for exactly one word", () => {
    expect(deckWordCountLabel(difficult, 1)).toBe("1 word marked as difficult");
  });

  it.each([0, 7])("uses the plural for %p words", (count) => {
    expect(deckWordCountLabel(saved, count)).toBe(`${count} words saved to your flashcards`);
  });
});

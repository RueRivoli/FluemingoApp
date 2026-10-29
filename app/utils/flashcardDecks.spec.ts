/**
 * @file Unit tests for flashcardDecks.
 *
 * Covers:
 * - FLASHCARD_DECKS: one deck per status, in the mobile app's order, each with its illustration
 * - expressionsLabel: singular for exactly one, plural otherwise
 */
import { FLASHCARD_DECKS, FLASHCARD_STATUSES, expressionsLabel } from "./flashcardDecks";

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

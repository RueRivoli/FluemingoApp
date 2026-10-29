/**
 * @file Unit tests for splitCueIntoWords.
 *
 * Covers:
 * - Every word becomes clickable; spaces and punctuation stay plain text
 * - The pieces join back into the sentence
 * - Hyphenated words and "aujourd’hui" stay whole; elisions ("l’", "qu’") are split
 * - A unit that is exactly the word lends its base form, never its type,
 *   translation or note; words of a longer unit get a bare definition, still
 *   flagged as a proper name inside a name
 * - A line without units is split from its text
 */
import type { SubtitleCue, WordDefinition } from "~/types/video";
import { splitCueIntoWords } from "./subtitleWords";

const CAFE: WordDefinition = {
  text: "café",
  basis: "café",
  type: "nm",
  translation: "coffee",
  note: "A drink",
  isProperName: false,
};
const TOUR_EIFFEL: WordDefinition = {
  text: "Tour Eiffel",
  basis: null,
  type: null,
  translation: "Eiffel Tower",
  note: null,
  isProperName: true,
};

/** A line made of the given pieces (text joined from them). */
function cue(segments: SubtitleCue["segments"], text = segments.map((s) => s.text).join("")): SubtitleCue {
  return { start: 0, end: 1, text, translation: null, segments };
}

const words = (line: SubtitleCue) =>
  splitCueIntoWords(line)
    .filter((piece) => piece.word)
    .map((piece) => piece.text);

describe("splitCueIntoWords", () => {
  describe("splitting", () => {
    it("makes every word clickable and keeps the rest as plain text", () => {
      const pieces = splitCueIntoWords(cue([], "Un petit café."));

      expect(pieces).toEqual([
        expect.objectContaining({ text: "Un" }),
        { text: " ", word: null },
        expect.objectContaining({ text: "petit" }),
        { text: " ", word: null },
        expect.objectContaining({ text: "café" }),
        { text: ".", word: null },
      ]);
    });

    it("gives back the sentence once joined", () => {
      const line = cue([], "« Bon, on y va ? » dit-il.");

      expect(splitCueIntoWords(line).map((piece) => piece.text).join("")).toBe(line.text);
    });

    it("keeps hyphenated words and aujourd’hui whole", () => {
      expect(words(cue([], "Peut-être aujourd’hui."))).toEqual(["Peut-être", "aujourd’hui"]);
    });

    it("splits elisions from the next word", () => {
      expect(words(cue([], "L’homme qu'il voit."))).toEqual(["L’", "homme", "qu'", "il", "voit"]);
    });
  });

  describe("definitions", () => {
    it("keeps only the unit's base form when it is exactly the word", () => {
      const pieces = splitCueIntoWords(cue([{ text: "Un ", word: null }, { text: "café", word: CAFE }]));

      expect(pieces.find((piece) => piece.text === "café")?.word).toEqual({
        text: "café",
        basis: "café",
        type: null,
        translation: null,
        note: null,
        isProperName: false,
      });
    });

    it("gives the words of a longer unit a bare definition", () => {
      const pieces = splitCueIntoWords(cue([{ text: "Tour Eiffel", word: TOUR_EIFFEL }]));

      expect(pieces[0]?.word).toEqual({
        text: "Tour",
        basis: null,
        type: null,
        translation: null,
        note: null,
        isProperName: true,
      });
    });

    it("does not flag plain words as proper names", () => {
      const [piece] = splitCueIntoWords(cue([], "maison"));

      expect(piece?.word?.isProperName).toBe(false);
    });
  });
});

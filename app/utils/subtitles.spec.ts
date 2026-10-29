/**
 * @file Unit tests for the subtitle utils.
 *
 * Covers:
 * - buildSubtitleCues: sentences of every paragraph in order, translation from
 *   textXx of the given language (textEn by default and as fallback), end
 *   falls back to start, malformed content / paragraphs / sentences skipped
 * - Segments: units become words with basis, type, translation, note and
 *   proper-name flag (user's language, English fallback); original spacing and
 *   punctuation kept as plain text; punctuation, untranslated, missing and
 *   malformed units skipped; no units → one plain segment
 * - hasTranscriptUnits: true only when a sentence has a non-empty units array
 * - translationKey / noteKey: language code → textXx / noteXx key
 * - findActiveCueIndex: -1 before the first cue, the started cue until the
 *   next one, the last cue after the end, empty list
 */
import type { SubtitleCue, SubtitleSegment } from "~/types/video";
import {
  buildSubtitleCues,
  findActiveCueIndex,
  hasTranscriptUnits,
  noteKey,
  translationKey,
} from "./subtitles";

/** A segment that is not a word to look up. */
const plain = (text: string): SubtitleSegment => ({ text, word: null });

describe("translationKey", () => {
  it.each([
    ["en", "textEn"],
    [" JA ", "textJa"],
    ["pt", "textPt"],
  ])("maps %s to %s", (code, key) => {
    expect(translationKey(code)).toBe(key);
  });
});

describe("noteKey", () => {
  it("maps a language code to its note key", () => {
    expect(noteKey(" Es ")).toBe("noteEs");
  });
});

describe("buildSubtitleCues", () => {
  it("lists the sentences of every paragraph, in order", () => {
    const content = {
      paragraphs: [
        { sentences: [{ text: "Bonjour.", start: 0.1, end: 1.2, units: [] }] },
        {
          sentences: [
            { text: "Ça va ?", start: 1.5, end: 2 },
            { text: "Oui.", start: 2.1, end: 2.4 },
          ],
        },
      ],
    };

    expect(buildSubtitleCues(content)).toEqual([
      { start: 0.1, end: 1.2, text: "Bonjour.", translation: null, segments: [plain("Bonjour.")] },
      { start: 1.5, end: 2, text: "Ça va ?", translation: null, segments: [plain("Ça va ?")] },
      { start: 2.1, end: 2.4, text: "Oui.", translation: null, segments: [plain("Oui.")] },
    ]);
  });

  describe("translation", () => {
    const content = {
      paragraphs: [
        {
          sentences: [
            { text: "Merci.", start: 0, end: 1, textEn: " Thanks. ", textEs: "Gracias.", textJa: "ありがとう。" },
          ],
        },
      ],
    };

    it("uses textEn by default", () => {
      expect(buildSubtitleCues(content)[0]?.translation).toBe("Thanks.");
    });

    it.each([
      ["es", "Gracias."],
      ["JA", "ありがとう。"],
    ])("uses the translation of the %s language", (language, expected) => {
      expect(buildSubtitleCues(content, language)[0]?.translation).toBe(expected);
    });

    it("falls back to textEn when the language has no translation", () => {
      expect(buildSubtitleCues(content, "de")[0]?.translation).toBe("Thanks.");
    });

    it("has no translation when the sentence has none", () => {
      const bare = { paragraphs: [{ sentences: [{ text: "Merci.", start: 0, textEs: "" }] }] };

      expect(buildSubtitleCues(bare, "es")[0]?.translation).toBeNull();
    });
  });


  describe("segments", () => {
    /** The cue of a one-sentence transcript. */
    function cueOf(sentence: Record<string, unknown>, language: string | null = null) {
      return buildSubtitleCues({ paragraphs: [{ sentences: [{ start: 0, ...sentence }] }] }, language)[0];
    }

    const sentence = {
      text: "Bonjour les amis, je suis sur Discord.",
      units: [
        { text: "Bonjour", type: "inter", textEn: "Hello", textEs: "Hola" },
        { text: "les amis", type: "nmp", basis: "ami", textEn: "friends", textEs: "amigos" },
        { text: ",", punctuation: true },
        { text: "je suis", type: "v", basis: "être" },
        { text: "sur", type: "prép", textEn: "on" },
        { text: "Discord", properName: true, textEn: "Discord", noteEn: "a chat platform" },
        { text: ".", punctuation: true },
      ],
    };

    it("cuts the sentence into words and plain text that join back into it", () => {
      const segments = cueOf(sentence)?.segments ?? [];

      expect(segments.map((segment) => segment.text).join("")).toBe(sentence.text);
      expect(segments.filter((segment) => segment.word).map((segment) => segment.text)).toEqual([
        "Bonjour",
        "les amis",
        "sur",
        "Discord",
      ]);
    });

    it("keeps untranslated words, spaces and punctuation as plain text", () => {
      const segments = cueOf(sentence)?.segments ?? [];

      expect(segments).toContainEqual(plain(", je suis "));
      expect(segments.at(-1)).toEqual(plain("."));
    });

    it("gives each word its definition", () => {
      const words = (cueOf(sentence)?.segments ?? []).flatMap((segment) => segment.word ?? []);

      expect(words[1]).toEqual({
        text: "les amis",
        basis: "ami",
        type: "nmp",
        translation: "friends",
        note: null,
        isProperName: false,
      });
      expect(words[3]).toMatchObject({ isProperName: true, note: "a chat platform", type: null });
    });

    it("translates the words into the given language, English as a fallback", () => {
      const words = (cueOf(sentence, "es")?.segments ?? []).flatMap((segment) => segment.word ?? []);

      expect(words.map((word) => word.translation)).toEqual(["Hola", "amigos", "on", "Discord"]);
    });

    it("skips units that are malformed or not in the sentence", () => {
      const segments =
        cueOf({ text: "Oui merci.", units: [null, "oui", { text: "Non", textEn: "No" }, { text: "merci", textEn: "thanks" }] })
          ?.segments ?? [];

      expect(segments).toEqual([
        plain("Oui "),
        { text: "merci", word: expect.objectContaining({ translation: "thanks" }) },
        plain("."),
      ]);
    });

    it("looks for repeated words after the previous one", () => {
      const segments =
        cueOf({ text: "le chat et le chien", units: [{ text: "le chat", textEn: "the cat" }, { text: "le chien", textEn: "the dog" }] })
          ?.segments ?? [];

      expect(segments.map((segment) => segment.text)).toEqual(["le chat", " et ", "le chien"]);
    });
  });

  it.each([
    ["missing", undefined],
    ["before the start", 0.5],
  ])("ends the cue at its start when the end is %s", (_label, end) => {
    const content = { paragraphs: [{ sentences: [{ text: "Oui.", start: 1, end }] }] };

    expect(buildSubtitleCues(content)[0]?.end).toBe(1);
  });

  it("skips sentences without text or start time", () => {
    const content = {
      paragraphs: [
        {
          sentences: [
            { text: "   ", start: 0 },
            { text: "Sans début." },
            { text: "Gardée.", start: 3 },
            "not a sentence",
          ],
        },
        { sentences: "not a list" },
        null,
      ],
    };

    expect(buildSubtitleCues(content).map((cue) => cue.text)).toEqual(["Gardée."]);
  });

  it.each([
    ["null", null],
    ["a string", "{\"paragraphs\":[]}"],
    ["an object without paragraphs", { sentences: [] }],
    ["an array", []],
  ])("returns no cue for %s", (_label, content) => {
    expect(buildSubtitleCues(content)).toEqual([]);
  });
});

describe("hasTranscriptUnits", () => {
  it("is true when a sentence has units", () => {
    const content = {
      paragraphs: [
        { sentences: [{ text: "Bonjour.", start: 0 }] },
        { sentences: [{ text: "Paris.", start: 1, units: [{ text: "Paris" }] }] },
      ],
    };

    expect(hasTranscriptUnits(content)).toBe(true);
  });

  it.each([
    ["no content", null],
    ["no paragraphs", {}],
    ["paragraphs without sentences", { paragraphs: [{}] }],
    ["sentences without units", { paragraphs: [{ sentences: [{ text: "Bonjour." }] }] }],
    ["empty units", { paragraphs: [{ sentences: [{ text: "Bonjour.", units: [] }] }] }],
    ["units that are not an array", { paragraphs: [{ sentences: [{ units: "Paris" }] }] }],
  ])("is false with %s", (_label, content) => {
    expect(hasTranscriptUnits(content)).toBe(false);
  });
});

describe("findActiveCueIndex", () => {
  const cues: SubtitleCue[] = [
    { start: 1, end: 3, text: "Un.", translation: null, segments: [] },
    { start: 4, end: 6, text: "Deux.", translation: null, segments: [] },
    { start: 7, end: 9, text: "Trois.", translation: null, segments: [] },
  ];

  it.each([
    [0, -1],
    [1, 0],
    [3.5, 0],
    [4, 1],
    [6.9, 1],
    [42, 2],
  ])("at %ss returns %i", (time, expected) => {
    expect(findActiveCueIndex(cues, time)).toBe(expected);
  });

  it("returns -1 when there are no cues", () => {
    expect(findActiveCueIndex([], 10)).toBe(-1);
  });
});

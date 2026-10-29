import type { SubtitleCue, SubtitleSegment, WordDefinition } from "~/types/video";

/** A run of letters/digits, hyphens and apostrophes inside: "peut-être", "aujourd’hui". */
const WORD_PATTERN = /[\p{L}\p{M}\p{N}]+(?:[-'’][\p{L}\p{M}\p{N}]+)*/gu;

/**
 * French elisions read as two words: "l’homme" → "l’" + "homme",
 * "qu’il" → "qu’" + "il". "aujourd’hui" is not one, so it stays whole.
 */
const ELISION_PATTERN = /^((?:[cdjlmnst]|qu|jusqu|lorsqu|puisqu|quoiqu)['’])(?=\p{L})/iu;

/** Splits "l’homme" into ["l’", "homme"]; other words come back alone. */
function splitElision(word: string): string[] {
  const match = ELISION_PATTERN.exec(word);
  if (!match?.[1]) return [word];
  return [match[1], word.slice(match[1].length)];
}

/**
 * The definition of one word, translated by the dictionary only: a unit that
 * is exactly that word lends its base form (the term looked up), never its
 * type, translation or note, which belong to the contextual mode. Each
 * dictionary translation carries its own part of speech.
 */
function toWord(text: string, unit: WordDefinition | null): WordDefinition {
  const isSameWord = unit?.text.toLowerCase() === text.toLowerCase();
  return {
    text,
    basis: isSameWord ? unit.basis : null,
    type: null,
    translation: null,
    note: null,
    // A word of "Tour Eiffel" is still part of a name: no dictionary lookup.
    isProperName: unit?.isProperName ?? false,
  };
}

/** Cuts one piece of a sentence into words and the text between them. */
function splitSegment(segment: SubtitleSegment): SubtitleSegment[] {
  const pieces: SubtitleSegment[] = [];
  let last = 0;
  for (const match of segment.text.matchAll(WORD_PATTERN)) {
    const start = match.index ?? 0;
    if (start > last) pieces.push({ text: segment.text.slice(last, start), word: null });
    for (const word of splitElision(match[0])) {
      pieces.push({ text: word, word: toWord(word, segment.word) });
    }
    last = start + match[0].length;
  }
  if (last < segment.text.length) pieces.push({ text: segment.text.slice(last), word: null });
  return pieces;
}

/**
 * Cuts a subtitle line into single clickable words, for the "words" mode of
 * the subtitles. Joined, the pieces give back the sentence.
 * @param cue - The line; its units are reused for the words they match exactly
 * @returns The pieces of the sentence, words carrying a definition
 */
export function splitCueIntoWords(cue: SubtitleCue): SubtitleSegment[] {
  const segments: SubtitleSegment[] =
    cue.segments.length > 0 ? cue.segments : [{ text: cue.text, word: null }];
  return segments.flatMap(splitSegment);
}

import type { SubtitleCue, SubtitleSegment, WordDefinition } from "~/types/video";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isTime(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

/** Language of the translation when the user's one is missing (like the mobile app). */
export const DEFAULT_TRANSLATION_LANGUAGE = "en";

/** Trimmed string value of a field, or "" when it is not a string. */
function readText(source: Record<string, unknown>, key: string): string {
  const value = source[key];
  return typeof value === "string" ? value.trim() : "";
}

/** First non-empty value among the given keys, or null. */
function readFirstText(
  source: Record<string, unknown>,
  keys: readonly string[],
): string | null {
  return keys.map((key) => readText(source, key)).find(Boolean) || null;
}

/** "en" → "En", " JA " → "Ja": suffix of the per-language keys of the transcripts. */
function languageSuffix(languageCode: string): string {
  const code = languageCode.trim().toLowerCase();
  return `${code.charAt(0).toUpperCase()}${code.slice(1)}`;
}

/**
 * Key of a sentence's translation for a language code: "en" → "textEn",
 * "ja" → "textJa" (camelCase suffix, as in the transcripts).
 */
export function translationKey(languageCode: string): string {
  return `text${languageSuffix(languageCode)}`;
}

/** Key of a unit's explanation for a language code: "en" → "noteEn". */
export function noteKey(languageCode: string): string {
  return `note${languageSuffix(languageCode)}`;
}

/** Languages to read, in order: the user's one, then English as a fallback. */
function languagesFor(languageCode: string | null): string[] {
  return [
    ...new Set([
      (languageCode || DEFAULT_TRANSLATION_LANGUAGE).trim().toLowerCase(),
      DEFAULT_TRANSLATION_LANGUAGE,
    ]),
  ];
}

/** A unit of the transcript as a word to look up; null for punctuation or when there is nothing to show. */
function toWordDefinition(
  unit: Record<string, unknown>,
  languages: readonly string[],
): WordDefinition | null {
  const text = readText(unit, "text");
  if (!text || unit.punctuation === true) return null;
  const translation = readFirstText(unit, languages.map(translationKey));
  const note = readFirstText(unit, languages.map(noteKey));
  if (!translation && !note) return null;
  return {
    text,
    basis: readText(unit, "basis") || null,
    type: readText(unit, "type") || null,
    translation,
    note,
    isProperName: unit.properName === true,
  };
}

/**
 * Cuts a sentence into segments from its units: each unit is looked up in the
 * text after the previous one, so the original spacing and punctuation are
 * kept. Units that cannot be found are skipped; without units, the whole
 * sentence is one plain segment.
 */
function toSegments(
  text: string,
  units: unknown,
  languages: readonly string[],
): SubtitleSegment[] {
  const segments: SubtitleSegment[] = [];
  let cursor = 0;
  const pushPlain = (end: number) => {
    if (end > cursor) segments.push({ text: text.slice(cursor, end), word: null });
  };
  for (const unit of Array.isArray(units) ? units : []) {
    const word = isRecord(unit) ? toWordDefinition(unit, languages) : null;
    const index = word ? text.indexOf(word.text, cursor) : -1;
    if (!word || index < 0) continue;
    pushPlain(index);
    segments.push({ text: word.text, word });
    cursor = index + word.text.length;
  }
  pushPlain(text.length);
  return segments;
}

/** One sentence of the transcript as a cue; null when it has no text or no start time. */
function toSubtitleCue(
  sentence: unknown,
  languages: readonly string[],
): SubtitleCue | null {
  if (!isRecord(sentence) || !isTime(sentence.start)) return null;
  const text = readText(sentence, "text");
  if (!text) return null;
  return {
    start: sentence.start,
    end:
      isTime(sentence.end) && sentence.end >= sentence.start
        ? sentence.end
        : sentence.start,
    text,
    translation: readFirstText(sentence, languages.map(translationKey)),
    segments: toSegments(text, sentence.units, languages),
  };
}

/**
 * Turns the transcript of a video (fr_videos.content: paragraphs > sentences
 * with text, start, end, translations textEn, textEs, textJa… and units, the
 * words with their translations) into subtitle cues, in order. Malformed
 * parts are skipped rather than breaking the page.
 * @param content - The content column, as stored (any JSON)
 * @param languageCode - Language of the translations (the user's native one); English when missing
 * @returns The cues; an empty list when there is no usable transcript
 */
export function buildSubtitleCues(
  content: unknown,
  languageCode: string | null = null,
): SubtitleCue[] {
  if (!isRecord(content) || !Array.isArray(content.paragraphs)) return [];
  const languages = languagesFor(languageCode);
  return content.paragraphs
    .flatMap((paragraph) =>
      isRecord(paragraph) && Array.isArray(paragraph.sentences)
        ? paragraph.sentences
        : [],
    )
    .map((sentence) => toSubtitleCue(sentence, languages))
    .filter((cue): cue is SubtitleCue => cue !== null);
}

/**
 * Whether the transcript is cut into units (fr_videos.content: paragraphs >
 * sentences > units). Only then can the subtitles offer the contextual mode.
 * @param content - The content column, as stored (any JSON)
 * @returns True when at least one sentence has a non-empty units array
 */
export function hasTranscriptUnits(content: unknown): boolean {
  if (!isRecord(content) || !Array.isArray(content.paragraphs)) return false;
  return content.paragraphs.some(
    (paragraph) =>
      isRecord(paragraph) &&
      Array.isArray(paragraph.sentences) &&
      paragraph.sentences.some(
        (sentence) =>
          isRecord(sentence) && Array.isArray(sentence.units) && sentence.units.length > 0,
      ),
  );
}

/**
 * Index of the cue being spoken at a given time: the last one already
 * started, kept highlighted until the next one starts.
 * @param cues - Cues in time order
 * @param time - Current time of the video, in seconds
 * @returns The index, or -1 before the first cue
 */
export function findActiveCueIndex(
  cues: readonly SubtitleCue[],
  time: number,
): number {
  let active = -1;
  for (let index = 0; index < cues.length; index++) {
    if ((cues[index]?.start ?? Infinity) > time) break;
    active = index;
  }
  return active;
}

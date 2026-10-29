/**
 * Grammatical tags of the transcripts' units (French abbreviations, as in the
 * mobile app) and how the web app spells them out.
 */
export const GRAMMAR_LABELS: Readonly<Record<string, string>> = {
  nm: "noun, masculine",
  nf: "noun, feminine",
  nmp: "noun, masculine plural",
  nfp: "noun, feminine plural",
  v: "verb",
  "v nég": "verb, negative",
  "p.passé": "past participle",
  adj: "adjective",
  "adj poss": "possessive adjective",
  adv: "adverb",
  pron: "pronoun",
  "pron pers": "personal pronoun",
  dét: "determiner",
  prép: "preposition",
  conj: "conjunction",
  inter: "interjection",
  date: "date",
};

/**
 * Readable label of a grammatical tag: "nf" → "noun, feminine".
 * @param type - Tag of the unit, e.g. "pron pers"
 * @returns The label; the tag itself when unknown; null when empty
 */
export function grammarLabel(type: string | null | undefined): string | null {
  const tag = type?.trim();
  if (!tag) return null;
  return GRAMMAR_LABELS[tag] ?? tag;
}

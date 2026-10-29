import type { AudiobookChapter } from "~/types/audiobook";

/** Builds an AudiobookChapter with neutral defaults; override what the test needs. */
export function audiobookChapter(overrides: Partial<AudiobookChapter> = {}): AudiobookChapter {
  return {
    id: 1,
    title: "Le narrateur et le dessin",
    translatedTitle: null,
    duration: 480,
    ...overrides,
  };
}

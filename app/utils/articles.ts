import { LEVELS, type Level } from "~/utils/constants";

export const NEWS_CONTENT_TYPE = 1;
/** Articles per page of the Articles page: fills 2, 3 or 4 grid columns evenly. */
export const ARTICLES_PAGE_SIZE = 24;

/**
 * Narrows a raw level string from the database to a CEFR level.
 * Case-insensitive, so "b1" and "B1" both match.
 */
export function toLevel(value: string | null): Level | null {
  const upper = value?.toUpperCase();
  return LEVELS.find((level) => level === upper) ?? null;
}

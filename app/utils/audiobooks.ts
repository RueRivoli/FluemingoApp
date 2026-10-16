import type { AudiobookInfo, AudiobooksByCategory } from "~/types/audiobook";

export const AUDIOBOOKS_CONTENT_TYPE = 2;

interface AudiobookCategoryDisplay {
  /** Display label; the ids are PascalCase keys, not readable text */
  label: string;
  /** Font Awesome classes */
  icon: string;
  /** Position of the category in lists (1 = first) */
  orderId: number;
}

/**
 * Audiobook categories (the category_1 column).
 * Single source of truth: AudiobookCategory and AUDIOBOOK_CATEGORY_IDS are
 * derived from these keys, so adding a category here is all it takes.
 */
export const AUDIOBOOK_CATEGORIES = {
  Novel: { label: "Novel", icon: "fa-regular fa-book-open", orderId: 4 },
  Tale: { label: "Tale", icon: "fa-regular fa-castle", orderId: 2 },
  Fiction: {
    label: "Fiction",
    icon: "fa-regular fa-wand-magic-sparkles",
    orderId: 3,
  },
  Literature: { label: "Literature", icon: "fa-regular fa-books", orderId: 1 },
  Poetry: {
    label: "Poetry",
    icon: "fa-regular fa-feather-pointed",
    orderId: 5,
  },
  Biography: {
    label: "Biography",
    icon: "fa-regular fa-book-user",
    orderId: 6,
  },
  Travel: {
    label: "Travel",
    icon: "fa-regular fa-suitcase-rolling",
    orderId: 7,
  },
  SelfImprovement: {
    label: "Self-Improvement",
    icon: "fa-regular fa-seedling",
    orderId: 8,
  },
  CareerBusiness: {
    label: "Career & Business",
    icon: "fa-regular fa-briefcase",
    orderId: 9,
  },
} as const satisfies Record<string, AudiobookCategoryDisplay>;

export type AudiobookCategory = keyof typeof AUDIOBOOK_CATEGORIES;

/** Category ids, sorted by orderId. */
// Object.keys is typed string[]; the cast is safe as AUDIOBOOK_CATEGORIES is a
// literal whose keys are exactly the AudiobookCategory ids.
export const AUDIOBOOK_CATEGORY_IDS = (
  Object.keys(AUDIOBOOK_CATEGORIES) as AudiobookCategory[]
).sort(
  (a, b) => AUDIOBOOK_CATEGORIES[a].orderId - AUDIOBOOK_CATEGORIES[b].orderId,
) as readonly AudiobookCategory[];

/** Group key of audiobooks that have no category. */
export const UNCATEGORIZED_KEY = "other";

/** Lowercase category id → its PascalCase id, e.g. "careerbusiness" → "CareerBusiness". */
const CATEGORY_BY_KEY = new Map<string, AudiobookCategory>(
  AUDIOBOOK_CATEGORY_IDS.map((category) => [category.toLowerCase(), category]),
);

/**
 * Group key of a category: its lowercased id ("Novel" → "novel"), or
 * UNCATEGORIZED_KEY when the category is empty.
 */
export function toCategoryKey(category: string | null): string {
  const key = category?.trim().toLowerCase();
  return key || UNCATEGORIZED_KEY;
}

/**
 * Sort rank of a group key: known categories by orderId, then unknown ones,
 * then UNCATEGORIZED_KEY last.
 */
function categoryRank(key: string): number {
  if (key === UNCATEGORIZED_KEY) return Number.MAX_SAFE_INTEGER;
  const category = CATEGORY_BY_KEY.get(key);
  return category
    ? AUDIOBOOK_CATEGORIES[category].orderId
    : AUDIOBOOK_CATEGORY_IDS.length + 1;
}

/**
 * Groups audiobooks by category, keeping their order inside each group:
 * { novel: [...], biography: [...] }. Groups come in the orderId order of
 * their category (unknown categories after, in order of appearance, then "other").
 */
export function groupAudiobooksByCategory(
  audiobooks: AudiobookInfo[],
): AudiobooksByCategory {
  const groups = new Map<string, AudiobookInfo[]>();
  for (const audiobook of audiobooks) {
    const key = toCategoryKey(audiobook.category);
    groups.set(key, [...(groups.get(key) ?? []), audiobook]);
  }
  // Array.prototype.sort is stable: unknown categories keep their order of appearance.
  const sortedKeys = [...groups.keys()].sort(
    (a, b) => categoryRank(a) - categoryRank(b),
  );
  return Object.fromEntries(
    sortedKeys.map((key) => [key, groups.get(key) ?? []]),
  );
}

/**
 * Display label of a group key: "careerbusiness" → "Career & Business".
 * Unknown keys are capitalised; UNCATEGORIZED_KEY becomes "Other".
 */
export function audiobookCategoryLabel(key: string): string {
  if (key === UNCATEGORIZED_KEY) return "Other";
  const category = CATEGORY_BY_KEY.get(key);
  if (category) return AUDIOBOOK_CATEGORIES[category].label;
  return key.charAt(0).toUpperCase() + key.slice(1);
}

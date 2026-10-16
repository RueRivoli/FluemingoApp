/**
 * @file Unit tests for the audiobook helpers.
 *
 * Covers:
 * - toCategoryKey: lowercased id, "other" for empty categories
 * - AUDIOBOOK_CATEGORIES / AUDIOBOOK_CATEGORY_IDS: label, icon, unique orderIds, sorted ids
 * - groupAudiobooksByCategory: one group per category, order kept inside groups,
 *   groups sorted by orderId (unknown then "other" last), empty input
 * - audiobookCategoryLabel: known labels, unknown keys, "other"
 */
import type { AudiobookInfo } from "~/types/audiobook";
import {
  AUDIOBOOK_CATEGORIES,
  AUDIOBOOK_CATEGORY_IDS,
  audiobookCategoryLabel,
  groupAudiobooksByCategory,
  toCategoryKey,
  UNCATEGORIZED_KEY,
} from "./audiobooks";

/** Builds an AudiobookInfo with only the fields the grouping reads. */
function audiobook(id: number, category: string | null): AudiobookInfo {
  return { id, title: `Book ${id}`, category } as AudiobookInfo;
}

describe("AUDIOBOOK_CATEGORIES", () => {
  it.each(AUDIOBOOK_CATEGORY_IDS)("has a label and a Font Awesome icon for %s", (id) => {
    const { label, icon } = AUDIOBOOK_CATEGORIES[id];

    expect(label).not.toBe("");
    expect(icon).toMatch(/^fa-\w+ fa-[\w-]+$/);
  });

  it("gives every category a distinct orderId", () => {
    const orderIds = AUDIOBOOK_CATEGORY_IDS.map((id) => AUDIOBOOK_CATEGORIES[id].orderId);

    expect(new Set(orderIds).size).toBe(orderIds.length);
  });

  it("lists the ids sorted by orderId", () => {
    const orderIds = AUDIOBOOK_CATEGORY_IDS.map((id) => AUDIOBOOK_CATEGORIES[id].orderId);

    expect(orderIds).toEqual([...orderIds].sort((a, b) => a - b));
  });
});

describe("toCategoryKey", () => {
  it.each([
    ["Novel", "novel"],
    ["CareerBusiness", "careerbusiness"],
    [" Tale ", "tale"],
  ])("maps %p to %p", (category, expected) => {
    expect(toCategoryKey(category)).toBe(expected);
  });

  it.each([null, "", "   "])('uses "other" for the empty category %p', (category) => {
    expect(toCategoryKey(category)).toBe(UNCATEGORIZED_KEY);
  });
});

describe("groupAudiobooksByCategory", () => {
  it("groups audiobooks by lowercased category, keeping their order", () => {
    const novel1 = audiobook(1, "Novel");
    const bio = audiobook(2, "Biography");
    const novel2 = audiobook(3, "Novel");

    expect(groupAudiobooksByCategory([novel1, bio, novel2])).toEqual({
      novel: [novel1, novel2],
      biography: [bio],
    });
  });

  it("orders the groups by orderId, then unknown categories, then \"other\"", () => {
    const groups = groupAudiobooksByCategory([
      audiobook(1, null),
      audiobook(2, "Mystery"),
      audiobook(3, "CareerBusiness"),
      audiobook(4, "Horror"),
      audiobook(5, "Novel"),
    ]);

    expect(Object.keys(groups)).toEqual(["novel", "careerbusiness", "mystery", "horror", "other"]);
  });

  it('puts audiobooks without a category in "other"', () => {
    const uncategorized = audiobook(1, null);

    expect(groupAudiobooksByCategory([uncategorized])).toEqual({ other: [uncategorized] });
  });

  it("returns an empty object when there are no audiobooks", () => {
    expect(groupAudiobooksByCategory([])).toEqual({});
  });
});

describe("audiobookCategoryLabel", () => {
  it.each([
    ["novel", "Novel"],
    ["careerbusiness", "Career & Business"],
    ["selfimprovement", "Self-Improvement"],
  ])("labels %p as %p", (key, expected) => {
    expect(audiobookCategoryLabel(key)).toBe(expected);
  });

  it("capitalises an unknown key", () => {
    expect(audiobookCategoryLabel("mystery")).toBe("Mystery");
  });

  it('labels the uncategorized group "Other"', () => {
    expect(audiobookCategoryLabel(UNCATEGORIZED_KEY)).toBe("Other");
  });
});

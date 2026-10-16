/**
 * @file Unit tests for the themes helpers.
 *
 * Covers:
 * - THEMES: every id has a label and a Font Awesome icon
 * - toThemeId: case-insensitive match, null for unknown values
 * - toThemeChip: known theme with label + icon, unknown value kept as plain label
 */
import { THEME_IDS, THEMES, toThemeChip, toThemeId } from "./themes";

describe("THEMES", () => {
  it.each(THEME_IDS)("has a label and a Font Awesome icon for %s", (id) => {
    expect(THEMES[id].label).not.toBe("");
    expect(THEMES[id].icon).toMatch(/^fa-regular fa-[a-z-]+$/);
  });
});

describe("toThemeId", () => {
  it.each([
    ["politics", "politics"],
    ["Politics", "politics"],
    ["japaneseculture", "japaneseCulture"],
    ["JapaneseCulture", "japaneseCulture"],
  ])("resolves %s to %s", (input, expected) => {
    expect(toThemeId(input)).toBe(expected);
  });

  it.each(["unknown", ""])("returns null for %p", (input) => {
    expect(toThemeId(input)).toBeNull();
  });
});

describe("toThemeChip", () => {
  it("returns the label and icon of a known theme", () => {
    expect(toThemeChip("Politics")).toEqual({
      id: "politics",
      label: "Politics",
      icon: "fa-regular fa-landmark-dome",
    });
  });

  it("uses a readable label for multi-word ids", () => {
    expect(toThemeChip("koreanCulture").label).toBe("Korean culture");
  });

  it("keeps an unknown value as a plain label without icon", () => {
    expect(toThemeChip("Gardening")).toEqual({ id: "Gardening", label: "Gardening" });
  });
});

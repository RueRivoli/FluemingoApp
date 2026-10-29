/**
 * @file Unit tests for grammarLabel.
 *
 * Covers:
 * - Known tags are spelled out (including multi-word tags)
 * - Surrounding spaces are ignored
 * - Unknown tags are returned as-is; empty / missing tags give null
 */
import { grammarLabel } from "./grammar";

describe("grammarLabel", () => {
  it.each([
    ["nf", "noun, feminine"],
    ["nmp", "noun, masculine plural"],
    ["pron pers", "personal pronoun"],
    ["prép", "preposition"],
  ])("spells out %s", (type, label) => {
    expect(grammarLabel(type)).toBe(label);
  });

  it("ignores surrounding spaces", () => {
    expect(grammarLabel(" v ")).toBe("verb");
  });

  it("returns unknown tags as-is", () => {
    expect(grammarLabel("loc")).toBe("loc");
  });

  it.each([
    ["empty", ""],
    ["blank", "  "],
    ["null", null],
    ["undefined", undefined],
  ])("returns null when the tag is %s", (_label, type) => {
    expect(grammarLabel(type)).toBeNull();
  });
});

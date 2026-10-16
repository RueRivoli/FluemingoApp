/**
 * @file Unit tests for the language helpers.
 *
 * Covers:
 * - toTargetLanguage: supported codes in any casing, null for empty or unknown values
 */
import { toTargetLanguage } from "./languages";

describe("toTargetLanguage", () => {
  it.each([
    ["fr", "fr"],
    ["en", "en"],
    ["es", "es"],
    ["EN", "en"],
  ])("maps %s to %s", (input, expected) => {
    expect(toTargetLanguage(input)).toBe(expected);
  });

  it.each(["de", "", null])("returns null for %p", (input) => {
    expect(toTargetLanguage(input)).toBeNull();
  });
});

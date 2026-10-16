/**
 * @file Unit tests for the article helpers.
 *
 * Covers:
 * - toLevel: exact and lowercase CEFR levels, unknown and null values
 */
import { toLevel } from "./articles";

describe("toLevel", () => {
  it.each([
    ["B1", "B1"],
    ["c1", "C1"],
  ])("maps %s to %s", (input, expected) => {
    expect(toLevel(input)).toBe(expected);
  });

  it.each(["D1", "", null])("returns null for %p", (input) => {
    expect(toLevel(input)).toBeNull();
  });
});

/**
 * @file Unit tests for formatDuration.
 *
 * Covers:
 * - Seconds → zero-padded "mm:ss"
 * - Minutes above 59 are kept, decimals dropped
 * - null for null/undefined, negative and non-finite input
 */
import { formatDuration } from "./formatDuration";

describe("formatDuration", () => {
  it.each([
    [0, "00:00"],
    [24, "00:24"],
    [480, "08:00"],
    [510, "08:30"],
    [3725, "62:05"],
    [59.9, "00:59"],
  ])("formats %p seconds as %p", (seconds, expected) => {
    expect(formatDuration(seconds)).toBe(expected);
  });

  it.each([null, undefined, -1, Number.NaN, Number.POSITIVE_INFINITY])(
    "returns null for %p",
    (seconds) => {
      expect(formatDuration(seconds)).toBeNull();
    },
  );
});

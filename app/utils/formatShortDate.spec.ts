/**
 * @file Unit tests for formatShortDate.
 *
 * Covers:
 * - Formatting of ISO strings and Date objects as "Oct 7, 2026"
 * - null for invalid or empty input
 */
import { formatShortDate } from "./formatShortDate";

// Jest runs in UTC (tests/globalSetup.ts), so this is Oct 7 whatever the machine.
const ISO_DATE = "2026-10-07T12:00:00Z";

describe("formatShortDate", () => {
  it("formats an ISO timestamp with a short month name", () => {
    expect(formatShortDate(ISO_DATE)).toBe("Oct 7, 2026");
  });

  it("formats a Date object", () => {
    expect(formatShortDate(new Date(ISO_DATE))).toBe("Oct 7, 2026");
  });

  it.each(["not a date", ""])('returns null for the invalid input "%s"', (input) => {
    expect(formatShortDate(input)).toBeNull();
  });
});

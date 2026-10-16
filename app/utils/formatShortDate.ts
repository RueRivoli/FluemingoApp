const SHORT_DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

/**
 * Formats a date as "Oct 7, 2026", in the viewer's time zone.
 *
 * @param date - A Date or anything `new Date()` accepts (e.g. an ISO timestamp from Supabase)
 * @returns The formatted date, or null when the input is not a valid date
 */
export function formatShortDate(date: string | Date): string | null {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  return SHORT_DATE_FORMAT.format(parsed);
}

const SECONDS_PER_MINUTE = 60;
const PAD_LENGTH = 2;

/**
 * Formats a length in seconds as "mm:ss" (e.g. 480 → "08:00"), like the
 * chapter durations of the mobile app. Minutes are not capped at 59.
 *
 * @param seconds - Length in seconds; decimals are dropped
 * @returns The formatted length, or null when the input is null, negative or not a number
 */
export function formatDuration(seconds: number | null | undefined): string | null {
  if (seconds == null || !Number.isFinite(seconds) || seconds < 0) return null;
  const total = Math.floor(seconds);
  const minutes = Math.floor(total / SECONDS_PER_MINUTE);
  const remainder = total % SECONDS_PER_MINUTE;
  return `${String(minutes).padStart(PAD_LENGTH, "0")}:${String(remainder).padStart(PAD_LENGTH, "0")}`;
}

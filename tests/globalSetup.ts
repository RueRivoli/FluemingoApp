/**
 * Runs once before all test files. Pins the time zone so date formatting
 * gives the same result on every machine and in CI.
 */
export default function globalSetup(): void {
  process.env.TZ = "UTC";
}

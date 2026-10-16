/** Reading progress of a piece of content for the current user. */
export const CONTENT_STATUSES = ["not_started", "in_progress", "finished"] as const;

export type ContentStatus = (typeof CONTENT_STATUSES)[number];

/** Display label of each status. */
export const CONTENT_STATUS_LABELS: Record<ContentStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  finished: "Finished",
};

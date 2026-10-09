export const HOME_PATH = "/app/home";
export const AUTH_PATH = "/auth";

export const LEVELS = ["A1", "A2", "B1", "B2", "C1"] as const;
export type Level = (typeof LEVELS)[number];

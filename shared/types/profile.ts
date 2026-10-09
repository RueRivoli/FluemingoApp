// Row of public.profiles, the table shared with the Flutter app. Mirrors
// `profiles.Row` in the mobile repo's database.types.ts.
export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string;
  avatar: string | null;
  avatar_url: string | null;
  native_language: string | null;
  target_language: string | null;
  level: string | null;
  weekly_goal: number | null;
  theme_interest_1: string | null;
  theme_interest_2: string | null;
  theme_interest_3: string | null;
  theme_interest_4: string | null;
  theme_interest_5: string | null;
  is_premium: boolean | null;
  trial_ends_at: string | null;
  trial_reminder_sent_at: string | null;
  notifications_enabled: boolean | null;
  notification_tokens: string[];
  notification_tokens_updated_at: string | null;
  last_new_content_notification_at: string | null;
  reminder_enabled: boolean;
  reminder_time: string | null;
  timezone: string | null;
  last_reminder_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// Columns the client is granted UPDATE on (column-level grants in the
// Supabase migrations). Sending any other column, e.g. role or is_premium,
// makes the whole update fail with "permission denied for table profiles".
export const EDITABLE_PROFILE_FIELDS = [
  "full_name",
  "avatar",
  "avatar_url",
  "native_language",
  "target_language",
  "level",
  "weekly_goal",
  "theme_interest_1",
  "theme_interest_2",
  "theme_interest_3",
  "theme_interest_4",
  "theme_interest_5",
  "reminder_enabled",
  "reminder_time",
  "timezone",
] as const satisfies readonly (keyof Profile)[];

export type ProfileUpdate = Partial<
  Pick<Profile, (typeof EDITABLE_PROFILE_FIELDS)[number]>
>;

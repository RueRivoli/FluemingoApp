import { useSupabase } from "~/composables/useSupabase";
import {
  EDITABLE_PROFILE_FIELDS,
  type Profile,
  type ProfileUpdate,
} from "~~/shared/types/profile";

// Data access for public.profiles. Every function throws the Supabase error
// on failure: callers decide how to surface it.
const PROFILES_TABLE = "profiles";

// Drops anything the column grants would reject, so one stray key cannot fail
// the whole update.
function pickEditableFields(patch: ProfileUpdate): ProfileUpdate {
  return Object.fromEntries(
    Object.entries(patch).filter(([key]) =>
      (EDITABLE_PROFILE_FIELDS as readonly string[]).includes(key),
    ),
  ) as ProfileUpdate;
}

/**
 * Loads the profile row of a user.
 * @returns The profile, or null when the user has no row yet.
 */
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await useSupabase()
    .from(PROFILES_TABLE)
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data as Profile | null;
}

/**
 * Updates the editable columns of a user's profile; other keys are ignored.
 * @returns The updated profile row.
 */
export async function updateProfile(
  userId: string,
  patch: ProfileUpdate,
): Promise<Profile> {
  const { data, error } = await useSupabase()
    .from(PROFILES_TABLE)
    .update({ ...pickEditableFields(patch), updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single();
  if (error) throw error;
  return data as Profile;
}

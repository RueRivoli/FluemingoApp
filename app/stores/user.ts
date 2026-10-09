import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { Subscription, User } from "@supabase/supabase-js";

import * as authService from "~/services/authService";
import * as profileService from "~/services/profileService";
import { resolveAvatarUrl } from "~/utils/avatar";
import type { Profile, ProfileUpdate } from "~~/shared/types/profile";

function toMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

// The logged-in Supabase user and their public.profiles row, shared by every
// /app page. Loaded by the auth middleware before any /app page renders, then
// kept in sync with Supabase (token refresh, sign-out from another tab, profile
// updates).
export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(null);
  const profile = ref<Profile | null>(null);
  const loaded = ref(false);
  const isProfileLoading = ref(false);
  // Why the session or profile could not be loaded; null when all went well.
  const loadError = ref<string | null>(null);
  let subscription: Subscription | null = null;

  const isLoggedIn = computed(() => !!user.value);
  const email = computed(() => profile.value?.email || user.value?.email || "");
  // The profile wins; OAuth metadata (Google, Facebook) and the email are fallbacks.
  const fullName = computed(
    () =>
      profile.value?.full_name ||
      user.value?.user_metadata?.full_name ||
      user.value?.user_metadata?.name ||
      email.value,
  );
  const avatarUrl = computed<string | undefined>(
    () =>
      resolveAvatarUrl(profile.value?.avatar, profile.value?.avatar_url) ||
      user.value?.user_metadata?.avatar_url ||
      user.value?.user_metadata?.picture ||
      undefined,
  );
  const isPremium = computed(() => profile.value?.is_premium ?? false);
  const level = computed(() => profile.value?.level ?? null);
  const nativeLanguage = computed(() => profile.value?.native_language ?? null);
  const targetLanguage = computed(() => profile.value?.target_language ?? null);

  // A failed fetch leaves profile null and sets loadError instead of throwing:
  // the app still works on the auth data alone, and the auth middleware must
  // not break navigation.
  async function fetchProfile() {
    if (!user.value) {
      profile.value = null;
      return;
    }
    const userId = user.value.id;
    isProfileLoading.value = true;
    try {
      const fetched = await profileService.getProfile(userId);
      // The user may have changed (sign-out, account switch) while loading.
      if (user.value?.id !== userId) return;
      profile.value = fetched;
      loadError.value = null;
    } catch (err) {
      loadError.value = toMessage(err);
    } finally {
      isProfileLoading.value = false;
    }
  }

  async function updateProfile(patch: ProfileUpdate) {
    if (!user.value) throw new Error("Not logged in.");
    profile.value = await profileService.updateProfile(user.value.id, patch);
  }

  async function setUser(next: User | null) {
    const changed = next?.id !== user.value?.id;
    user.value = next;
    if (changed) await fetchProfile();
  }

  // An unreadable session counts as logged out, for the same reason as in
  // fetchProfile.
  async function readSessionUser(): Promise<User | null> {
    try {
      return (await authService.getSession())?.user ?? null;
    } catch (err) {
      loadError.value = toMessage(err);
      return null;
    }
  }

  // Safe to call on every navigation: the session is only read once.
  // Resolves as soon as the session is known — the auth middleware only needs
  // isLoggedIn — while the profile keeps loading in the background
  // (isProfileLoading), so the first /app page is not held back by a network
  // round-trip.
  async function init() {
    if (loaded.value) return;

    void setUser(await readSessionUser());
    loaded.value = true;

    subscription ??= authService.onAuthStateChange((_event, session) => {
      // Token refreshes keep the same user: the profile is only refetched on
      // sign-in / sign-out / account switch.
      void setUser(session?.user ?? null);
    });
  }

  // The local state is cleared even if Supabase fails, so the UI never shows a
  // half-logged-out user; the error still reaches the caller.
  async function signOut() {
    try {
      await authService.signOut();
    } finally {
      user.value = null;
      profile.value = null;
    }
  }

  return {
    user,
    profile,
    loaded,
    isProfileLoading,
    loadError,
    isLoggedIn,
    email,
    fullName,
    avatarUrl,
    isPremium,
    level,
    nativeLanguage,
    targetLanguage,
    init,
    fetchProfile,
    updateProfile,
    signOut,
  };
});

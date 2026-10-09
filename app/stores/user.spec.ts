/**
 * @file Unit tests for the user store.
 *
 * Covers:
 * - init: resolves on the session alone, loads the profile in the background
 *   (isProfileLoading), runs once, survives load failures, follows auth
 *   state changes, ignores a profile that arrives for a previous user
 * - Derived fields: fullName / email / avatarUrl fallbacks, profile defaults
 * - updateProfile: delegates to the service, refuses when logged out
 * - signOut: clears the state, even when Supabase fails
 */
import type { Session, User } from "@supabase/supabase-js";
import { createPinia, setActivePinia } from "pinia";

import * as authService from "~/services/authService";
import * as profileService from "~/services/profileService";
import type { Profile } from "~~/shared/types/profile";

import { useUserStore } from "./user";

// The store is tested against its data-access boundary, not Supabase itself.
jest.mock("~/services/authService");
jest.mock("~/services/profileService");

const USER = {
  id: "user-1",
  email: "ada@example.com",
  user_metadata: { name: "Ada OAuth", picture: "https://cdn.test/oauth.png" },
} as unknown as User;
const OTHER_USER = { id: "user-2", user_metadata: {} } as unknown as User;
const PROFILE = {
  id: USER.id,
  email: "ada@profile.com",
  full_name: "Ada Lovelace",
  avatar: "https://cdn.test/avatar.png",
  avatar_url: null,
  is_premium: true,
  level: "B1",
} as Profile;

type AuthListener = Parameters<typeof authService.onAuthStateChange>[0];

function sessionOf(user: User): Session {
  return { user } as Session;
}

/** Lets the background profile fetch settle. */
function flushPromises(): Promise<void> {
  return new Promise(process.nextTick);
}

/** Arranges the session and profile the services return, then runs init(). */
async function initStore(
  { user = USER, profile = PROFILE }: { user?: User | null; profile?: Profile | null } = {},
) {
  jest.mocked(authService.getSession).mockResolvedValue(user ? sessionOf(user) : null);
  jest.mocked(profileService.getProfile).mockResolvedValue(profile);
  const store = useUserStore();
  await store.init();
  await flushPromises();
  return store;
}

/** The listener the store registered with onAuthStateChange. */
function authListener(): AuthListener {
  return jest.mocked(authService.onAuthStateChange).mock.calls[0]![0];
}

describe("useUserStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setActivePinia(createPinia());
    jest.mocked(authService.onAuthStateChange).mockReturnValue({
      unsubscribe: jest.fn(),
    } as unknown as ReturnType<typeof authService.onAuthStateChange>);
  });

  describe("init", () => {
    it("loads the session user and their profile", async () => {
      const store = await initStore();

      expect(store.isLoggedIn).toBe(true);
      expect(store.profile).toEqual(PROFILE);
      expect(store.loaded).toBe(true);
      expect(profileService.getProfile).toHaveBeenCalledWith(USER.id);
    });

    it("stays logged out without a session", async () => {
      const store = await initStore({ user: null });

      expect(store.isLoggedIn).toBe(false);
      expect(store.profile).toBeNull();
      expect(profileService.getProfile).not.toHaveBeenCalled();
    });

    it("resolves before the profile arrives, flagging it as loading", async () => {
      jest.mocked(authService.getSession).mockResolvedValue(sessionOf(USER));
      // Never settles: the profile request is still in flight.
      jest.mocked(profileService.getProfile).mockReturnValue(new Promise(() => {}));
      const store = useUserStore();

      await store.init();

      expect(store.isLoggedIn).toBe(true);
      expect(store.loaded).toBe(true);
      expect(store.isProfileLoading).toBe(true);
      expect(store.profile).toBeNull();
    });

    it("clears isProfileLoading once the profile is loaded", async () => {
      const store = await initStore();

      expect(store.isProfileLoading).toBe(false);
    });

    it("reads the session only once", async () => {
      const store = await initStore();

      await store.init();

      expect(authService.getSession).toHaveBeenCalledTimes(1);
      expect(authService.onAuthStateChange).toHaveBeenCalledTimes(1);
    });

    it("treats an unreadable session as logged out and reports why", async () => {
      jest.mocked(authService.getSession).mockRejectedValue(new Error("Network down"));
      const store = useUserStore();

      await store.init();

      expect(store.isLoggedIn).toBe(false);
      expect(store.loaded).toBe(true);
      expect(store.loadError).toBe("Network down");
    });

    it("keeps the user logged in when the profile fails to load", async () => {
      jest.mocked(authService.getSession).mockResolvedValue(sessionOf(USER));
      jest.mocked(profileService.getProfile).mockRejectedValue(new Error("RLS"));
      const store = useUserStore();

      await store.init();
      await flushPromises();

      expect(store.isLoggedIn).toBe(true);
      expect(store.profile).toBeNull();
      expect(store.isProfileLoading).toBe(false);
      expect(store.loadError).toBe("RLS");
    });
  });

  describe("auth state changes", () => {
    it("loads the new user's profile on account switch", async () => {
      const store = await initStore();
      const otherProfile = { id: OTHER_USER.id } as Profile;
      jest.mocked(profileService.getProfile).mockResolvedValue(otherProfile);

      authListener()("SIGNED_IN", sessionOf(OTHER_USER));
      await flushPromises();

      expect(store.user).toEqual(OTHER_USER);
      expect(store.profile).toEqual(otherProfile);
    });

    it("ignores a profile that arrives after the user changed", async () => {
      let resolveFirst: (profile: Profile) => void = () => {};
      jest.mocked(authService.getSession).mockResolvedValue(sessionOf(USER));
      jest.mocked(profileService.getProfile).mockReturnValueOnce(
        new Promise((resolve) => {
          resolveFirst = resolve;
        }),
      );
      const store = useUserStore();
      await store.init();

      authListener()("SIGNED_OUT", null);
      resolveFirst(PROFILE);
      await flushPromises();

      expect(store.user).toBeNull();
      expect(store.profile).toBeNull();
    });

    it("does not refetch the profile on a token refresh", async () => {
      await initStore();

      authListener()("TOKEN_REFRESHED", sessionOf(USER));
      await flushPromises();

      expect(profileService.getProfile).toHaveBeenCalledTimes(1);
    });

    it("clears the user and profile on sign-out from elsewhere", async () => {
      const store = await initStore();

      authListener()("SIGNED_OUT", null);
      await flushPromises();

      expect(store.isLoggedIn).toBe(false);
      expect(store.profile).toBeNull();
    });
  });

  describe("derived fields", () => {
    it("prefers the profile's name, email and avatar", async () => {
      const store = await initStore();

      expect(store.fullName).toBe("Ada Lovelace");
      expect(store.email).toBe("ada@profile.com");
      expect(store.avatarUrl).toBe("https://cdn.test/avatar.png");
      expect(store.isPremium).toBe(true);
      expect(store.level).toBe("B1");
    });

    it("falls back to the OAuth metadata without a profile", async () => {
      const store = await initStore({ profile: null });

      expect(store.fullName).toBe("Ada OAuth");
      expect(store.email).toBe(USER.email);
      expect(store.avatarUrl).toBe("https://cdn.test/oauth.png");
    });

    it("falls back to the email when no name is known", async () => {
      const user = { id: "u", email: "x@example.com", user_metadata: {} } as unknown as User;
      const store = await initStore({ user, profile: null });

      expect(store.fullName).toBe("x@example.com");
      expect(store.avatarUrl).toBeUndefined();
    });

    it("defaults the profile-only fields without a profile", async () => {
      const store = await initStore({ profile: null });

      expect(store.isPremium).toBe(false);
      expect(store.level).toBeNull();
      expect(store.nativeLanguage).toBeNull();
      expect(store.targetLanguage).toBeNull();
    });
  });

  describe("updateProfile", () => {
    it("saves the patch and stores the updated profile", async () => {
      const store = await initStore();
      const updated = { ...PROFILE, full_name: "Countess Ada" };
      jest.mocked(profileService.updateProfile).mockResolvedValue(updated);

      await store.updateProfile({ full_name: "Countess Ada" });

      expect(profileService.updateProfile).toHaveBeenCalledWith(USER.id, {
        full_name: "Countess Ada",
      });
      expect(store.fullName).toBe("Countess Ada");
    });

    it("refuses when nobody is logged in", async () => {
      const store = await initStore({ user: null });

      await expect(store.updateProfile({ full_name: "X" })).rejects.toThrow(
        "Not logged in.",
      );
      expect(profileService.updateProfile).not.toHaveBeenCalled();
    });

    it("keeps the current profile when the save fails", async () => {
      const store = await initStore();
      jest.mocked(profileService.updateProfile).mockRejectedValue(new Error("denied"));

      await expect(store.updateProfile({ full_name: "X" })).rejects.toThrow("denied");
      expect(store.profile).toEqual(PROFILE);
    });
  });

  describe("signOut", () => {
    it("signs out and clears the state", async () => {
      const store = await initStore();

      await store.signOut();

      expect(authService.signOut).toHaveBeenCalled();
      expect(store.user).toBeNull();
      expect(store.profile).toBeNull();
    });

    it("clears the state and rethrows when Supabase fails", async () => {
      const store = await initStore();
      jest.mocked(authService.signOut).mockRejectedValue(new Error("offline"));

      await expect(store.signOut()).rejects.toThrow("offline");
      expect(store.user).toBeNull();
      expect(store.profile).toBeNull();
    });
  });
});

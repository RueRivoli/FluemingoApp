/**
 * @file Unit tests for authService.
 *
 * Covers:
 * - Each function forwards the right arguments to Supabase Auth
 * - Each function throws the Supabase error on failure
 * - getSession returns the session or null
 * - onAuthStateChange returns the subscription
 * - updatePassword optionally accepts an unchanged password
 */
import { useSupabase } from "~/composables/useSupabase";

import * as authService from "./authService";

jest.mock("~/composables/useSupabase");

const EMAIL = "ada@example.com";
const PASSWORD = "s3cret-pass";
const REDIRECT = "https://fluemingo.test/auth";
const AUTH_ERROR = Object.assign(new Error("Invalid login"), {
  code: "invalid_credentials",
});
const SAME_PASSWORD_ERROR = Object.assign(new Error("Same password"), {
  code: "same_password",
});

interface AuthResult {
  data: Record<string, unknown>;
  error: unknown;
}

/** Fakes supabase.auth; every method resolves to `{ data: {}, error: null }` by default. */
function mockAuth() {
  const ok = (): Promise<AuthResult> => Promise.resolve({ data: {}, error: null });
  const auth = {
    getSession: jest.fn(ok),
    onAuthStateChange: jest.fn(),
    signInWithPassword: jest.fn(ok),
    signInWithOtp: jest.fn(ok),
    verifyOtp: jest.fn(ok),
    signInWithOAuth: jest.fn(ok),
    resetPasswordForEmail: jest.fn(ok),
    updateUser: jest.fn(ok),
    signOut: jest.fn(ok),
  };
  jest.mocked(useSupabase).mockReturnValue({ auth } as unknown as ReturnType<
    typeof useSupabase
  >);
  return auth;
}

function failWith(error: unknown): () => Promise<AuthResult> {
  return () => Promise.resolve({ data: {}, error });
}

describe("authService", () => {
  let auth: ReturnType<typeof mockAuth>;

  beforeEach(() => {
    jest.clearAllMocks();
    auth = mockAuth();
  });

  describe("getSession", () => {
    it("returns the stored session", async () => {
      const session = { access_token: "token" };
      auth.getSession.mockResolvedValue({ data: { session }, error: null });

      await expect(authService.getSession()).resolves.toBe(session);
    });

    it("returns null when nobody is logged in", async () => {
      auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      await expect(authService.getSession()).resolves.toBeNull();
    });

    it("throws the Supabase error", async () => {
      auth.getSession.mockImplementation(failWith(AUTH_ERROR));

      await expect(authService.getSession()).rejects.toBe(AUTH_ERROR);
    });
  });

  describe("onAuthStateChange", () => {
    it("registers the listener and returns its subscription", () => {
      const subscription = { unsubscribe: jest.fn() };
      auth.onAuthStateChange.mockReturnValue({ data: { subscription } });
      const listener = jest.fn();

      const result = authService.onAuthStateChange(listener);

      expect(auth.onAuthStateChange).toHaveBeenCalledWith(listener);
      expect(result).toBe(subscription);
    });
  });

  describe("call forwarding", () => {
    it("signInWithPassword sends the email and password", async () => {
      await authService.signInWithPassword(EMAIL, PASSWORD);

      expect(auth.signInWithPassword).toHaveBeenCalledWith({
        email: EMAIL,
        password: PASSWORD,
      });
    });

    it("sendEmailCode asks for a code and allows account creation", async () => {
      await authService.sendEmailCode(EMAIL);

      expect(auth.signInWithOtp).toHaveBeenCalledWith({
        email: EMAIL,
        options: { shouldCreateUser: true },
      });
    });

    it("verifyEmailCode checks an email OTP", async () => {
      await authService.verifyEmailCode(EMAIL, "12345678");

      expect(auth.verifyOtp).toHaveBeenCalledWith({
        email: EMAIL,
        token: "12345678",
        type: "email",
      });
    });

    it("signInWithProvider starts OAuth with the redirect URL", async () => {
      await authService.signInWithProvider("google", REDIRECT);

      expect(auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: "google",
        options: { redirectTo: REDIRECT },
      });
    });

    it("sendPasswordReset sends the reset link with the redirect URL", async () => {
      await authService.sendPasswordReset(EMAIL, REDIRECT);

      expect(auth.resetPasswordForEmail).toHaveBeenCalledWith(EMAIL, {
        redirectTo: REDIRECT,
      });
    });

    it("updatePassword sends the new password", async () => {
      await authService.updatePassword(PASSWORD);

      expect(auth.updateUser).toHaveBeenCalledWith({ password: PASSWORD });
    });

    it("signOut logs the user out", async () => {
      await authService.signOut();

      expect(auth.signOut).toHaveBeenCalled();
    });
  });

  describe("errors", () => {
    it.each([
      ["signInWithPassword", "signInWithPassword", () => authService.signInWithPassword(EMAIL, PASSWORD)],
      ["sendEmailCode", "signInWithOtp", () => authService.sendEmailCode(EMAIL)],
      ["verifyEmailCode", "verifyOtp", () => authService.verifyEmailCode(EMAIL, "1")],
      ["signInWithProvider", "signInWithOAuth", () => authService.signInWithProvider("apple", REDIRECT)],
      ["sendPasswordReset", "resetPasswordForEmail", () => authService.sendPasswordReset(EMAIL, REDIRECT)],
      ["updatePassword", "updateUser", () => authService.updatePassword(PASSWORD)],
      ["signOut", "signOut", () => authService.signOut()],
    ] as const)("%s throws the Supabase error", async (_name, method, call) => {
      auth[method].mockImplementation(failWith(AUTH_ERROR));

      await expect(call()).rejects.toBe(AUTH_ERROR);
    });
  });

  describe("updatePassword with an unchanged password", () => {
    it("throws by default", async () => {
      auth.updateUser.mockImplementation(failWith(SAME_PASSWORD_ERROR));

      await expect(authService.updatePassword(PASSWORD)).rejects.toBe(
        SAME_PASSWORD_ERROR,
      );
    });

    it("succeeds when allowSamePassword is set", async () => {
      auth.updateUser.mockImplementation(failWith(SAME_PASSWORD_ERROR));

      await expect(
        authService.updatePassword(PASSWORD, { allowSamePassword: true }),
      ).resolves.toBeUndefined();
    });

    it("still throws other errors when allowSamePassword is set", async () => {
      auth.updateUser.mockImplementation(failWith(AUTH_ERROR));

      await expect(
        authService.updatePassword(PASSWORD, { allowSamePassword: true }),
      ).rejects.toBe(AUTH_ERROR);
    });
  });
});

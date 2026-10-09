import type {
  AuthChangeEvent,
  Session,
  Subscription,
} from "@supabase/supabase-js";

import { useSupabase } from "~/composables/useSupabase";

// Supabase Auth calls used by the site. Every function throws the Supabase
// error on failure: callers decide how to surface it.

export type OAuthProvider = "google" | "apple" | "facebook";

export type AuthStateListener = (
  event: AuthChangeEvent,
  session: Session | null,
) => void;

// Returned by updateUser when the new password equals the current one.
const SAME_PASSWORD_ERROR_CODE = "same_password";

/** Returns the stored session, or null when nobody is logged in. */
export async function getSession(): Promise<Session | null> {
  const { data, error } = await useSupabase().auth.getSession();
  if (error) throw error;
  return data.session;
}

/**
 * Calls `listener` on every auth change (sign-in, sign-out, token refresh,
 * password recovery…).
 * @returns The subscription; call `unsubscribe()` to stop listening.
 */
export function onAuthStateChange(listener: AuthStateListener): Subscription {
  return useSupabase().auth.onAuthStateChange(listener).data.subscription;
}

/** Logs in with an email and password. */
export async function signInWithPassword(
  email: string,
  password: string,
): Promise<void> {
  const { error } = await useSupabase().auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
}

/**
 * Emails a one-time code; creates the account on first use. No redirect URL,
 * so the "Magic Link" email template must show {{ .Token }}.
 */
export async function sendEmailCode(email: string): Promise<void> {
  const { error } = await useSupabase().auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  });
  if (error) throw error;
}

/** Checks the code sent by `sendEmailCode`; logs the user in on success. */
export async function verifyEmailCode(
  email: string,
  token: string,
): Promise<void> {
  const { error } = await useSupabase().auth.verifyOtp({
    email,
    token,
    type: "email",
  });
  if (error) throw error;
}

/** Starts the OAuth flow; the browser leaves the site for the provider. */
export async function signInWithProvider(
  provider: OAuthProvider,
  redirectTo: string,
): Promise<void> {
  const { error } = await useSupabase().auth.signInWithOAuth({
    provider,
    options: { redirectTo },
  });
  if (error) throw error;
}

/** Emails a password reset link that leads back to `redirectTo`. */
export async function sendPasswordReset(
  email: string,
  redirectTo: string,
): Promise<void> {
  const { error } = await useSupabase().auth.resetPasswordForEmail(email, {
    redirectTo,
  });
  if (error) throw error;
}

/**
 * Sets the logged-in user's password.
 * @param options.allowSamePassword - Treat "same as the current password" as a
 * success instead of an error.
 */
export async function updatePassword(
  password: string,
  options: { allowSamePassword?: boolean } = {},
): Promise<void> {
  const { error } = await useSupabase().auth.updateUser({ password });
  if (!error) return;
  if (options.allowSamePassword && error.code === SAME_PASSWORD_ERROR_CODE) {
    return;
  }
  throw error;
}

/** Logs the user out on this device. */
export async function signOut(): Promise<void> {
  const { error } = await useSupabase().auth.signOut();
  if (error) throw error;
}

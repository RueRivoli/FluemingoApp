import type { AuthChangeEvent, Session, Subscription, User } from "@supabase/supabase-js";

// The logged-in Supabase user, shared by every /app page. Loaded by the auth
// middleware before any /app page renders, then kept in sync with Supabase
// (token refresh, sign-out from another tab, profile updates).
export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(null);
  const loaded = ref(false);
  let subscription: Subscription | null = null;

  const isLoggedIn = computed(() => !!user.value);
  const email = computed(() => user.value?.email ?? "");
  // OAuth providers (Google, Facebook) fill these; email sign-ups fall back to the email.
  const fullName = computed(
    () => user.value?.user_metadata?.full_name || user.value?.user_metadata?.name || email.value,
  );
  const avatarUrl = computed<string | undefined>(
    () => user.value?.user_metadata?.avatar_url || user.value?.user_metadata?.picture || undefined,
  );

  // Safe to call on every navigation: the session is only read once.
  async function init() {
    if (loaded.value) return;

    const auth = useSupabase().auth;
    const { data } = await auth.getSession();
    user.value = data.session?.user ?? null;
    loaded.value = true;

    subscription ??= auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      user.value = session?.user ?? null;
    }).data.subscription;
  }

  async function signOut() {
    await useSupabase().auth.signOut();
    user.value = null;
  }

  return { user, loaded, isLoggedIn, email, fullName, avatarUrl, init, signOut };
});

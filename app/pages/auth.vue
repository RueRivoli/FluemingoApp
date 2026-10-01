<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import type {
  AuthChangeEvent,
  Session,
  Subscription,
} from "@supabase/supabase-js";

useHead({ title: "Log in — Fluemingo" });

// Where users land once they are authenticated.
const HOME_PATH = "/app/home";

type Mode = "signin" | "signup" | "forgot" | "recovery";

const mode = ref<Mode>("signin");
const form = reactive({ email: "", password: "" });
const status = ref<"idle" | "loading">("idle");
const errorMessage = ref("");
const infoMessage = ref("");
const session = ref<Session | null>(null);
let authSubscription: Subscription | null = null;

// The switch mirrors the mockup: off = Log In, on = Sign Up.
const isSignUp = computed({
  get: () => mode.value === "signup",
  set: (value: boolean) => setMode(value ? "signup" : "signin"),
});

const submitLabel = computed(
  () =>
    ({
      signin: "Log In",
      signup: "Create my account",
      forgot: "Send reset link",
      recovery: "Update password",
    })[mode.value],
);

const isLoading = computed(() => status.value === "loading");

function setMode(next: Mode) {
  mode.value = next;
  errorMessage.value = "";
  infoMessage.value = "";
}

function resetMessages() {
  errorMessage.value = "";
  infoMessage.value = "";
}

// Supabase redirects (OAuth, email confirmation, password reset) land back here.
function redirectUrl() {
  return `${window.location.origin}/auth`;
}

async function run(action: () => Promise<void>) {
  resetMessages();
  status.value = "loading";
  try {
    await action();
  } catch (err) {
    errorMessage.value =
      err instanceof Error ? err.message : "Something went wrong. Please try again.";
  } finally {
    status.value = "idle";
  }
}

function signInWithProvider(provider: "google" | "facebook") {
  return run(async () => {
    const { error } = await useSupabase().auth.signInWithOAuth({
      provider,
      options: { redirectTo: redirectUrl() },
    });
    if (error) throw error;
  });
}

function handleSubmit() {
  return run(async () => {
    const auth = useSupabase().auth;

    if (mode.value === "signin") {
      const { error } = await auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (error) throw error;
      form.password = "";
    } else if (mode.value === "signup") {
      const { data, error } = await auth.signUp({
        email: form.email,
        password: form.password,
        options: { emailRedirectTo: redirectUrl() },
      });
      if (error) throw error;
      form.password = "";
      // With email confirmation enabled, no session is returned until the link is clicked.
      if (!data.session) {
        infoMessage.value = `Almost there! Check ${form.email} to confirm your account.`;
      }
    } else if (mode.value === "forgot") {
      const { error } = await auth.resetPasswordForEmail(form.email, {
        redirectTo: redirectUrl(),
      });
      if (error) throw error;
      infoMessage.value = `If an account exists for ${form.email}, a reset link is on its way.`;
    } else {
      const { error } = await auth.updateUser({ password: form.password });
      if (error) throw error;
      form.password = "";
      mode.value = "signin";
      infoMessage.value = "Your password has been updated.";
    }
  });
}

// Any successful login (password, OAuth callback, email confirmation link,
// existing session) sends the user to the app — except during a password
// reset, where they must first choose a new password.
watch(session, (current) => {
  if (current && mode.value !== "recovery") {
    navigateTo(HOME_PATH, { replace: true });
  }
});

// Supabase reports OAuth / email-link failures in the query string or the hash.
function readRedirectError() {
  const params = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.slice(1));
  return (
    params.get("error_description") ??
    hash.get("error_description") ??
    params.get("error") ??
    hash.get("error")
  );
}

onMounted(async () => {
  const redirectError = readRedirectError();
  if (redirectError) errorMessage.value = redirectError;

  try {
    const auth = useSupabase().auth;
    const { data } = await auth.getSession();
    session.value = data.session;
    authSubscription = auth.onAuthStateChange(
      (event: AuthChangeEvent, newSession: Session | null) => {
        session.value = newSession;
        if (event === "PASSWORD_RECOVERY") setMode("recovery");
      },
    ).data.subscription;
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : String(err);
  }
});

onBeforeUnmount(() => authSubscription?.unsubscribe());
</script>

<template>
  <div class="auth-page">
    <!-- Brand panel -->
    <aside class="auth-brand">
      <NuxtLink to="/" class="brand-logo" aria-label="Fluemingo home">
        <img src="/logo/official_white.png" alt="" width="48" height="48" />
        <span>Fluemingo</span>
      </NuxtLink>

      <div class="brand-copy">
        <h1>
          Welcome to <span class="accent">Fluemingo</span><br />
          Learn with your favorite content
        </h1>
        <p>
          Read, listen and build a strong and lasting vocabulary — wherever you
          are, now right from your browser.
        </p>
      </div>

      <p class="brand-footer">
        <i class="fa-light fa-language" aria-hidden="true"></i>
        Start your language journey today
      </p>

      <div class="brand-blob brand-blob-1" aria-hidden="true"></div>
      <div class="brand-blob brand-blob-2" aria-hidden="true"></div>
    </aside>

    <!-- Form panel -->
    <main class="auth-panel">
      <div class="auth-card">
        <NuxtLink to="/" class="back-link">
          <i class="fa-light fa-arrow-left" aria-hidden="true"></i>
          Back to home page
        </NuxtLink>

        <!-- Logged in: the watcher above is redirecting to the app -->
        <section v-if="session && mode !== 'recovery'" class="signed-in">
          <ProgressSpinner style="width: 2.5rem; height: 2.5rem" />
          <p>Logging you in…</p>
        </section>

        <template v-else>
          <div v-if="mode === 'signin' || mode === 'signup'" class="mode-switch">
            <label
              for="mode-switch"
              :class="{ active: !isSignUp }"
              @click.prevent="isSignUp = false"
              >Log In</label
            >
            <ToggleSwitch v-model="isSignUp" input-id="mode-switch" />
            <label
              for="mode-switch"
              :class="{ active: isSignUp }"
              @click.prevent="isSignUp = true"
              >Sign Up</label
            >
          </div>
          <h2 v-else class="mode-title">
            {{ mode === "forgot" ? "Reset your password" : "Choose a new password" }}
          </h2>

          <template v-if="mode === 'signin' || mode === 'signup'">
            <div class="social-buttons">
              <Button
                class="social-btn"
                fluid
                :disabled="isLoading"
                @click="signInWithProvider('google')"
              >
                <svg class="social-icon" viewBox="0 0 48 48" aria-hidden="true">
                  <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                  <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
                  <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/>
                </svg>
                <span>{{ isSignUp ? "Sign up" : "Log in" }} with Google</span>
              </Button>

              <Button
                class="social-btn"
                fluid
                :disabled="isLoading"
                @click="signInWithProvider('facebook')"
              >
                <svg class="social-icon" viewBox="0 0 48 48" aria-hidden="true">
                  <circle cx="24" cy="24" r="22" fill="#1877F2"/>
                  <path fill="#fff" d="M30.6 30.4l1-6.4h-6.1v-4.2c0-1.8.9-3.5 3.6-3.5h2.8v-5.5s-2.5-.4-4.9-.4c-5 0-8.3 3-8.3 8.5V24h-5.6v6.4h5.6V46c1.1.2 2.3.3 3.5.3s2.3-.1 3.4-.3V30.4h5z"/>
                </svg>
                <span>{{ isSignUp ? "Sign up" : "Log in" }} with Facebook</span>
              </Button>
            </div>

            <Divider align="center" class="or-divider">
              <span>OR</span>
            </Divider>
          </template>

          <form class="auth-form" @submit.prevent="handleSubmit">
            <div v-if="mode !== 'recovery'" class="field">
              <label for="email">Email</label>
              <InputText
                id="email"
                v-model="form.email"
                type="email"
                autocomplete="email"
                placeholder="you@email.com"
                required
                fluid
                :disabled="isLoading"
              />
            </div>

            <div v-if="mode !== 'forgot'" class="field">
              <label for="password">
                {{ mode === "recovery" ? "New password" : "Password" }}
              </label>
              <Password
                v-model="form.password"
                input-id="password"
                placeholder="password"
                :autocomplete="mode === 'signin' ? 'current-password' : 'new-password'"
                :feedback="mode !== 'signin'"
                toggle-mask
                required
                fluid
                :disabled="isLoading"
              />
            </div>

            <button
              v-if="mode === 'signin'"
              type="button"
              class="text-link"
              @click="setMode('forgot')"
            >
              Forgot your password?
            </button>

            <Message v-if="errorMessage" severity="error" :closable="false">
              {{ errorMessage }}
            </Message>
            <Message v-if="infoMessage" severity="success" :closable="false">
              {{ infoMessage }}
            </Message>

            <Button
              type="submit"
              :label="submitLabel"
              fluid
              size="large"
              class="submit-btn"
              :loading="isLoading"
            />

            <button
              v-if="mode === 'forgot'"
              type="button"
              class="text-link center"
              @click="setMode('signin')"
            >
              Back to log in
            </button>
          </form>

          <p v-if="mode === 'signup'" class="legal">
            By creating an account you agree to our
            <NuxtLink to="/terms">Terms</NuxtLink> and
            <NuxtLink to="/privacy-policy">Privacy Policy</NuxtLink>.
          </p>
        </template>
      </div>
    </main>
  </div>
</template>

<style scoped>
.auth-page {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  min-height: 100vh;
  background-color: var(--color-background);
}

/* ---------- Brand panel ---------- */
.auth-brand {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 3rem;
  padding: clamp(2rem, 5vw, 4rem);
  background: linear-gradient(
    160deg,
    var(--color-primary) 0%,
    var(--color-primary-dark) 100%
  );
  color: white;
}

.brand-logo,
.brand-copy,
.brand-footer {
  position: relative;
  z-index: 1;
}

.brand-logo {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: white;
  font-size: 1.75rem;
  font-weight: 700;
}

.brand-logo img {
  width: 3rem;
  height: 3rem;
  object-fit: contain;
}

.brand-copy h1 {
  font-size: clamp(2rem, 3.6vw, 3.25rem);
  font-weight: 700;
  line-height: 1.15;
  margin-bottom: 1.5rem;
  overflow-wrap: anywhere;
}

.brand-copy .accent {
  color: var(--color-secondary);
}

.brand-copy p {
  max-width: 34rem;
  font-size: clamp(1rem, 1.4vw, 1.2rem);
  line-height: 1.6;
  opacity: 0.92;
}

.brand-footer {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  opacity: 0.9;
}

.brand-footer i {
  font-size: 1.25rem;
}

.brand-blob {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.brand-blob-1 {
  width: 28rem;
  height: 28rem;
  right: -10rem;
  top: -8rem;
  background: rgba(255, 255, 255, 0.08);
}

.brand-blob-2 {
  width: 120%;
  height: 12rem;
  left: -10%;
  bottom: -8rem;
  background: rgba(246, 215, 90, 0.18);
}

/* ---------- Form panel ---------- */
.auth-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(2rem, 5vw, 4rem) var(--page-gutter);
}

.auth-card {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: min(100%, 28rem);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  align-self: flex-start;
  font-weight: 500;
  font-size: 0.95rem;
  text-decoration: none;
  color: var(--color-text);
  transition: color 0.2s;
}

.back-link:hover {
  color: var(--color-primary-dark);
}

.mode-switch {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 1.15rem;
}

.mode-switch label {
  cursor: pointer;
  color: var(--color-text-muted);
  transition: color 0.2s;
}

.mode-switch label.active {
  color: var(--color-primary-dark);
  font-weight: 700;
}

.mode-title {
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
}

.signed-in {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
}

.social-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.social-btn {
  gap: 0.75rem;
  padding-block: 0.85rem;
  background: var(--color-neutral);
  border-color: var(--color-neutral);
  color: white;
  font-weight: 500;
}

.social-btn:not(:disabled):hover {
  background: #333;
  border-color: #333;
  color: white;
}

.social-icon {
  width: 1.4rem;
  height: 1.4rem;
}

.or-divider {
  margin: 0;
}

.or-divider :deep(.p-divider-content) {
  background: var(--color-background);
}

.or-divider span {
  font-size: 0.85rem;
  color: var(--color-text-light);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field label {
  font-weight: 500;
  font-size: 0.95rem;
}

.text-link {
  align-self: flex-start;
  border: none;
  background: none;
  padding: 0;
  font: inherit;
  font-size: 0.95rem;
  color: var(--color-primary-dark);
  text-decoration: underline;
  cursor: pointer;
}

.text-link.center {
  align-self: center;
}

.submit-btn {
  margin-top: 0.5rem;
  font-weight: 700;
}

.legal {
  font-size: 0.8rem;
  text-align: center;
  color: var(--color-text-light);
}

.legal a {
  color: var(--color-primary-dark);
}

/* ---------- Responsive ---------- */
@media (max-width: 900px) {
  .auth-page {
    grid-template-columns: minmax(0, 1fr);
  }

  .auth-brand {
    gap: 1.5rem;
  }

  .brand-copy h1 {
    margin-bottom: 0.75rem;
  }

  .brand-footer {
    display: none;
  }
}

@media (max-width: 640px) {
  .brand-copy p {
    display: none;
  }
}
</style>

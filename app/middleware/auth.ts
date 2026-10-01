// Protects /app/* pages: visitors without a Supabase session are sent to /auth.
// The site is statically generated, so the session only exists in the browser:
// skip the check while prerendering and let the client run it on hydration.
export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return;

  const { data } = await useSupabase().auth.getSession();
  if (!data.session) {
    return navigateTo("/auth", { replace: true });
  }
});

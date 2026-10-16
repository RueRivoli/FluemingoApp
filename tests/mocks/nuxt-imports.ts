/**
 * Stand-ins for Nuxt auto-imports, mapped from `#imports` / `#app` in jest.config.ts.
 * Code under test imports these from `#imports` so each test can control them.
 */
export const useRoute = jest.fn(() => ({ path: "/", params: {}, query: {} }));
export const useRouter = jest.fn(() => ({ push: jest.fn(), replace: jest.fn() }));
export const navigateTo = jest.fn();
export const useRuntimeConfig = jest.fn(() => ({ public: {} }));
export const useFetch = jest.fn();
export const useAsyncData = jest.fn();

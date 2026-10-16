import type { Config } from "jest";

const config: Config = {
  // Only crawl source and tests; the repo root also holds dist/, .nuxt/ and content/.
  roots: ["<rootDir>/app", "<rootDir>/tests"],
  // Watchman hangs on this repo; the node crawler is fast enough with `roots` set.
  watchman: false,
  testEnvironment: "jsdom",
  testEnvironmentOptions: { customExportConditions: ["node", "node-addons"] },
  moduleFileExtensions: ["ts", "js", "json", "vue"],
  globals: {
    // The repo has no root tsconfig.json (Nuxt keeps it in .nuxt/), so vue-jest
    // gets an explicit one to transpile the TypeScript in .vue files.
    "vue-jest": { tsConfig: "./tests/tsconfig.jest.json" },
  },
  transform: {
    "^.+\\.vue$": "@vue/vue3-jest",
    // Type-checking is `nuxi typecheck`'s job; ts-jest only transpiles.
    "^.+\\.ts$": ["ts-jest", { tsconfig: "<rootDir>/tests/tsconfig.jest.json" }],
    // Only used for the ESM-only packages let through transformIgnorePatterns.
    "^.+\\.m?js$": [
      "babel-jest",
      { presets: [["@babel/preset-env", { targets: { node: "current" } }]] },
    ],
  },
  // Pinia 4, PrimeVue and their dependencies ship ESM only, so Jest has to
  // transpile them.
  transformIgnorePatterns: [
    "/node_modules/(?!(pinia|@vue/devtools-api|nostics|primevue|@primevue|@primeuix)/)",
  ],
  moduleNameMapper: {
    "^~~/(.*)$": "<rootDir>/$1",
    "^~/(.*)$": "<rootDir>/app/$1",
    "^@/(.*)$": "<rootDir>/app/$1",
    "^#imports$": "<rootDir>/tests/mocks/nuxt-imports.ts",
    "^#app$": "<rootDir>/tests/mocks/nuxt-imports.ts",
    "\\.(css|scss)$": "<rootDir>/tests/mocks/style.ts",
  },
  globalSetup: "<rootDir>/tests/globalSetup.ts",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  testMatch: ["**/*.spec.ts"],
  clearMocks: true,
  collectCoverageFrom: [
    "app/{components,composables,utils,stores}/**/*.{ts,vue}",
    "!**/*.spec.ts",
  ],
  coverageThreshold: {
    global: { lines: 80, branches: 80, functions: 80, statements: 80 },
  },
};

export default config;

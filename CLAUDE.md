# CLAUDE.md

Guidance for Claude when working in this repository. Follow these rules unless the user explicitly asks otherwise. When a rule conflicts with existing code, follow the rule for new code and mention the inconsistency instead of silently rewriting unrelated files.

---

## 1. Project overview

- **Framework:** Nuxt 4 (Vue 3, Composition API, `<script setup>`)
- **Language:** TypeScript everywhere (`strict: true`). No plain `.js` files in `app/`, `server/` or `shared/`.
- **Testing:** Jest + `@vue/test-utils` + `@vue/vue3-jest` for unit tests.
- **Styling:** scoped styles or utility classes; no global CSS except in `app/assets/css/`.
- **Package manager:** use the one matching the lockfile (`pnpm-lock.yaml` → pnpm, etc.). Never mix.

### Core principles
1. **Readable first.** Code is read far more than written. Prefer clarity over cleverness.
2. **Small, single-purpose units.** One component = one responsibility. One composable = one concern.
3. **Every component and composable is tested.** No feature is "done" without its unit tests.
4. **Explicit over magic.** Typed props, typed emits, typed return values, explicit imports in testable code.
5. **Scalable structure.** New features go into predictable places (see §2). Don't invent new top-level folders.

---

## 2. Directory structure

```
app/
├── assets/              # Global CSS, fonts, images processed by the bundler
├── components/
│   ├── base/            # Generic, reusable UI primitives (BaseButton, BaseInput, BaseModal)
│   ├── layout/          # App shell pieces (LayoutHeader, LayoutFooter, LayoutSidebar)
│   └── <feature>/       # Feature-specific components (e.g. user/UserCard.vue, cart/CartItem.vue)
├── composables/         # Reusable stateful logic: useXxx.ts
├── layouts/             # Nuxt layouts
├── middleware/          # Route middleware
├── pages/               # Route pages — thin, they compose components
├── plugins/             # Nuxt plugins
├── services/            # Data access (Supabase queries/auth): typed async functions that throw on error
├── stores/              # Pinia stores (if used): useXxxStore.ts
├── types/               # Shared TS types/interfaces for the app
└── utils/               # Pure, stateless helper functions
server/
├── api/                 # API routes (Nitro)
├── services/            # Business logic used by API routes
└── utils/               # Server-only helpers
shared/                  # Types & utils used by both app and server
tests/
├── setup.ts             # Global Jest setup
├── mocks/               # Shared mocks (Nuxt composables, fetch, stores)
└── fixtures/            # Reusable test data
```

### Co-location of tests
Unit tests live **next to the file they test**:

```
app/components/user/
├── UserCard.vue
└── UserCard.spec.ts
app/composables/
├── useCounter.ts
└── useCounter.spec.ts
```

---

## 3. Naming conventions

| Thing | Convention | Example |
|---|---|---|
| Components | PascalCase, multi-word, prefixed by folder | `BaseButton.vue`, `UserProfileCard.vue` |
| Base components | `Base` prefix | `BaseInput.vue` |
| Single-instance components | `The` prefix | `TheNavbar.vue` |
| Composables | `use` + PascalCase | `useAuth.ts` |
| Stores | `use` + Name + `Store` | `useCartStore.ts` |
| Utils | camelCase verb-first | `formatPrice.ts` |
| Types / interfaces | PascalCase, no `I` prefix | `User`, `CartItem` |
| Test files | `<FileName>.spec.ts` | `BaseButton.spec.ts` |
| Events | kebab-case in templates, camelCase in `defineEmits` | `@update-value` / `updateValue` |
| Booleans | `is`/`has`/`can`/`should` prefix | `isLoading`, `hasError` |
| Constants | UPPER_SNAKE_CASE | `MAX_ITEMS_PER_PAGE` |

---

## 4. Component rules

### Structure of a `.vue` file
Always in this order: `<script setup lang="ts">` → `<template>` → `<style scoped>`.

Inside `<script setup>`, in this order:
1. Imports
2. Props (`defineProps`) and defaults (`withDefaults`)
3. Emits (`defineEmits`)
4. Models (`defineModel`)
5. Composables / stores
6. Reactive state (`ref`, `reactive`)
7. Computed
8. Watchers
9. Functions / handlers
10. Lifecycle hooks
11. `defineExpose` (only if truly needed)

### Template for a new component

```vue
<script setup lang="ts">
import { computed } from 'vue'

/**
 * BaseButton — generic clickable button.
 *
 * @example
 * <BaseButton variant="primary" :loading="isSaving" @click="save">Save</BaseButton>
 */

interface Props {
  /** Visual style of the button */
  variant?: 'primary' | 'secondary' | 'danger'
  /** Shows a spinner and disables the button */
  loading?: boolean
  /** Disables the button */
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  loading: false,
  disabled: false,
})

const emit = defineEmits<{
  /** Fired when the button is clicked and not disabled/loading */
  click: [event: MouseEvent]
}>()

const isInactive = computed(() => props.disabled || props.loading)

function handleClick(event: MouseEvent) {
  if (isInactive.value) return
  emit('click', event)
}
</script>

<template>
  <button
    type="button"
    :class="['base-button', `base-button--${variant}`]"
    :disabled="isInactive"
    :aria-busy="loading"
    data-testid="base-button"
    @click="handleClick"
  >
    <span v-if="loading" class="base-button__spinner" aria-hidden="true" />
    <slot />
  </button>
</template>

<style scoped>
/* BEM-style class names, scoped to the component */
</style>
```

### Rules
- **Size limit:** a component over ~200 lines (or with more than one clear responsibility) must be split.
- **Props down, events up.** Never mutate props. Use `defineModel` for two-way binding.
- **Type everything:** props, emits, refs whose type isn't obvious, function return types for exported functions.
- **No business logic in templates.** Move expressions longer than a simple condition into `computed`.
- **No direct API calls in presentational components.** Fetch in pages, composables or stores; pass data via props.
- **Pages are thin:** they fetch data, handle route params, and compose feature components.
- **`v-for` always has a stable `:key`** (never the index if items can be reordered/removed).
- **Never use `v-if` and `v-for` on the same element.**
- **Accessibility:** semantic HTML, labels for inputs, `alt` on images, keyboard-reachable interactive elements.
- **`data-testid`** on elements that tests need to target; don't select by CSS classes in tests.
- **Explicit imports** from `vue` (`ref`, `computed`, `watch`…) in components and composables. Nuxt auto-imports are not available in Jest, so explicit imports keep files testable.

---

## 5. Composables, stores, utils

- **Composables** (`useXxx`) encapsulate reusable *stateful* logic. Return an object of refs/computed/functions, with an explicit return type.
- **Utils** are **pure functions**: no side effects, no reactivity, no Nuxt context. Easiest to test — prefer moving logic here when possible.
- **Stores** (Pinia) hold *shared* app state only. Local state stays in components.
- Data fetching: use `useFetch` / `useAsyncData` / `$fetch` inside composables or pages, never scattered across components. Always handle `pending` and `error` states.
- Isolate Nuxt-specific calls (`useRuntimeConfig`, `useRoute`, `navigateTo`, `useFetch`…) so they can be mocked in tests (see §7).

```ts
// app/composables/useCounter.ts
import { ref, computed, type Ref, type ComputedRef } from 'vue'

export interface UseCounterReturn {
  count: Ref<number>
  isAtMax: ComputedRef<boolean>
  increment: () => void
  reset: () => void
}

/**
 * Manages a bounded counter.
 * @param max - Upper bound (inclusive). Increment is ignored once reached.
 */
export function useCounter(max = 10): UseCounterReturn {
  const count = ref(0)
  const isAtMax = computed(() => count.value >= max)

  function increment() {
    if (!isAtMax.value) count.value++
  }

  function reset() {
    count.value = 0
  }

  return { count, isAtMax, increment, reset }
}
```

---

## 6. TypeScript rules

- `strict: true`. No `any` — use `unknown` and narrow it. `// @ts-expect-error` only with a comment explaining why.
- Shared domain types go in `app/types/` (or `shared/types/` if the server uses them too).
- Prefer `interface` for object shapes, `type` for unions and utility types.
- Exported functions declare their return type.
- Use `as const` for constant maps and literal unions.

---

## 7. Testing with Jest

### Requirements
- **Every** component, composable, store and util has a co-located `*.spec.ts` file.
- When creating or modifying a component, create or update its test **in the same change**.
- Run the tests after changes and make sure they pass before considering the task complete.
- Coverage target: **≥ 80%** lines/branches globally; aim for 100% on `utils/`.

### Setup reference
Key dev dependencies: `jest`, `ts-jest`, `@vue/vue3-jest`, `@vue/test-utils`, `jest-environment-jsdom`, `@types/jest`.

```ts
// jest.config.ts
import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'jsdom',
  testEnvironmentOptions: { customExportConditions: ['node', 'node-addons'] },
  moduleFileExtensions: ['ts', 'js', 'json', 'vue'],
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/app/$1',
    '^@/(.*)$': '<rootDir>/app/$1',
    '^#imports$': '<rootDir>/tests/mocks/nuxt-imports.ts',
    '^#app$': '<rootDir>/tests/mocks/nuxt-imports.ts',
    '\\.(css|scss)$': '<rootDir>/tests/mocks/style.ts',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testMatch: ['**/*.spec.ts'],
  collectCoverageFrom: [
    'app/{components,composables,utils,stores}/**/*.{ts,vue}',
    '!**/*.spec.ts',
  ],
  coverageThreshold: { global: { lines: 80, branches: 80, functions: 80, statements: 80 } },
}

export default config
```

Nuxt composables (`useRoute`, `useFetch`, `navigateTo`, `useRuntimeConfig`…) must be imported from `#imports` in code under test, and are mocked in `tests/mocks/nuxt-imports.ts` with `jest.fn()`.

### How to write a test
Follow **Arrange → Act → Assert**, one behaviour per `it`. Test **behaviour visible to the user** (rendered output, emitted events, public API), not implementation details.

```ts
// app/components/base/BaseButton.spec.ts
/**
 * @file Unit tests for BaseButton.
 *
 * Covers:
 * - Rendering of slot content and variant class
 * - Click emission when active
 * - No emission when disabled or loading
 * - Accessibility attributes in loading state
 */
import { mount } from '@vue/test-utils'
import BaseButton from './BaseButton.vue'

/** Mounts BaseButton with sensible defaults; override per test. */
function factory(props = {}, slot = 'Save') {
  return mount(BaseButton, { props, slots: { default: slot } })
}

describe('BaseButton', () => {
  describe('rendering', () => {
    it('renders the slot content', () => {
      // Arrange & Act
      const wrapper = factory({}, 'Submit')

      // Assert
      expect(wrapper.text()).toContain('Submit')
    })

    it('applies the class matching the variant prop', () => {
      const wrapper = factory({ variant: 'danger' })

      expect(wrapper.classes()).toContain('base-button--danger')
    })
  })

  describe('click behaviour', () => {
    it('emits "click" when clicked and active', async () => {
      const wrapper = factory()

      await wrapper.get('[data-testid="base-button"]').trigger('click')

      expect(wrapper.emitted('click')).toHaveLength(1)
    })

    it.each([
      ['disabled', { disabled: true }],
      ['loading', { loading: true }],
    ])('does not emit "click" when %s', async (_label, props) => {
      const wrapper = factory(props)

      await wrapper.get('[data-testid="base-button"]').trigger('click')

      expect(wrapper.emitted('click')).toBeUndefined()
    })
  })

  describe('accessibility', () => {
    it('sets aria-busy while loading', () => {
      const wrapper = factory({ loading: true })

      expect(wrapper.attributes('aria-busy')).toBe('true')
    })
  })
})
```

### Test documentation rules
- Each spec file starts with a `@file` JSDoc block listing **what behaviours are covered**.
- `describe` blocks group by feature/behaviour (`rendering`, `props`, `events`, `edge cases`…).
- `it` descriptions read as sentences: `it('shows an error message when the API fails')`.
- Non-obvious setup or mocks get a one-line comment explaining **why**.
- Use `factory()` helpers and `tests/fixtures/` instead of duplicating setup.
- Always cover: default render, each prop's effect, each emitted event, slots, edge cases (empty, loading, error states).

### Mocking rules
- Mock only at boundaries: API calls, Nuxt composables, stores, timers, browser APIs.
- Never mock the unit under test or Vue itself.
- Reset mocks between tests (`clearMocks: true` or `jest.clearAllMocks()` in `beforeEach`).
- Use `jest.useFakeTimers()` for debounce/timeout logic.
- Use `await flushPromises()` (from `@vue/test-utils`) after async actions.

---

## 8. Code style & quality

- ESLint (`@nuxt/eslint`) + Prettier. Code must pass `lint` with zero errors before a task is done.
- Max function length ~30 lines; max nesting depth 3. Use early returns.
- No commented-out code. No `console.log` in committed code (use a logger or remove).
- No magic numbers/strings: extract to named constants.
- JSDoc on every exported function, composable, and on every component (purpose + `@example`). Comment the **why**, not the **what**.
- Handle errors explicitly; never swallow them in empty `catch` blocks.
- Don't add a dependency without a clear reason; prefer the platform and Nuxt built-ins.

---

## 9. Performance & security

- Lazy-load heavy components (`Lazy` prefix or `defineAsyncComponent`).
- Use `<NuxtImg>` / `<NuxtLink>` instead of raw `<img>` / `<a>` for internal routes and images when the modules are installed.
- Prefer `computed` over watchers for derived state.
- Never use `v-html` with untrusted content.
- Secrets live in `runtimeConfig` (private keys), never in `runtimeConfig.public` or client code.
- Validate all input in `server/api/` routes (e.g. with `zod`).

---

## 10. Commands

```bash
pnpm dev            # start dev server
pnpm build          # production build
pnpm lint           # ESLint
pnpm lint:fix       # ESLint with autofix
pnpm typecheck      # nuxi typecheck
pnpm test           # jest
pnpm test:watch     # jest --watch
pnpm test:coverage  # jest --coverage
```

---

## 11. Workflow for Claude

When asked to build or change a feature:
1. **Read first:** check the existing structure and similar components before creating new ones. Reuse `base/` components.
2. **Plan briefly:** list the components/composables/utils to create or modify.
3. **Implement** following §4–§6.
4. **Write/update tests** following §7.
5. **Verify:** run `pnpm lint`, `pnpm typecheck` and `pnpm test`. Fix failures; don't disable rules or skip tests to make them pass.
6. **Summarise:** what changed, which files, and anything left to decide.

Never:
- Delete or weaken a test to make it pass.
- Use `any`, `@ts-ignore`, or `eslint-disable` without a justifying comment.
- Put logic in pages that belongs in a composable or component.
- Create files outside the structure in §2 without asking.
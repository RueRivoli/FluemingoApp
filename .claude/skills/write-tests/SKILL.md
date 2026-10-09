Write tests
Write documented Jest tests for an existing unit, following CLAUDE.md §7. Tests describe what the unit does for its users, so they must still pass after any refactor that keeps that behaviour.

1. Identify the scope
   A single file: test that file.

A folder or "everything missing": list the units with no co-located \*.spec.ts:

````bash

for f in $(find app/components app/composables app/utils app/stores \( -name '*.vue' -o -name '*.ts' \) ! -name '*.spec.ts' 2>/dev/null); do
  [ -f "${f%.*}.spec.ts" ] || echo "$f"
done
Work through them one at a time, simplest first (utils → composables → base components → feature components).

"Raise coverage": run pnpm test:coverage and start with the files furthest below the 80% threshold.

2. Read the unit and list its behaviours
Read the file fully before writing anything. Write down the behaviour list, which becomes the @file header:

| Unit type | What to list | |---|---| | Component | default render, the effect of each prop, each emit with its payload, each slot, each state (loading / empty / error / disabled), user interactions, accessibility attributes | | Composable | initial state, each returned function's effect on the state, computed values, edge cases, the Nuxt composables it calls | | Util | normal inputs, boundaries (0, empty, max), invalid input, thrown errors | | Store | initial state, each action, each getter, interaction with mocked API calls |

If a spec already exists, compare it to this list and only add what's missing. Keep existing tests unless they're wrong.

If the code is hard to test (logic buried in the template, direct API calls in a presentational component, Nuxt auto-imports with no explicit import), say so. Propose the smallest refactor that fixes it, such as extracting a computed or a util, or importing from #imports. Do it only if it doesn't change behaviour.

3. Write the spec
The spec lives next to the unit as <Name>.spec.ts.

Component
```ts

/**
 * @file Unit tests for BaseInput.
 *
 * Covers:
 * - Rendering of label and placeholder
 * - v-model updates
 * - Error message and aria-invalid when `error` is set
 * - Disabled state
 */
import { mount } from '@vue/test-utils'
import BaseInput from './BaseInput.vue'

/** Mounts BaseInput with a label; override per test. */
function factory(props = {}) {
  return mount(BaseInput, { props: { label: 'Email', modelValue: '', ...props } })
}

describe('BaseInput', () => {
  describe('v-model', () => {
    it('emits "update:modelValue" with the typed value', async () => {
      const wrapper = factory()

      await wrapper.get('[data-testid="base-input"]').setValue('a@b.fr')

      expect(wrapper.emitted('update:modelValue')).toEqual([['a@b.fr']])
    })
  })

  describe('error state', () => {
    it('shows the error and marks the field invalid', () => {
      const wrapper = factory({ error: 'Required' })

      expect(wrapper.get('[data-testid="base-input-error"]').text()).toBe('Required')
      expect(wrapper.get('[data-testid="base-input"]').attributes('aria-invalid')).toBe('true')
    })
  })
})
Composable with a Nuxt dependency
```ts

/**
 * @file Unit tests for useUserProfile.
 *
 * Covers:
 * - Loading the profile for the route's user id
 * - Error state when the request fails
 */
import { flushPromises } from '@vue/test-utils'
import { useRoute, $fetch } from '#imports'
import { useUserProfile } from './useUserProfile'
import { userFixture } from '../../tests/fixtures/user'

// #imports is mapped to tests/mocks/nuxt-imports.ts, where these are jest.fn()
const mockedUseRoute = useRoute as jest.Mock
const mockedFetch = $fetch as unknown as jest.Mock

describe('useUserProfile', () => {
  beforeEach(() => {
    mockedUseRoute.mockReturnValue({ params: { id: '42' } })
  })

  it('loads the profile of the user in the route', async () => {
    mockedFetch.mockResolvedValue(userFixture)

    const { user, load } = useUserProfile()
    await load()

    expect(mockedFetch).toHaveBeenCalledWith('/api/users/42')
    expect(user.value).toEqual(userFixture)
  })

  it('exposes the error when the request fails', async () => {
    mockedFetch.mockRejectedValue(new Error('Network'))

    const { error, load } = useUserProfile()
    await load()
    await flushPromises()

    expect(error.value?.message).toBe('Network')
  })
})
Util
Use it.each tables for input/output cases:

```ts

/**
 * @file Unit tests for formatPrice.
 *
 * Covers:
 * - Formatting in euros with French locale
 * - Zero and negative values
 * - Rejection of non-finite numbers
 */
import { formatPrice } from './formatPrice'

describe('formatPrice', () => {
  it.each([
    [10, '10,00 €'],
    [0, '0,00 €'],
    [-5.5, '-5,50 €'],
  ])('formats %p as %p', (input, expected) => {
    // Intl uses a narrow no-break space before "€"; normalise it for readability
    expect(formatPrice(input).replace(/ | /g, ' ')).toBe(expected)
  })

  it('throws on non-finite numbers', () => {
    expect(() => formatPrice(Number.NaN)).toThrow()
  })
})
Documentation rules (always)
A @file JSDoc header listing what the spec covers
describe blocks by behaviour; it reads as a sentence ("shows an error when…")
Arrange → Act → Assert, one behaviour per it
A one-line comment explaining why for every non-obvious mock or setup
factory() helpers and tests/fixtures/ instead of duplicated setup
What not to do
Don't test implementation details (internal refs, private functions, CSS classes used only for styling).
Don't snapshot whole components; assert specific output.
Don't mock the unit under test or Vue itself.
Don't share mutable state between tests; reset mocks in beforeEach if clearMocks isn't set.
Don't add it.skip, it.only, or loosen an assertion to get a pass.
4. Run and iterate
```bash

pnpm test -- path/to/Name.spec.ts
pnpm test:coverage -- --collectCoverageFrom=path/to/Name.vue
A test fails because the test is wrong: fix the test.
A test fails because the code has a bug: don't change the test to match the bug. Report it to the user with the failing case, and fix the code only if asked or if the fix is obvious and contained.
Coverage shows uncovered branches: add tests for them, or explain why they're unreachable.
Finish with pnpm lint and pnpm typecheck on the new spec files.

5. Report
Tell the user:

which spec files were created or updated
the behaviours now covered, and the coverage before and after when it was measured
any bug found, or code that was hard to test, with the suggested fix
````

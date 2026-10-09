New component
Create a component and its test in one go, following the conventions in CLAUDE.md.

1. Clarify the component
   Infer these from the request; ask only if something is truly ambiguous:

Purpose: one sentence. If it needs "and", it is probably two components.
Category, which decides the folder:
base/: generic UI primitive with no business logic (BaseInput, BaseModal)
layout/: app shell piece (LayoutHeader)
<feature>/: tied to a domain (user/UserCard, cart/CartItem)
Props, emits, v-model (defineModel) and slots.
States: loading, empty, error, disabled?
Then check for reuse: search app/components/ for something similar. Prefer composing or extending an existing component (especially from base/) over creating a near-duplicate.

2. Name and place it
   PascalCase, multi-word, prefixed by its folder: app/components/user/UserProfileCard.vue.
   Base prefix in base/, The prefix for single-instance components.
   Test file next to it: UserProfileCard.spec.ts.
3. Write the component
   File order: <script setup lang="ts"> → <template> → <style scoped>.

Script order: imports → props → emits → models → composables/stores → state → computed → watchers → functions → lifecycle hooks → defineExpose.

````vue

<script setup lang="ts">
/**
 * UserProfileCard — displays a user's initials and name, and lets the user select it.
 *
 * @example
 * <UserProfileCard :user="user" @select="openProfile" />
 */
import { computed } from 'vue'
import type { User } from '~/types/user'

interface Props {
  /** User to display */
  user: User
  /** Highlights the card */
  selected?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selected: false,
})

const emit = defineEmits<{
  /** Fired when the card is clicked; carries the user id */
  select: [id: User['id']]
}>()

const initials = computed(() =>
  props.user.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase(),
)

function handleSelect() {
  emit('select', props.user.id)
}
</script>

<template>
  <article
    :class="['user-profile-card', { 'user-profile-card--selected': selected }]"
    data-testid="user-profile-card"
  >
    <button type="button" data-testid="user-profile-card-button" @click="handleSelect">
      <span class="user-profile-card__avatar" aria-hidden="true">{{ initials }}</span>
      <span data-testid="user-profile-card-name">{{ user.name }}</span>
    </button>
    <slot name="actions" />
  </article>
</template>

<style scoped>
.user-profile-card { /* … */ }
</style>
Checklist:

[ ] Props, emits and models fully typed, each with a JSDoc comment
[ ] Component-level JSDoc with purpose and @example
[ ] Vue APIs imported explicitly from vue; Nuxt composables from #imports
[ ] No prop mutation; no API calls in presentational components
[ ] Template expressions kept simple; logic moved to computed
[ ] data-testid on every element a test needs to target
[ ] Semantic HTML, accessible labels, keyboard-reachable interactive elements
[ ] Stable :key on every v-for
[ ] Under ~200 lines; split it if larger
4. Write the test
Create <ComponentName>.spec.ts next to the component.

```ts

/**
 * @file Unit tests for UserProfileCard.
 *
 * Covers:
 * - Rendering of the user's name
 * - Selected state modifier
 * - "select" event with the user id
 * - "actions" slot
 */
import { mount } from '@vue/test-utils'
import UserProfileCard from './UserProfileCard.vue'
import { userFixture } from '../../../tests/fixtures/user'

/** Mounts UserProfileCard with a default user; override per test. */
function factory(props = {}, slots = {}) {
  return mount(UserProfileCard, {
    props: { user: userFixture, ...props },
    slots,
  })
}

describe('UserProfileCard', () => {
  describe('rendering', () => {
    it('shows the user name', () => {
      const wrapper = factory()

      expect(wrapper.get('[data-testid="user-profile-card-name"]').text()).toBe(userFixture.name)
    })

    it('applies the selected modifier when selected', () => {
      const wrapper = factory({ selected: true })

      expect(wrapper.classes()).toContain('user-profile-card--selected')
    })
  })

  describe('events', () => {
    it('emits "select" with the user id when clicked', async () => {
      const wrapper = factory()

      await wrapper.get('[data-testid="user-profile-card-button"]').trigger('click')

      expect(wrapper.emitted('select')).toEqual([[userFixture.id]])
    })
  })

  describe('slots', () => {
    it('renders the actions slot', () => {
      const wrapper = factory({}, { actions: '<button>Edit</button>' })

      expect(wrapper.text()).toContain('Edit')
    })
  })
})
Cover at minimum:

the default render
the visible effect of each prop
each emitted event, including its payload
each slot
every state the component has (loading, empty, error, disabled)
Test rules:

@file JSDoc header listing what is covered
describe blocks by behaviour; it descriptions read as sentences
Arrange → Act → Assert, one behaviour per it
Select elements with data-testid, never with CSS classes
Reuse tests/fixtures/; add a fixture there when the data will be reused
Mock only boundaries (Nuxt composables via #imports, stores, API calls)
5. Verify
Run these and fix anything that fails:

```bash

pnpm test -- path/to/ComponentName.spec.ts
pnpm lint
pnpm typecheck
Never weaken or skip a test to make it pass.

6. Report
Tell the user:

which files were created, and where
the component's props, events and slots, in one short list
any assumption made or decision left open
````

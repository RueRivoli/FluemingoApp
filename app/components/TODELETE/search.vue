<!-- UserSearch.vue -->
<script setup lang="ts">
import { ref, watch } from "vue";

// GET https://dummyjson.com/users/search?q=john
// → { users: [{ id, firstName, lastName, email, image }], total, skip, limit }

// types.ts
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
}

export interface SearchResponse {
  users: User[];
  total: number;
}

const url = 'https://dummyjson.com/users/search'
const options: RequestInit = {}
const query = ref(null);
const users = ref<User[]>([])
const loading = ref(false)

function debounce (func: any, delay: number) {
    let timeout
    return (...args) => {
        if (timeout !== null) clearTimeout(timeout)
        timeout = setTimeout(this.apply(func, args), delay)
    }
}

async function fetchUsers (name: String) {
    try {
        loading.value = true
        const res = await fetch(url + `?q=${name}`);
        if (res.ok) users.value = res.json().users
        else if (res.status === 404) throw new Error("404")
    } catch (err) {
       console.error(err)
    } finally {
        loading.value = false
    }
}

watch(
  () => query.value,
  async (userName) => {
    debounce((userName) => fetchUsers(userName), 1000)(userName)
  },
);
</script>

<template>
  <input v-model="query" placeholder="Search a user..." />
  <p>
    <ul v-for="(u, n) in users" :key="n">
        <li>
            {{u.firstName}} - {{u.lastName}}
        </li>
        <li>
            {{u.email}}
        </li>
    </ul>
  </p>
</template>

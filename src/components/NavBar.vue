<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const { needsAuthentication } = storeToRefs(authStore);

function logOut() {
  authStore.logOut();
  window.location.href = '/'; // Force refresh even if on home page
}
</script>
<template>
  <header class="flex flex-wrap bg-primary text-3xl">
    <div v-if="$route.fullPath === '/'" class="flex-1 px-8 py-4">
      <span class="font-bold text-accent">TheBlog&nbsp;Admin</span
      ><span class="text-lg"> By&nbsp;Joe&nbsp;Zlonicky</span>
    </div>
    <nav v-else class="flex-1 border-r-2 border-accent border-opacity-50">
      <RouterLink
        to="/"
        class="block px-8 py-4 font-bold text-accent hover:bg-primary-highlight"
      >
        &larr; Dashboard
      </RouterLink>
    </nav>
    <button
      v-show="!needsAuthentication"
      class="mx-4 my-auto max-h-12 rounded-md text-lg"
      @click="logOut"
    >
      Log out
    </button>
  </header>
</template>

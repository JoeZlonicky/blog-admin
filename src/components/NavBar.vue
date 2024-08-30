<script setup lang="ts">
import { router } from '@/router';
import { useAuthStore } from '@/stores/useAuthStore';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const authStore = useAuthStore();
const { needsAuthentication } = storeToRefs(authStore);

function logInOrOutPressed() {
  // Log in should never be pressable because modal will always be showing
  if (!needsAuthentication.value) {
    authStore.logOut();
    router.push('/');
  }
}

const logInOrOutText = computed(() =>
  needsAuthentication.value ? 'Log in' : 'Log out',
);
</script>
<template>
  <header class="flex flex-wrap bg-primary text-3xl">
    <div v-if="$route.fullPath === '/'" class="flex-1 px-8 py-4">
      <span class="font-bold text-accent">TheBlog&nbsp;Admin</span
      ><span class="text-lg"> By&nbsp;Joe&nbsp;Zlonicky</span>
    </div>
    <nav v-else>
      <RouterLink
        to="/"
        class="block flex-1 px-8 py-4 font-bold text-accent hover:bg-primary-highlight"
      >
        &larr; Dashboard
      </RouterLink>
    </nav>
    <button
      class="mx-4 my-auto max-h-12 rounded-md text-lg"
      @click="logInOrOutPressed"
    >
      {{ logInOrOutText }}
    </button>
  </header>
</template>

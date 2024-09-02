<script setup lang="ts">
import APICallButton from './APICallButton.vue';
import { useAuthStore } from '@/stores/useAuthStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const router = useRouter();

const authStore = useAuthStore();
const { needsAuthentication } = storeToRefs(authStore);

async function logOut() {
  await authStore.logOut();
  router.push('/');
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
    <APICallButton
      v-show="!needsAuthentication"
      class="mx-4 my-auto max-h-12 rounded-md text-lg"
      :api-call="logOut"
    >
      Log out
    </APICallButton>
  </header>
</template>

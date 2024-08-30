<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const username = defineModel<string>('username');
const password = defineModel<string>('password');
const errorMessage = ref<string | null>(null);

const authStore = useAuthStore();
const { needsAuthentication } = storeToRefs(authStore);

const dialog = ref<HTMLElement | null>(null);

async function onSubmitForm() {
  try {
    await authStore.attemptLogIn(
      username.value as string,
      password.value as string,
    );
    errorMessage.value = null;
    needsAuthentication.value = false;
  } catch (err) {
    if (err instanceof Error) {
      errorMessage.value = err.message;
    } else {
      errorMessage.value = 'Unknown error';
    }
  } finally {
    password.value = '';
  }
}
</script>
<template>
  <div
    v-show="needsAuthentication"
    ref="dialog"
    class="bg-dim-backdrop fixed inset-0"
  >
    <form
      class="mx-auto mt-16 flex max-w-md flex-col items-center gap-4 bg-primary p-8"
      @submit.prevent="onSubmitForm"
    >
      <h1 class="text-center font-bold text-accent">Log In</h1>

      <div class="flex w-full max-w-80 flex-col gap-1">
        <label for="username">Username:</label>
        <input id="username" v-model="username" required />
      </div>

      <div class="flex w-full max-w-80 flex-col gap-1">
        <label for="password">Password:</label>
        <input id="password" v-model="password" type="password" required />
      </div>
      <p v-if="errorMessage" class="font-bold">{{ errorMessage }}</p>
      <button class="mx-auto mt-2 block" type="submit">Log In</button>
    </form>
  </div>
</template>

<style scoped></style>

<script setup lang="ts">
import { logIn } from '@/api/logIn';
import { ref } from 'vue';

const username = defineModel<string>('username');
const password = defineModel<string>('password');
const errorMessage = ref<string | null>(null);

async function onSubmitForm() {
  try {
    const jwt = await logIn(username.value as string, password.value as string);
    console.log(jwt);
    errorMessage.value = null;
  } catch (err) {
    errorMessage.value = 'Log-in failed';
  }
}
</script>
<template>
  <div class="px-5">
    <main class="mx-auto mt-8 max-w-lg bg-primary p-8">
      <form
        class="flex flex-col items-center gap-4"
        @submit.prevent="onSubmitForm"
      >
        <h1 class="text-center font-bold text-accent">Log In</h1>

        <div class="flex w-full max-w-80 flex-col gap-1">
          <label for="username">Username:</label>
          <input v-model="username" name="username" required />
        </div>

        <div class="flex w-full max-w-80 flex-col gap-1">
          <label for="password">Password:</label>
          <input v-model="password" name="password" type="password" required />
        </div>
        <p v-if="errorMessage" class="font-bold">{{ errorMessage }}</p>
        <button class="mx-auto mt-2 block" type="submit">Log In</button>
      </form>
    </main>
  </div>
</template>

<style scoped></style>

<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';

const username = defineModel<string>('username');
const password = defineModel<string>('password');
const errorMessage = ref<string | null>(null);

const authStore = useAuthStore();
const { needsAuthentication } = storeToRefs(authStore);

const dialog = ref<HTMLDialogElement | null>(null);

async function onSubmitForm() {
  try {
    await authStore.attemptLogIn(
      username.value as string,
      password.value as string,
    );
    errorMessage.value = null;
    needsAuthentication.value = false;
    dialog.value?.close();
  } catch (err) {
    if (err instanceof Error) {
      errorMessage.value = err.message;
    } else {
      errorMessage.value = 'Unknown error';
    }
  }
}

watch(
  needsAuthentication,
  () => {
    if (needsAuthentication.value && dialog.value !== null) {
      dialog.value.showModal();
    }
  },
  { immediate: true },
);
</script>
<template>
  <dialog ref="dialog" class="mx-auto mt-24 w-full max-w-md bg-primary p-8">
    <form
      class="flex flex-col items-center gap-4"
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
  </dialog>
</template>

<style scoped></style>

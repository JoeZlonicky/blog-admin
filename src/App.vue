<script setup lang="ts">
import LogInModal from './components/LogInModal.vue';
import NavBar from './components/NavBar.vue';
import { useAuthStore } from './stores/useAuthStore';
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';

const authStore = useAuthStore();

onMounted(async () => {
  authStore.checkLocalStorage();
});
</script>

<template>
  <NavBar />
  <LogInModal />
  <RouterView />
</template>

<style scoped></style>

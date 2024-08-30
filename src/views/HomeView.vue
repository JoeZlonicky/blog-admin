<script setup lang="ts">
import { getPosts } from '@/api/getPosts';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Post } from '@/types/Post';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';

const posts = ref<Post[]>([]);
const authStore = useAuthStore();
const { token: authToken } = storeToRefs(authStore);

async function refreshPosts() {
  authStore.callWithAuthentication(async () => {
    posts.value = await getPosts(authToken.value);
  });
}

refreshPosts();

watch(authToken, async () => {
  refreshPosts();
});
</script>

<template>
  <main>
    {{ posts.length }}
  </main>
</template>

<script setup lang="ts">
import { getPosts } from '@/api/getPosts';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Post } from '@/types/Post';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { RouterLink } from 'vue-router';

const posts = ref<Post[]>([]);
const authStore = useAuthStore();
const { token: authToken, authorName } = storeToRefs(authStore);

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
  <main class="px-8 py-4">
    <p v-if="authorName" class="mb-4 mt-2 text-2xl">
      Welcome, {{ authorName }}!
    </p>
    <RouterLink to="/new-post" custom #="{ navigate }"
      ><button class="mb-4" @click="navigate">New Post</button></RouterLink
    >

    <h1 class="mb-2 text-accent">Posts</h1>
    <table class="block w-full border-collapse overflow-x-auto">
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Published?</th>
          <th title="(Approved / Total)">#&nbsp;Comments</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="post in posts"
          :key="post.id"
          class="cursor-pointer hover:bg-primary"
          title="Open"
        >
          <td>{{ post.title }}</td>
          <td>{{ post.author.firstName }} {{ post.author.lastName }}</td>
          <td>{{ post.published ? 'Yes' : '' }}</td>
          <td title="(Approved / Total)">
            {{ post.comments.length }} / {{ post.comments.length }}
          </td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<style scoped lang="postcss">
td,
th {
  @apply border-2 border-primary;
}

td,
th {
  @apply p-2 text-left;

  &:first-child {
    @apply w-3/5 max-w-64 overflow-hidden overflow-ellipsis whitespace-nowrap;
  }
}
</style>

<script setup lang="ts">
import { createPost } from '@/api/createPost';
import { getAuthorsPosts } from '@/api/getAuthorsPosts';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Post } from '@/types/Post';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

const router = useRouter();
const posts = ref<Post[]>([]);
const authStore = useAuthStore();
const { token: authToken, authorId, authorName } = storeToRefs(authStore);

async function refreshPosts() {
  authStore.callWithAuthentication(async () => {
    posts.value = await getAuthorsPosts(authToken.value, authorId.value);
  });
}

async function createNewPost() {
  authStore.callWithAuthentication(async () => {
    try {
      const newPost = await createPost(authToken.value, authorId.value);
      router.push(`/edit-post/${newPost.id}`);
    } catch (err) {
      console.log(err);
    }
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
    <button class="mb-4" @click="createNewPost">New Post</button>

    <h1 class="mb-2 text-accent">Your Posts</h1>
    <table class="block w-full border-collapse overflow-x-auto">
      <thead>
        <tr>
          <th>Title</th>
          <th>Published</th>
          <th title="(Approved / Total)">#&nbsp;Comments</th>
        </tr>
      </thead>
      <tbody>
        <RouterLink
          v-for="post in posts"
          :key="post.id"
          :to="`post/${post.id.toString()}`"
          custom
          #="{ navigate }"
        >
          <tr
            class="cursor-pointer hover:bg-primary"
            title="Open"
            @click="navigate"
          >
            <td>{{ post.title }}</td>
            <td>{{ post.published ? 'Yes' : '' }}</td>
            <td title="(Approved / Total)">
              {{ post.comments.length }} / {{ post.comments.length }}
            </td>
          </tr>
        </RouterLink>
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

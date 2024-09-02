<script setup lang="ts">
import { createPost } from '@/api/createPost';
import { getAuthorsPosts } from '@/api/getAuthorsPosts';
import APICallButton from '@/components/APICallButton.vue';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Post } from '@/types/Post';
import { format } from 'date-fns';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

const router = useRouter();
const posts = ref<Post[]>([]);
const authStore = useAuthStore();
const { authorId, authorName } = storeToRefs(authStore);

async function refreshPosts() {
  posts.value = [];
  await authStore.callWithAuthentication(async (authToken) => {
    try {
      posts.value = await getAuthorsPosts(authToken, authorId.value);
    } catch (err) {
      return;
    }
  });
}

async function createNewPost() {
  await authStore.callWithAuthentication(async (authToken) => {
    try {
      const newPost = await createPost(authToken, authorId.value);
      router.push(`/edit-post/${newPost.id}`);
    } catch (err) {
      return;
    }
  });
}

function formatPublishedAt(date: Date): string {
  return format(date, 'MMM. do, yyyy');
}

refreshPosts();

watch(authorId, async () => {
  refreshPosts();
});
</script>

<template>
  <main class="px-8 py-4">
    <p v-if="authorName" class="mb-4 mt-2 text-2xl">
      Welcome, {{ authorName }}!
    </p>
    <APICallButton class="mb-4" :api-call="createNewPost">
      New Post
    </APICallButton>

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
            <td>
              {{ post.publishedAt && formatPublishedAt(post.publishedAt) }}
            </td>
            <td title="(Approved / Total)">
              {{ post.comments.filter((comment) => comment.approvedAt).length }}
              / {{ post.comments.length }}
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

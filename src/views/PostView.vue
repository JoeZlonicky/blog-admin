<script setup lang="ts">
import { getPost } from '@/api/getPost';
import PostComment from '@/components/PostComment.vue';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Post } from '@/types/Post';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const post = ref<Post | undefined>(undefined);
const authStore = useAuthStore();
const { token: authToken } = storeToRefs(authStore);

const isFetching = ref(false);
const didLastFetchSucceed = ref(false);

async function updatePost() {
  const postId = parseInt(route.params.postId as string);
  authStore.callWithAuthentication(async () => {
    try {
      isFetching.value = true;
      post.value = await getPost(authToken.value, postId);
      didLastFetchSucceed.value = true;
    } catch (err) {
      didLastFetchSucceed.value = false;
    } finally {
      isFetching.value = false;
    }
  });
}

function edit() {
  if (post.value) {
    router.push(`/edit-post/${post.value.id}`);
  }
}

onMounted(async () => updatePost());

watch(
  () => route.params.postId,
  async () => updatePost(),
);
</script>

<template>
  <div class="mx-auto max-w-4xl px-4">
    <main
      class="my-8 flex min-h-32 flex-col items-center bg-primary px-4 pt-0 shadow-md"
    >
      <p v-if="isFetching" class="my-auto">Loading post...</p>
      <p v-else-if="!didLastFetchSucceed" class="my-auto">
        Failed to load post.
      </p>
      <template v-else-if="post">
        <h1 class="pt-8 capitalize">{{ post?.title }}</h1>
        <div class="mb-8 mt-2 max-w-3xl whitespace-pre-wrap text-left text-lg">
          {{ post?.content }}
        </div>
      </template>
    </main>

    <template v-if="post">
      <span class="mx-auto mb-4 flex w-fit gap-2">
        <button>Delete</button>
        <button @click="edit">Edit</button>
        <button v-if="post.published">Unpublish</button>
        <button v-else>Publish</button>
      </span>

      <h2 class="mb-4 text-center text-3xl">Comments</h2>
      <p v-if="post.comments.length === 0" class="text-center">
        No comments so far!
      </p>
      <div v-else class="mx-auto flex max-w-2xl flex-col gap-2">
        <PostComment
          v-for="comment in post.comments"
          :key="comment.id"
          :comment
        />
      </div>
    </template>
  </div>
</template>

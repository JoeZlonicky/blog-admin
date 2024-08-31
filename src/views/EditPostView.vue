<script setup lang="ts">
import { getPost } from '@/api/getPost';
import PostComment from '@/components/PostComment.vue';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Post } from '@/types/Post';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const post = ref<Post | undefined>(undefined);
const currentContent = defineModel<string>('currentContent');

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
      if (post.value.content) {
        currentContent.value = post.value.content;
      }
      didLastFetchSucceed.value = true;
    } catch (err) {
      didLastFetchSucceed.value = false;
    } finally {
      isFetching.value = false;
    }
  });
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
        <input class="mt-8 capitalize" :value="post?.title" />
        <div class="mb-8 mt-2 max-w-3xl whitespace-pre-wrap text-left text-lg">
          <textarea v-model="currentContent"></textarea>
        </div>
      </template>
    </main>
  </div>
</template>

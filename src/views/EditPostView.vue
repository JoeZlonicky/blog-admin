<script setup lang="ts">
import { getPost } from '@/api/getPost';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Post } from '@/types/Post';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const post = ref<Post | undefined>(undefined);
const currentTitle = defineModel<string>('currentTitle');
const currentContent = defineModel<string>('currentContent');

const authStore = useAuthStore();

const isFetching = ref(false);
const didLastFetchSucceed = ref(false);

async function updatePost() {
  const postId = parseInt(route.params.postId as string);
  authStore.callWithAuthentication(async (authToken) => {
    try {
      isFetching.value = true;
      post.value = await getPost(authToken, postId);
      currentTitle.value = post.value.title;
      currentContent.value = post.value.content;
      didLastFetchSucceed.value = true;
    } catch (err) {
      didLastFetchSucceed.value = false;
    } finally {
      isFetching.value = false;
    }
  });
}

function discard() {
  if (post.value) {
    currentTitle.value = post.value.title;
    currentContent.value = post.value.content;
  }
}

function save() {
  if (post.value) {
    router.push(`/post/${post.value.id}`);
  }
}

onMounted(async () => updatePost());

watch(
  () => route.params.postId,
  async () => updatePost(),
);
</script>

<template>
  <div class="px-8 py-4">
    <p v-if="isFetching" class="my-auto">Loading post...</p>
    <p v-else-if="!didLastFetchSucceed" class="my-auto">Failed to load post.</p>
    <template v-else-if="post">
      <h1 class>Edit Post</h1>

      <label class="block">Title:</label>
      <input v-model="currentTitle" class="capitalize" />
      <div class="mb-8 mt-2 max-w-3xl whitespace-pre-wrap text-left text-lg">
        <textarea v-model="currentContent"></textarea>
      </div>

      <span class="mx-auto mb-4 flex w-fit gap-2">
        <button @click="discard">Discard Changes</button>
        <button @click="save">Save Changes</button>
      </span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { getPost } from '@/api/getPost';
import { updatePostTitleAndContent } from '@/api/updatePostTitleAndContent';
import APICallButton from '@/components/APICallButton.vue';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Post } from '@/types/Post';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const post = ref<Post | undefined>(undefined);
const currentTitle = defineModel<string>('currentTitle');
const currentContent = defineModel<string>('currentContent');
const currentContextTextArea = ref<HTMLTextAreaElement | null>(null);

const authStore = useAuthStore();

const isFetching = ref(false);
const didLastFetchSucceed = ref(false);

async function updatePost() {
  const postId = parseInt(route.params.postId as string);
  isFetching.value = true;
  try {
    await authStore.callWithAuthentication(async (authToken) => {
      post.value = await getPost(authToken, postId);
      currentTitle.value = post.value.title;
      currentContent.value = post.value.content;

      didLastFetchSucceed.value = true;
    });
  } catch (err) {
    didLastFetchSucceed.value = false;
  } finally {
    isFetching.value = false;
  }
}

function discard() {
  const confirm = window.confirm(
    'Are you sure you would like to discard your changes?',
  );
  if (!confirm) {
    return;
  }
  if (post.value) {
    router.push(`/post/${post.value.id}`);
  }
}

async function save() {
  try {
    await authStore.callWithAuthentication(async (authToken) => {
      if (
        post.value &&
        currentTitle.value &&
        currentContent.value !== undefined
      ) {
        await updatePostTitleAndContent(
          authToken,
          post.value.id,
          currentTitle.value,
          currentContent.value,
        );
        router.push(`/post/${post.value.id}`);
      }
    });
  } catch (err) {
    return;
  }
}

function updateTextAreaHeight() {
  if (currentContextTextArea.value) {
    currentContextTextArea.value.style.height = `${currentContextTextArea.value.scrollHeight}px`;
  }
}

onMounted(async () => {
  await updatePost();
  updateTextAreaHeight();
});

watch(
  () => route.params.postId,
  async () => {
    await updatePost();
    updateTextAreaHeight();
  },
);
</script>

<template>
  <div class="px-8 py-4">
    <p v-if="isFetching" class="my-auto">Loading post...</p>
    <p v-else-if="!didLastFetchSucceed" class="my-auto">Failed to load post.</p>
    <template v-else-if="post">
      <h1 class="mb-4 text-accent">Edit Post</h1>

      <label class="block text-xl">Title:</label>
      <input v-model="currentTitle" class="capitalize" />
      <div class="mb-8 mt-2 max-w-3xl text-left text-lg">
        <label class="block text-xl">Content:</label>
        <textarea
          ref="currentContextTextArea"
          v-model="currentContent"
          class="w-full resize whitespace-pre-wrap"
        ></textarea>
      </div>

      <span class="mb-4 flex w-fit gap-2">
        <button class="negative" @click="discard">Discard Changes</button>
        <APICallButton :api-call="save">Save Changes</APICallButton>
      </span>
    </template>
  </div>
</template>

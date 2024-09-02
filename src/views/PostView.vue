<script setup lang="ts">
import { deletePost } from '@/api/deletePost';
import { getPost } from '@/api/getPost';
import { updatePostPublished } from '@/api/updatePostPublished';
import APICallButton from '@/components/APICallButton.vue';
import PostComment from '@/components/PostComment.vue';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Comment } from '@/types/Comment';
import type { Post } from '@/types/Post';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const post = ref<Post | undefined>(undefined);
const authStore = useAuthStore();

const isFetching = ref(false);
const didLastFetchSucceed = ref(false);

async function updatePost() {
  const postId = parseInt(route.params.postId as string);
  isFetching.value = true;
  try {
    await authStore.callWithAuthentication(async (authToken) => {
      post.value = await getPost(authToken, postId);
      didLastFetchSucceed.value = true;
    });
  } catch (err) {
    didLastFetchSucceed.value = false;
  } finally {
    isFetching.value = false;
  }
}

async function deletePostAndReturnHome() {
  const confirm = window.confirm(
    'Are you sure you would like to delete this post?',
  );
  if (!confirm) {
    return;
  }

  try {
    await authStore.callWithAuthentication(async (authToken) => {
      if (!post.value) return;

      await deletePost(authToken, post.value.id);
      router.push(`/`);
    });
  } catch (err) {
    return;
  }
}

async function setPostPublished(isPublished: boolean) {
  try {
    await authStore.callWithAuthentication(async (authToken) => {
      if (!post.value) return;

      post.value = await updatePostPublished(
        authToken,
        post.value.id,
        isPublished,
      );
    });
  } catch (err) {
    console.error(err);
    return;
  }
}

async function publish() {
  const confirm = window.confirm(
    'Are you sure you would like to publish this post?',
  );
  if (!confirm) {
    return;
  }
  await setPostPublished(true);
}

async function unpublish() {
  const confirm = window.confirm(
    'Are you sure you would like to unpublish this post?',
  );
  if (!confirm) {
    return;
  }
  await setPostPublished(false);
}

function editPost() {
  if (post.value) {
    router.push(`/edit-post/${post.value.id}`);
  }
}

function commentApproved(newComment: Comment) {
  if (!post.value) return;

  const index = post.value.comments.findIndex(
    (comment) => comment.id === newComment.id,
  );
  post.value.comments.splice(index, 1, newComment);
}

function commentDeleted(id: number) {
  if (!post.value) return;

  const index = post.value.comments.findIndex((comment) => comment.id === id);
  post.value.comments.splice(index, 1);
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
        <APICallButton :api-call="deletePostAndReturnHome" class="negative"
          >Delete</APICallButton
        >
        <button @click="editPost">Edit</button>
        <APICallButton v-if="post.publishedAt" :api-call="unpublish">
          Unpublish
        </APICallButton>
        <APICallButton v-else :api-call="publish">Publish</APICallButton>
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
          @approved="commentApproved"
          @deleted="() => commentDeleted(comment.id)"
        />
      </div>
    </template>
  </div>
</template>

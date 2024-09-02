<script setup lang="ts">
import APICallButton from './APICallButton.vue';
import NameAndDate from './NameAndDate.vue';
import { deleteComment } from '@/api/deleteComment';
import { updateCommentApproved } from '@/api/updateCommentApproved';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Comment } from '@/types/Comment';

const props = defineProps<{
  comment: Comment;
}>();

const emit = defineEmits<{
  approved: [newComment: Comment];
  deleted: [];
}>();

const authStore = useAuthStore();

async function remove() {
  const confirm = window.confirm(
    'Are you sure you would like to remove this comment?',
  );
  if (!confirm) {
    return;
  }

  try {
    await authStore.callWithAuthentication(async (authToken) => {
      await deleteComment(authToken, props.comment.id);
      emit('deleted');
    });
  } catch (err) {
    return;
  }
}

async function approve() {
  try {
    await authStore.callWithAuthentication(async (authToken) => {
      const newComment = await updateCommentApproved(
        authToken,
        props.comment.id,
        true,
      );
      emit('approved', newComment);
    });
  } catch (err) {
    return;
  }
}
</script>
<template>
  <div class="bg-primary px-4 py-4 shadow-md">
    <div class="mb-1">
      <NameAndDate
        :name="comment.firstName + comment.lastInitial"
        :date="comment.createdAt"
      />
    </div>
    <div class="text-lg">{{ comment.content }}</div>
    <div class="mt-2 flex gap-2">
      <APICallButton :api-call="remove" class="negative py-1"
        >Remove</APICallButton
      >
      <APICallButton v-if="!comment.approvedAt" :api-call="approve" class="py-1"
        >Approve</APICallButton
      >
    </div>
  </div>
</template>

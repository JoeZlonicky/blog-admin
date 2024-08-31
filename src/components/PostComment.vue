<script setup lang="ts">
import NameAndDate from './NameAndDate.vue';
import type { Comment } from '@/types/Comment';

defineProps<{
  comment: Comment;
}>();
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
  </div>
</template>

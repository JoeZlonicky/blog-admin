<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  apiCall: () => Promise<void>;
}>();

const isCalling = ref(false);

async function callWhileDisabled() {
  isCalling.value = true;
  await props.apiCall();
  isCalling.value = false;
}
</script>

<template>
  <button ref="button" :disabled="isCalling" @click="callWhileDisabled">
    <slot></slot>
  </button>
</template>

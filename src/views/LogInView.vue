<script setup lang="ts"></script>

<template>
  <div class="px-5">
    <main class="bg-primary mx-auto mt-8 max-w-lg p-8">
      <form class="flex flex-col items-center gap-4">
        <h1 class="text-accent text-center font-bold">Log In</h1>

        <div class="flex w-full max-w-80 flex-col gap-1">
          <label for="username">Username:</label>
          <input id="username" name="username" />
        </div>

        <div class="flex w-full max-w-80 flex-col gap-1">
          <label for="password">Password:</label>
          <input id="password" name="password" type="password" />
        </div>
        <button class="mx-auto mt-2 block" type="submit">Log In</button>
      </form>
    </main>
  </div>
</template>

<style scoped></style>

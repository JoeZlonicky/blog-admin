<script setup lang="ts"></script>
<template>
  <header class="bg-primary text-3xl">
    <div v-if="$route.fullPath === '/'" class="px-8 py-4">
      <span class="text-accent font-bold">TheBlog&nbsp;Admin</span
      ><span class="text-lg"> By&nbsp;Joe&nbsp;Zlonicky</span>
    </div>
    <nav v-else>
      <RouterLink
        to="/"
        class="hover:bg-primary-highlight text-accent block px-8 py-4 font-bold"
      >
        &larr; Dashboard
      </RouterLink>
    </nav>
  </header>
</template>

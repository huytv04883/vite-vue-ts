<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
defineOptions({
  name: 'Home-page',
});
</script>

<template>
  <h1>Welcome to the Home Page</h1>
  <button @click="router.push('/register')">Start</button>
</template>


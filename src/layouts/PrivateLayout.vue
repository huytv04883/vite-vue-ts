<script setup lang="ts">
import AppHeader from '@/components/common/Header.vue';

defineOptions({
  name: 'PrivateLayout',
});
</script>

<template>
  <AppHeader />
  <main>
    <slot />
  </main>
</template>

<script setup lang="ts">
import AppHeader from '@/components/common/Header.vue';

defineOptions({
  name: 'PrivateLayout',
});
</script>

<template>
  <div class="private-layout">
    <AppHeader />
    <slot />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/common/Header.vue';

defineOptions({
  name: 'PrivateLayout',
});
</script>

<template>
  <div class="private-layout">
    <AppHeader />
    <div class="private-layout__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/common/Header.vue';
import CreateGroupPopover from '@/components/modules/popovers/CreateGroupPopover.vue';

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
    <CreateGroupPopover />
  </div>
</template>

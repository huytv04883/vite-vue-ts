<script setup lang="ts">
import ChatHeader from '@/components/modules/conversation/ChatHeader.vue';

defineOptions({
  name: 'ChatLayout',
});
</script>

<template>
  <div class="private-layout">
    <ChatHeader />
    <div class="private-layout__content">
      <slot />
    </div>
  </div>
</template>

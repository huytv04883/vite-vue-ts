<script setup lang="ts">
import ChatHeader from '@/components/conversation/ChatHeader.vue';
import CreateGroupPopover from '@/components/CreateGroupPopover.vue';

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
    <CreateGroupPopover />
  </div>
</template>

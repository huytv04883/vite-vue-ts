<script setup lang="ts">
import ChatInput from '@/components/ChatInput.vue';
import { ref } from 'vue';

const isOtherTyping = ref(false);

defineOptions({
  name: 'ChatGroupDetail',
});
const handleTypingUpdate = (isTyping: boolean) => {
  isOtherTyping.value = isTyping;
};
</script>
<template>
  <div class="conversation-detail">
    <div class="message-list empty">
      <p class="no-message">No messages yet. Start the conversation!</p>
    </div>
    <ChatInput @update:set-other-typing="handleTypingUpdate" />
  </div>
</template>

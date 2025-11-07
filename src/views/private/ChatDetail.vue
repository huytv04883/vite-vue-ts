<script setup lang="ts">
import ChatInput from '@/components/ChatInput.vue';
import MessageItem from '@/components/Conversation/MessageItem.vue';
import { listenMessages } from '@/services/chatService';
import { useChatStore } from '@/store/useChatStore';
import { Message } from '@/types/message.type';
import { onMounted, ref } from 'vue';

const msgs = ref<Message[]>([]);
const chatStore = useChatStore();

defineOptions({
  name: 'ChatDetail',
});

onMounted(async () => {
  await listenMessages(chatStore.roomChatId as string, (messages) => {
    msgs.value = messages;
  });
});
</script>

<template>
  <div class="conversation-detail">
    <div class="message-list">
      <MessageItem v-for="message in msgs" :key="message.id" :message="message" />
    </div>
    <ChatInput />
  </div>
</template>

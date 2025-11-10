<script setup lang="ts">
import ChatInput from '@/components/ChatInput.vue';
import MessageItem from '@/components/conversation/MessageItem.vue';
import { getRecentMessages, listenMessages } from '@/services/chatService';
import { useChatStore } from '@/store/useChatStore';
import { Message } from '@/types/message.type';
import { nextTick, onMounted, ref } from 'vue';

const msgs = ref<Message[]>([]);
const isOtherTyping = ref(false);
const chatStore = useChatStore();
const messageListRef = ref<HTMLDivElement | null>(null);
const isFirstLoad = ref(true);

defineOptions({
  name: 'ChatDetail',
});

const scrollToBottom = async () => {
  await nextTick();
  console.log('run');

  const el = messageListRef.value;
  if (el) {
    el.scrollTo({
      top: el.scrollHeight,
      behavior: 'smooth',
    });
  }
};

onMounted(async () => {
  const { messages: recent, lastDoc: lastDoc } = await getRecentMessages(
    chatStore.roomChatId as string,
  );
  msgs.value = recent;
  if (isFirstLoad.value) {
    scrollToBottom();
    isFirstLoad.value = false;
  }
  listenMessages(chatStore.roomChatId as string, lastDoc, async (messages) => {
    msgs.value.push(...messages);
    scrollToBottom();
  });
});

const handleTypingUpdate = (isTyping: boolean) => {
  isOtherTyping.value = isTyping;
};
</script>

<template>
  <div class="conversation-detail">
    <div v-if="msgs.length > 0" ref="messageListRef" class="message-list" v-infinite-scroll="">
      <MessageItem v-for="message in msgs" :key="message.id" :message="message" />
      <p v-if="isOtherTyping" class="typing">
        {{ chatStore.targetUser?.displayName }} is typing...
      </p>
    </div>
    <div v-else class="message-list empty">
      <p class="no-message">No messages yet. Start the conversation!</p>
    </div>
    <ChatInput @update:set-other-typing="handleTypingUpdate" />
  </div>
</template>

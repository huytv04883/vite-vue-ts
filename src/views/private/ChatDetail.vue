<script setup lang="ts">
import ChatInput from '@/components/ChatInput.vue';
import MessageItem from '@/components/conversation/MessageItem.vue';
import { getOlderMessages, getRecentMessages, listenMessages } from '@/services/chatService';
import { useChatStore } from '@/store/useChatStore';
import { Message } from '@/types/message.type';
import { nextTick, onMounted, ref } from 'vue';

const msgs = ref<Message[]>([]);
const isOtherTyping = ref(false);
const chatStore = useChatStore();
const messageListRef = ref<HTMLDivElement | null>(null);
const isFirstLoad = ref(true);
const firstVisibleDoc = ref<unknown>(null);

defineOptions({
  name: 'ChatDetail',
});

const scrollToBottom = async () => {
  await nextTick();
  const el = messageListRef.value;
  if (el) {
    el.scrollTo({
      top: el.scrollHeight,
      behavior: 'smooth',
    });
  }
};

const handleScroll = async () => {
  if (!messageListRef.value) return;
  if (messageListRef.value.scrollTop === 0 && firstVisibleDoc.value) {
    const prevHeight = messageListRef.value.scrollHeight;

    const { messages: olderMessages, lastDoc } = await getOlderMessages(
      chatStore.roomChatId as string,
      firstVisibleDoc.value,
    );
    msgs.value.unshift(...(olderMessages as Message[]));
    firstVisibleDoc.value = lastDoc; // Update to the new oldest doc
    await nextTick();
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight - prevHeight;
  }
};

onMounted(async () => {
  const {
    messages: recent,
    firstDoc,
    lastDoc,
  } = await getRecentMessages(chatStore.roomChatId as string);
  msgs.value = [...recent];

  firstVisibleDoc.value = firstDoc;
  if (isFirstLoad.value) {
    scrollToBottom();
    isFirstLoad.value = false;
  }

  listenMessages(chatStore.roomChatId as string, lastDoc, async (messages) => {
    const existingIds = new Set(msgs.value.map((msg) => msg.id));
    const newMessages = messages.filter((msg) => !existingIds.has(msg.id));
    msgs.value = [...msgs.value, ...newMessages];
    scrollToBottom();
  });
});

const handleTypingUpdate = (isTyping: boolean) => {
  isOtherTyping.value = isTyping;
};
</script>
<template>
  <div class="conversation-detail">
    <div
      v-if="msgs.length > 0"
      ref="messageListRef"
      class="message-list"
      @scroll.passive="handleScroll"
    >
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

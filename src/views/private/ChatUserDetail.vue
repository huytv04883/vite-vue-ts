<script setup lang="ts">
import MessageItem from '@/components/modules/conversation/MessageItem.vue';
import ChatInput from '@/components/ui/ChatInput.vue';
import ImageSending from '@/components/ui/ImageSending.vue';
import { scrollToBottom } from '@/helper/common';
import { getDataUser } from '@/helper/storage';
import {
  CHAT_TYPE,
  getOlderMessages,
  getRecentMessages,
  listenMessages,
} from '@/services/baseService';
import { sendMessage } from '@/services/chatService';
import { handleUploadImageToCloudinary } from '@/services/uploadService';
import { CHAT_ACTION, useChatStore } from '@/store/useChatStore';
import { Message } from '@/types/message.type';
import { ElMessage } from 'element-plus';
import { nextTick, onMounted, ref } from 'vue';

const msgs = ref<Message[]>([]);
const isOtherTyping = ref(false);
const isSendingMsg = ref(false);
const chatStore = useChatStore();
const messageListRef = ref<HTMLDivElement | null>(null);
const firstVisibleDoc = ref<unknown>(null);
const loading = ref(false);
const user = getDataUser();

defineOptions({
  name: 'ChatUserDetail',
});

const handleScroll = async () => {
  loading.value = true;
  try {
    if (!messageListRef.value) return;
    if (messageListRef.value.scrollTop === 0 && firstVisibleDoc.value) {
      const prevHeight = messageListRef.value.scrollHeight;

      const { messages: olderMessages, lastDoc } = await getOlderMessages(
        chatStore.roomChatId as string,
        firstVisibleDoc.value,
        CHAT_TYPE.chats,
      );
      msgs.value.unshift(...(olderMessages as Message[]));
      firstVisibleDoc.value = lastDoc; // Update to the new oldest doc
      await nextTick();
      messageListRef.value.scrollTop = messageListRef.value.scrollHeight - prevHeight;
    }
  } catch (error) {
    const msg = (error as { message?: string })?.message ?? 'Failed to load older messages';
    ElMessage({ message: msg, type: 'error', plain: true });
  } finally {
    loading.value = false;
  }
};

const onSendMessage = async (value: string, typeMessage: 'text' | 'image') => {
  await sendMessage(
    chatStore.roomChatId as string,
    user?.user?.uid as string,
    value,
    typeMessage,
  ).then(() => {
    chatStore.setChatAction(CHAT_ACTION.SEND_MESSAGE);
  });
};

const handleSendMessage = async (value: string | File, type: { type: string }) => {
  try {
    if (type.type === 'image' && typeof value !== 'string') {
      isSendingMsg.value = true;
      scrollToBottom(messageListRef);
      await handleUploadImageToCloudinary(value as File).then(async (url) => {
        if (!url) return;
        onSendMessage(url, 'image');
      });
    } else {
      if (typeof value === 'string' && !value.trim()) return;
      await sendMessage(
        chatStore.roomChatId as string,
        user?.user?.uid as string,
        value as string,
        'text',
      ).then(() => {
        chatStore.setChatAction(CHAT_ACTION.SEND_MESSAGE);
      });
    }
  } catch (error) {
    const msg = (error as { message?: string })?.message ?? 'Failed to send message';
    ElMessage({ message: msg, type: 'error', plain: true });
  } finally {
    isSendingMsg.value = false;
  }
};

const fetchInitialMessages = async () => {
  loading.value = true;
  try {
    const { messages: recent, firstDoc } = await getRecentMessages(
      chatStore.roomChatId as string,
      CHAT_TYPE.chats,
    );
    msgs.value = [...recent];

    firstVisibleDoc.value = firstDoc;

    listenMessages(
      chatStore.roomChatId as string,
      async (messages) => {
        const existingMsgIndex = msgs.value.findIndex((msg) => msg.id === messages[0].id);
        if (existingMsgIndex !== -1) {
          msgs.value[existingMsgIndex] = messages[0];
        } else {
          msgs.value.push(messages[0]);
          scrollToBottom(messageListRef);
        }
      },
      CHAT_TYPE.chats,
    );
  } catch (error) {
    const msg = (error as { message?: string })?.message ?? 'Failed to fetch messages';
    ElMessage({ message: msg, type: 'error', plain: true });
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchInitialMessages();
});

const handleTypingUpdate = (isTyping: boolean) => {
  isOtherTyping.value = isTyping;
};
</script>
<template>
  <div class="conversation-detail">
    <div
      ref="messageListRef"
      :class="'message-list' + (msgs.length === 0 ? ' empty' : '')"
      @scroll.passive="handleScroll"
      v-loading="loading"
    >
      <template v-if="msgs.length > 0">
        <MessageItem v-for="message in msgs" :key="message.id" :message="message" />
        <div class="chat-message chat-message--own" v-if="isSendingMsg">
          <ImageSending :imageUrl="''" :isSending="isSendingMsg" />
        </div>
      </template>
      <p v-else class="no-message">No messages yet. Start the conversation!</p>
      <p v-if="isOtherTyping" class="typing">
        {{ chatStore.targetUser?.displayName }} is typing...
      </p>
    </div>
    <ChatInput
      @update:set-other-typing="handleTypingUpdate"
      @send-message="(value, type) => handleSendMessage(value, type)"
      :sending="isSendingMsg"
    />
  </div>
</template>

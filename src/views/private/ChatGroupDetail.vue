<script setup lang="ts">
import ChatInput from '@/components/ChatInput.vue';
import MessageItem from '@/components/conversation/MessageItem.vue';
import { scrollToBottom } from '@/helper/common';
import { getDataUser } from '@/helper/storage';
import {
  getOlderMessages,
  getRecentMessages,
  listenMessages,
  sendMessage,
} from '@/services/groupChatService';
import { useChatStore } from '@/store/useChatStore';
import { Message } from '@/types/message.type';
import { ElMessage } from 'element-plus';
import { computed, nextTick, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const chatStore = useChatStore();
const isOtherTyping = ref(false);
const user = getDataUser();
const msgs = ref<Message[]>([]);
const loading = ref(false);
const firstVisibleDoc = ref<unknown>(null);
const messageListRef = ref<HTMLDivElement | null>(null);
const router = useRouter();
const groupId = computed(() => router?.currentRoute.value.params.id);

defineOptions({
  name: 'ChatGroupDetail',
});
const handleTypingUpdate = (isTyping: boolean) => {
  isOtherTyping.value = isTyping;
};

const handleScroll = async () => {
  loading.value = true;
  try {
    if (!messageListRef.value) return;
    if (messageListRef.value.scrollTop === 0 && firstVisibleDoc.value) {
      const prevHeight = messageListRef.value.scrollHeight;

      const { messages: olderMessages, lastDoc } = await getOlderMessages(
        groupId.value as string,
        firstVisibleDoc.value,
      );
      msgs.value.unshift(...(olderMessages as Message[]));
      firstVisibleDoc.value = lastDoc;
      await nextTick();
      messageListRef.value.scrollTop = messageListRef.value.scrollHeight - prevHeight;
    }
  } catch (error) {
    const msg = (error as { message?: string })?.message ?? 'An error occurred';
    ElMessage({ message: msg, type: 'error', plain: true });
  } finally {
    loading.value = false;
  }
};

const handleSendMessage = async (val: string) => {
  try {
    if (!val.trim()) return;
    await sendMessage(
      groupId.value as string,
      user?.user?.uid as string,
      val,
      user?.user?.photoURL ?? '',
    ).then(() => {
      chatStore.setChatAction('SEND_MESSAGE');
    });
    return;
  } catch (error) {
    const msg = (error as { message?: string })?.message ?? 'An error occurred';
    ElMessage({ message: msg, type: 'error', plain: true });
  }
};

const fetchInitialMessages = async () => {
  loading.value = true;
  try {
    const { messages: recent, firstDoc } = await getRecentMessages(groupId.value as string);

    msgs.value = [...recent];

    firstVisibleDoc.value = firstDoc;

    listenMessages(groupId.value as string, async (messages) => {
      const existingMsgIndex = msgs.value.findIndex((msg) => msg.id === messages[0].id);
      if (existingMsgIndex !== -1) {
        msgs.value[existingMsgIndex] = messages[0];
      } else {
        msgs.value.push(messages[0]);
        scrollToBottom(messageListRef);
      }
    });
  } catch (error) {
    const msg = (error as { message?: string })?.message ?? 'An error occurred';
    ElMessage({ message: msg, type: 'error', plain: true });
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchInitialMessages();
});
</script>
<template>
  <div class="conversation-detail">
    <div
      ref="messageListRef"
      :class="'message-list' + (msgs.length === 0 ? ' empty' : '')"
      v-loading="loading"
      @scroll.passive="handleScroll"
    >
      <template v-if="msgs.length > 0">
        <MessageItem v-for="message in msgs" :key="message.id" :message="message" />
      </template>
      <p v-else class="no-message">No messages yet. Start the conversation!</p>
    </div>
    <ChatInput
      @update:set-other-typing="handleTypingUpdate"
      @send-message="(val) => handleSendMessage(val)"
    />
  </div>
</template>

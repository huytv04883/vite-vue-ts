<template>
  <el-space :size="12" class="send-box">
    <div class="send-box__left">
      <el-button :icon="DocumentCopy" circle plain title="Attach file" />
    </div>
    <div class="send-box__right">
      <input
        v-model="message"
        :placeholder="placeholder"
        clearable
        @keydown.enter="handleSend"
        @keydown="handleTyping"
      />
      <el-button
        :icon="Send"
        circle
        @click="handleSend"
        :disabled="!message.trim()"
        type="primary"
        title="Send message"
      />
    </div>
  </el-space>
</template>

<script setup lang="ts">
import { getDataUser } from '@/helper/storage';
import { listenTypingStatus, sendMessage, setTypingStatus } from '@/services/chatService';
import { useChatStore } from '@/store/useChatStore';
import { DocumentCopy, Right as Send } from '@element-plus/icons-vue';
import { onMounted, onUnmounted, ref } from 'vue';
const chatStore = useChatStore();
const user = getDataUser();
let unsubscribe: (() => void) | null = null;
let typingTimeout: number;

const message = ref<string>('');
const placeholder = ref<string>('Write your message...');
defineOptions({
  name: 'ChatInput',
});

const emit = defineEmits(['update:setOtherTyping']);

const handleTyping = () => {
  clearTimeout(typingTimeout);
  console.log("runing......");
  
  setTypingStatus(chatStore.roomChatId as string, user?.user?.uid as string, true);
  typingTimeout = setTimeout(() => {
    setTypingStatus(chatStore.roomChatId as string, user?.user?.uid as string, false);
  }, 2000);
};

onMounted(() => {
  unsubscribe = listenTypingStatus(
    chatStore.roomChatId as string,
    chatStore.targetUser?.uid as string,
    (isTyping: boolean) => {
      console.log(isTyping);
      
      emit('update:setOtherTyping', isTyping);
    },
  );
});

onUnmounted(() => unsubscribe && unsubscribe());

const handleSend = async (): Promise<void> => {
  sendMessage(
    chatStore.roomChatId as string,
    chatStore.targetUser?.uid as string,
    message.value.trim(),
  );

  message.value = '';
};
</script>

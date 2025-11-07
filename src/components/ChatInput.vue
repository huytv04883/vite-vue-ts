<template>
  <el-space :size="12" class="send-box">
    <div class="send-box__left">
      <el-button :icon="DocumentCopy" circle plain title="Attach file" />
    </div>
    <div class="send-box__right">
      <el-input
        v-model="message"
        :placeholder="placeholder"
        clearable
        @keydown.enter="handleSend"
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
import { sendMessage } from '@/services/chatService';
import { useChatStore } from '@/store/useChatStore';
import { DocumentCopy, Right as Send } from '@element-plus/icons-vue';
import { ref } from 'vue';
const chatStore = useChatStore();

const message = ref<string>('');
const placeholder = ref<string>('Write your message...');
defineOptions({
  name: 'ChatInput',
});

const handleSend = async (): Promise<void> => {
  sendMessage(
    chatStore.roomChatId as string,
    chatStore.targetUser?.uid as string,
    message.value.trim(),
  );

  message.value = '';
};
</script>

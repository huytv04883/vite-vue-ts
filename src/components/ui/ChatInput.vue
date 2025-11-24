<template>
  <div class="send-box" :class="{ 'send-box--sending': props.sending }">
    <div v-if="selectedImage" class="send-box__preview">
      <ImageSending :image-url="previewUrl" :is-sending="false" />
      <el-button
        class="send-box__preview-close"
        :icon="Close"
        circle
        size="small"
        @click="removeImage"
      />
    </div>
    <div class="send-box__content">
      <div class="send-box__left">
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          style="display: none"
          @change="handleFileSelect"
        />
        <el-button :icon="Burger" circle plain title="Attach file" @click="triggerFileInput" />
      </div>
      <div class="send-box__right">
        <input
          v-model="message"
          :placeholder="placeholder"
          :disabled="selectedImage !== null"
          clearable
          @keydown.enter="handleSend"
          @keydown="handleTyping"
        />
        <el-button
          :icon="Send"
          circle
          @click="handleSend"
          :disabled="!message.trim() && selectedImage === null"
          type="primary"
          title="Send message"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ImageSending from '@/components/ui/ImageSending.vue';
import { getDataUser } from '@/helper/storage';
import { listenTypingStatus, setTypingStatus } from '@/services/chatService';
import { useChatStore } from '@/store/useChatStore';
import { Burger, Close, Right as Send } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { onMounted, onUnmounted, ref } from 'vue';
const chatStore = useChatStore();
const user = getDataUser();
let unsubscribe: (() => void) | null = null;
let typingTimeout: number;

const message = ref<string>('');
const placeholder = ref<string>('Write your message...');
const fileInputRef = ref<HTMLInputElement | null>(null);
const selectedImage = ref<File | null>(null);
const previewUrl = ref<string>('');

defineOptions({
  name: 'ChatInput',
});

const emit = defineEmits(['update:setOtherTyping', 'sendMessage', 'sendImage']);
const props = defineProps<{
  sending: boolean;
}>();

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    selectedImage.value = file;
    previewUrl.value = URL.createObjectURL(file);
    emit('sendImage', file);
  }
};

const removeImage = () => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
  selectedImage.value = null;
  previewUrl.value = '';
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
};

const handleTyping = () => {
  clearTimeout(typingTimeout);
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
      emit('update:setOtherTyping', isTyping);
    },
  );
});

onUnmounted(() => unsubscribe && unsubscribe());

const handleSend = async (): Promise<void> => {
  try {
    if (!message.value.trim() && !selectedImage.value) return;
    emit('sendMessage', selectedImage.value ? selectedImage.value : message.value.trim(), {
      type: selectedImage.value ? 'image' : 'text',
    });
    if (selectedImage.value) {
      removeImage();
    }
    message.value = '';
  } catch (error) {
    const msg = (error as { message?: string })?.message ?? 'An error occurred';
    ElMessage({ message: msg, type: 'error', plain: true });
  }
};
</script>

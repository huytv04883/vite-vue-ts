<template>
  <div class="chat-message" :class="{ 'chat-message--own': isOwnMessage }">
    <CAvatar :src="avatarUrl" :size="32" class="chat-message__avatar" />
    <div class="chat-message__content">
      <div v-if="!isOwnMessage" class="chat-message__sender">{{ nameUser }}</div>
      <div class="chat-message__bubble">
        {{ message.text }}
      </div>
      <div class="chat-message__time">{{ formatFirestoreDate(message.createdAt) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import '@/assets/styles/components/conversation-message.scss';
import { getDataUser } from '@/helper/storage';
import { useChatStore } from '@/store/useChatStore';
import { Message } from '@/types/message.type';
import { computed } from 'vue';
import CAvatar from '../Avatar.vue';
import { formatFirestoreDate } from '@/utils/date';

const chatStore = useChatStore();
defineOptions({
  name: 'MessageItem',
});

const props = defineProps<{
  message: Message;
}>();

const user = getDataUser();
const isOwnMessage = computed(() => {
  return props.message.senderId === user?.user?.uid;
});
const avatarUrl = computed(() => {
  return isOwnMessage.value ? user?.user?.photoURL : chatStore.targetUser?.photoURL;
});
const nameUser = computed(() => {
  return isOwnMessage.value ? user?.user?.displayName : chatStore.targetUser?.displayName;
});
</script>

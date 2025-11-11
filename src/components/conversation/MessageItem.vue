<template>
  <div class="chat-message" :class="{ 'chat-message--own': isOwnMessage }">
    <CAvatar v-if="!isOwnMessage" :src="avatarUrl" :size="32" class="chat-message__avatar" />
    <el-popover placement="top-start" trigger="click" ref="emojisPopoverRef">
      <template #default>
        <div class="emojis-list">
          <button
            v-for="emoji in emojis"
            :key="emoji"
            class="hover:scale-110 transition emojis-button"
            @click="handleReact(emoji)"
          >
            {{ emoji }}
          </button>
        </div>
      </template>
      <template #reference>
        <div class="chat-message__content">
          <div v-if="!isOwnMessage" class="chat-message__sender">{{ nameUser }}</div>
          <div class="chat-message__bubble">
            {{ message.text }}
          </div>
          <div class="chat-message__time">{{ formatFirestoreDate(message.createdAt) }}</div>
          <div v-if="!!emojisAdded.length" class="mt-1 flex gap-1">
            <span class="text-xl">
              {{ Array.isArray(emojisAdded) ? emojisAdded.join(' ') : emojisAdded }}
            </span>
          </div>
        </div>
      </template>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import '@/assets/styles/components/conversation-message.scss';
import { emojis } from '@/constants/emoji';
import { getDataUser } from '@/helper/storage';
import { toggleReaction } from '@/services/reactionService';
import { useChatStore } from '@/store/useChatStore';
import { Message } from '@/types/message.type';
import { formatFirestoreDate } from '@/utils/date';
import { ElMessage, ElPopover } from 'element-plus';
import { computed, onMounted, ref } from 'vue';
import CAvatar from '../Avatar.vue';

const chatStore = useChatStore();
const user = getDataUser();
const emojisPopoverRef = ref<InstanceType<typeof ElPopover> | null>(null);
const emojisAdded = ref<string[]>([]);

defineOptions({
  name: 'MessageItem',
});

const props = defineProps<{
  message: Message;
}>();

const handleReact = async (emoji: string) => {
  if (!emoji) return;
  try {
    await toggleReaction(
      chatStore.roomChatId as string,
      props.message.id,
      user?.user?.uid as string,
      emoji,
    ).then(() => {
      emojisPopoverRef.value?.hide();
    });
  } catch (error) {
    const msg = (error as { message?: string })?.message ?? 'An error occurred';
    ElMessage({ message: msg, type: 'error', plain: true });
  }
};

const isOwnMessage = computed(() => {
  return props.message.senderId === user?.user?.uid;
});

const avatarUrl = computed(() => {
  return isOwnMessage.value ? user?.user?.photoURL : chatStore.targetUser?.photoURL;
});
const nameUser = computed(() => {
  return isOwnMessage.value ? user?.user?.displayName : chatStore.targetUser?.displayName;
});

onMounted(() => {
  if (props.message.reactions) {
    const userId = user?.user?.uid;
    if (userId && props.message.reactions[userId as keyof typeof props.message.reactions]) {
      const userReactions = props.message.reactions[userId as keyof typeof props.message.reactions];
      emojisAdded.value = Array.isArray(userReactions) ? userReactions : [userReactions as string];
    } else {
      emojisAdded.value = [];
    }
  }
});
</script>

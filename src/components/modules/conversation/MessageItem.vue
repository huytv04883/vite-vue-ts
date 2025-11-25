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
          <div
            :class="
              message.typeMessage === 'image'
                ? 'chat-message__bubble chat-message__bubble--image'
                : 'chat-message__bubble'
            "
          >
            <ImageSending
              v-if="message.typeMessage === 'image'"
              :image-url="message.text"
              :is-sending="false"
              :percent="0"
            />
            <span v-else>{{ message.text }}</span>
          </div>
          <div class="chat-message__time">{{ formatFirestoreDate(message.createdAt) }}</div>
          <div v-if="!!emojisAdded.length">
            <span class="emojis-added">
              {{
                Array.isArray(emojisAdded)
                  ? emojisAdded.length > 3
                    ? emojisAdded.slice(0, 3).join(' ') + ' ' + (emojisAdded.length - 3) + '+'
                    : emojisAdded.join(' ')
                  : emojisAdded
              }}
            </span>
          </div>
        </div>
      </template>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import fallbackAavatar from '@/assets/imgs/avatar-fallback.png';
import '@/assets/styles/components/conversation-message.scss';
import ImageSending from '@/components/ui/ImageSending.vue';
import { emojis } from '@/constants/emoji';
import { getDataUser } from '@/helper/storage';
import { toggleReaction } from '@/services/reactionService';
import { CHAT_ACTION, useChatStore } from '@/store/useChatStore';
import { Message } from '@/types/message.type';
import { formatFirestoreDate } from '@/utils/date';
import { MESSAGES } from '@/utils/message';
import { ElPopover } from 'element-plus';
import { computed, ref, watch } from 'vue';
import CAvatar from '../../ui/Avatar.vue';

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

watch(
  () => props.message.reactions,
  (reactions) => {
    if (reactions && typeof reactions === 'object') {
      const allEmojis: string[] = [];
      Object.values(reactions).forEach((reactsMsg) => {
        if (Array.isArray(reactsMsg)) {
          allEmojis.push(...reactsMsg);
          return;
        }
        allEmojis.push(reactsMsg);
      });
      emojisAdded.value = allEmojis;
    } else {
      emojisAdded.value = [];
    }
  },
  { immediate: true, deep: true },
);

const handleReact = async (emoji: string) => {
  if (!emoji) return;
  try {
    await toggleReaction(
      chatStore.roomChatId as string,
      props.message.id,
      user?.user?.uid as string,
      emoji,
    ).then(() => {
      chatStore.setChatAction(CHAT_ACTION.REACT_TO_MESSAGE);
      emojisPopoverRef.value?.hide();
    });
  } catch (error) {
    const msg = (error as { message?: string })?.message ?? 'Failed to add reaction';
    MESSAGES.error(msg, 3);
  }
};

const isOwnMessage = computed(() => {
  return props.message.senderId === user?.user?.uid;
});

const avatarUrl = computed(() => {
  return isOwnMessage.value ? user?.user?.photoURL : (props.message?.avatarUrl ?? fallbackAavatar);
});
const nameUser = computed(() => {
  return isOwnMessage.value ? user?.user?.displayName : chatStore.targetUser?.displayName;
});
</script>

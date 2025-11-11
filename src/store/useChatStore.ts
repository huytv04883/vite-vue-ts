import { User } from '@/types/user.type';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useChatStore = defineStore('chat', {
  state: () => {
    return {
      roomChatId: ref<string | null>(null),
      targetUser: ref<User | null>(null),
      isOtherTyping: ref<boolean>(false),
    };
  },
  actions: {
    setRoomChatId(id: string) {
      this.roomChatId = id;
    },
    setTargetUser(user: User | null) {
      this.targetUser = user;
    },
    setIsOtherTyping(isTyping: boolean) {
      this.isOtherTyping = isTyping;
    },
  },
  persist: true,
});

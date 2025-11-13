import { User } from '@/types/user.type';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const CHAT_ACTION = {
  SEND_MESSAGE: 'SEND_MESSAGE',
  DELETE_MESSAGE: 'DELETE_MESSAGE',
  EDIT_MESSAGE: 'EDIT_MESSAGE',
  REACT_TO_MESSAGE: 'REACT_TO_MESSAGE',
} as const;

export const useChatStore = defineStore('chat', {
  state: () => {
    return {
      roomChatId: ref<string | null>(null),
      targetUser: ref<User | null>(null),
      isOtherTyping: ref<boolean>(false),
      chatAction: ref<string | null>(null),
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
    setChatAction(action: (typeof CHAT_ACTION)[keyof typeof CHAT_ACTION]) {
      this.chatAction = action;
    },
  },
  persist: true,
});

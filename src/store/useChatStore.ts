import { Group } from '@/types/group.type';
import { User } from '@/types/user.type';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const CHAT_ACTION = {
  SEND_MESSAGE: 'SEND_MESSAGE',
  DELETE_MESSAGE: 'DELETE_MESSAGE',
  EDIT_MESSAGE: 'EDIT_MESSAGE',
  REACT_TO_MESSAGE: 'REACT_TO_MESSAGE',
} as const;

export const CHAT_TYPE = {
  USER: 'USER',
  GROUP: 'GROUP',
};

export const useChatStore = defineStore('chat', {
  state: () => {
    return {
      roomChatId: ref<string | null>(null),
      targetUser: ref<User | null>(null),
      targetGroup: ref<Group | null>(null),
      isOtherTyping: ref<boolean>(false),
      chatAction: ref<string | null>(null),
      chatType: ref<string | null>(null),
    };
  },
  actions: {
    setRoomChatId(id: string) {
      this.roomChatId = id;
    },
    setTargetUser(user: User | null) {
      this.targetUser = user;
    },
    setTargetGroup(group: Group | null) {
      this.targetGroup = group;
    },
    setIsOtherTyping(isTyping: boolean) {
      this.isOtherTyping = isTyping;
    },
    setChatAction(action: (typeof CHAT_ACTION)[keyof typeof CHAT_ACTION]) {
      this.chatAction = action;
    },
    setChatType(type: (typeof CHAT_TYPE)[keyof typeof CHAT_TYPE]) {
      this.chatType = type;
    }
  },
  persist: true,
});

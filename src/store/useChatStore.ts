import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useChatStore = defineStore('chat', {
  state: () => {
    return {
      roomChatId: ref<string | null>(null),
    };
  },
  actions: {
    setRoomChatId(id: string) {
      console.log(id);

      this.roomChatId = id;
    },
  },
});

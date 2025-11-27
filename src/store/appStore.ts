import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore('app', {
  state: () => {
    return {
      isOpenCreateGroupPopover: ref<boolean>(false),
      isOpenNotificationPopover: ref<boolean>(false),
    };
  },
  actions: {
    setOpenCreateGroupPopover(isOpen: boolean) {
      this.isOpenCreateGroupPopover = isOpen;
    },
    setOpenNotificationPopover(isOpen: boolean) {
      this.isOpenNotificationPopover = isOpen;
    },
  },
});

import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore('app', {
  state: () => {
    return {
      isOpenCreateGroupPopover: ref<boolean>(false),
    };
  },
  actions: {
    setOpenCreateGroupPopover(isOpen: boolean) {
      this.isOpenCreateGroupPopover = isOpen;
    },
  },
});


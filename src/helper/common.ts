import { nextTick, Ref } from "vue";

export const scrollToBottom = async (ref: Ref<HTMLDivElement | null, HTMLDivElement | null>) => {
  await nextTick();
  const el = ref.value;
  if (el) {
    el.scrollTo({
      top: el.scrollHeight,
      behavior: 'smooth',
    });
  }
};

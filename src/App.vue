<script setup lang="ts">
import { PATH } from '@/constants/common';
import { auth } from '@/firebase/config';
import ChatLayout from '@/layouts/ChatLayout.vue';
import GuestLayout from '@/layouts/GuestLayout.vue';
import PrivateLayout from '@/layouts/PrivateLayout.vue';
import { onAuthStateChanged } from 'firebase/auth';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import router from './router';

const currentUser = ref<boolean>(false);
const routerChat = ['ChatUser', 'ChatGroup'];
const currentPage = computed(() => (currentUser.value ? PATH.PRIVATE : PATH.PUBLIC));
const layout = ref(GuestLayout);

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    currentUser.value = !!user?.email;
  });
});

watch(
  () => router.currentRoute.value.name,
  async () => {
    await nextTick();
    const isChatPage = routerChat.includes(router.currentRoute.value.name as string);
    switch (true) {
      case currentPage.value === PATH.PRIVATE:
        layout.value = isChatPage ? ChatLayout : PrivateLayout;
        break;
      default:
        layout.value = GuestLayout;
        break;
    }
  },
  { immediate: true },
);
</script>

<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

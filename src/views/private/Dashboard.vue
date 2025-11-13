<script setup lang="ts">
import { auth } from '@/firebase/config';
import router from '@/router';
import { getOrCreateChat } from '@/services/chatService';
import { getRandomUsers } from '@/services/userService';
import { useChatStore } from '@/store/useChatStore';
import { User } from '@/types/user.type';
import { onMounted, ref } from 'vue';
defineOptions({
  name: 'Dashboard-page',
});

const chatStore = useChatStore();

const users = ref<User[] | null>(null);

onMounted(async () => {
  users.value = await getRandomUsers(100);
});

const handleCreateChat = async (targetUser: User) => {
  await getOrCreateChat(targetUser.uid, auth.currentUser?.uid as string).then((chatId) => {
    if (!chatId) return;
    chatStore.setRoomChatId(chatId);
    chatStore.setTargetUser(targetUser);
    router.push({ name: 'Chat', params: { id: chatId } });
  });
};
</script>
<template>
  <div class="dashboard">
    <div class="user-list">
      <ul>
        <li v-for="user in users" :key="user.uid" @click="handleCreateChat(user)">
          <el-avatar :src="user.photoURL" :size="30" alt="User Avatar" />
          <span>{{ user.displayName }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

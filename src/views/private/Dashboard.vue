<script setup lang="ts">
import { auth } from '@/firebase/config';
import router from '@/router';
import { getOrCreateChat } from '@/services/chatService';
import { getDataGroupChat } from '@/services/groupChatService';
import { getRandomUsers } from '@/services/userService';
import { useChatStore } from '@/store/useChatStore';
import { User } from '@/types/user.type';
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';
defineOptions({
  name: 'Dashboard-page',
});

const chatStore = useChatStore();
const users = ref<User[] | null>(null);
const groupChats = ref<unknown[]>([]);

onMounted(async () => {
  users.value = await getRandomUsers();
});

const handleCreateChat = async (targetUser: User) => {
  try {
    await getOrCreateChat(targetUser.uid, auth.currentUser?.uid as string).then((chatId) => {
      if (!chatId) return;
      chatStore.setRoomChatId(chatId);
      chatStore.setTargetUser(targetUser);
      router.push({ name: 'Chat', params: { id: chatId } });
    });
  } catch (error) {
    const msg = (error as { message?: string })?.message ?? 'An error occurred';
    ElMessage({ message: msg, type: 'error', plain: true });
  }
};

onMounted(async () => {
  await getDataGroupChat('toeQGbEa4aqsVV1s2wAY').then((data) => {
    console.log('data', data);
    groupChats.value.push(data);
  });
});
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

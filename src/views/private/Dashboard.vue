<script setup lang="ts">
import { auth } from '@/firebase/config';
import router from '@/router';
import { getOrCreateChat } from '@/services/chatService';
import { getGroupsChatByUserId } from '@/services/groupChatService';
import { getRandomUsers } from '@/services/userService';
import { useChatStore } from '@/store/useChatStore';
import { Group } from '@/types/group.type';
import { User } from '@/types/user.type';
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';
defineOptions({
  name: 'Dashboard-page',
});

const chatStore = useChatStore();
const users = ref<User[] | null>(null);
const groupChats = ref<Group[]>([]);

const handleCreateChat = async (targetUser: User) => {
  try {
    await getOrCreateChat(targetUser.uid, auth.currentUser?.uid as string).then((chatId) => {
      if (!chatId) return;
      chatStore.setRoomChatId(chatId);
      chatStore.setTargetUser(targetUser);
      router.push({ name: 'ChatUser', params: { id: chatId } });
    });
  } catch (error) {
    const msg = (error as { message?: string })?.message ?? 'An error occurred';
    ElMessage({ message: msg, type: 'error', plain: true });
  }
};
const onDirectToGroupChat = (groupId: string) => {
  router.push({ name: 'ChatGroup', params: { id: groupId } });
};

onMounted(async () => {
  users.value = await getRandomUsers();
  groupChats.value = await getGroupsChatByUserId(auth.currentUser?.uid as string);
});
</script>
<template>
  <div class="dashboard">
    <el-divider class="chat-heading" content-position="left">Friends</el-divider>
    <div class="users">
      <ul>
        <li v-for="user in users" :key="user.uid" @click="handleCreateChat(user)">
          <el-avatar :src="user.photoURL" :size="30" alt="User Avatar" />
          <span>{{ user.displayName }}</span>
        </li>
      </ul>
    </div>
    <el-divider class="chat-heading" content-position="left">Groups</el-divider>
    <div class="groups">
      <ul>
        <li
          v-for="group in groupChats"
          :key="group.id"
          @click="() => onDirectToGroupChat(group.id)"
        >
          <el-avatar :size="30" alt="Group Chat Avatar" />
          <span>{{ group.name }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>


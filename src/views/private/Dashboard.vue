<script setup lang="ts">
import { auth } from '@/firebase/config';
import router from '@/router';
import { getOrCreateChat } from '@/services/chatService';
import { getGroupsChatByUserId } from '@/services/groupChatService';
import { getRandomUsers } from '@/services/userService';
import { CHAT_TYPE, useChatStore } from '@/store/useChatStore';
import { Group } from '@/types/group.type';
import { User } from '@/types/user.type';
import { MESSAGES } from '@/utils/message';
import { onMounted, ref } from 'vue';
defineOptions({
  name: 'Dashboard-page',
});

const chatStore = useChatStore();
const users = ref<User[]>([]);
const groupChats = ref<Group[]>([]);
const loading = ref(false);

const handleCreateChat = async (targetUser: User) => {
  try {
    await getOrCreateChat(targetUser.uid, auth.currentUser?.uid as string).then((chatId) => {
      if (!chatId) return;
      chatStore.setRoomChatId(chatId);
      chatStore.setTargetUser(targetUser);
      chatStore.setChatType(CHAT_TYPE.USER);
      router.push({ name: 'ChatUser', params: { id: chatId } });
    });
  } catch (error) {
    const msg = (error as { message?: string })?.message ?? 'An error occurred';
    MESSAGES.error(msg, 3);
  }
};

const onDirectToGroupChat = (group: Group) => {
  chatStore.setTargetGroup(group);
  chatStore.setChatType(CHAT_TYPE.GROUP);
  router.push({ name: 'ChatGroup', params: { id: group.id } });
};

const initData = async () => {
  loading.value = true;
  try {
    users.value = await getRandomUsers();
    groupChats.value = await getGroupsChatByUserId(auth.currentUser?.uid as string);
  } catch (error) {
    const msg = (error as { message?: string })?.message ?? 'An error occurred';
    MESSAGES.error(msg, 3);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await initData();
});
</script>
<template>
  <div class="dashboard" v-loading="loading">
    <template v-if="users?.length > 0 || groupChats.length > 0">
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
          <li v-for="group in groupChats" :key="group.id" @click="() => onDirectToGroupChat(group)">
            <el-avatar :size="30" alt="Group Chat Avatar" />
            <span>{{ group.name }}</span>
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>

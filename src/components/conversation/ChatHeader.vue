<template>
  <div class="chat-header">
    <div class="chat-header__avatar">
      <el-button class="back" @click="router.back()" :icon="ArrowLeftBold" size="small" circle />
      <CAvatar
        :src="chatType === CHAT_TYPE.USER ? targetUser?.photoURL : fallbackAavatar"
        :size="30"
        class="chat-header__avatar"
      />
    </div>
    <div class="chat-header__info">
      <div class="chat-header__name">
        {{ chatType === CHAT_TYPE.USER ? targetUser?.displayName : targetGroup?.name }}
      </div>
    </div>
    <div class="chat-header__actions">
      <el-button :icon="Phone" size="small" circle />
      <el-button :icon="VideoCamera" size="small" circle />
      <el-button :icon="More" size="small" circle />
    </div>
  </div>
</template>

<script setup lang="ts">
import fallbackAavatar from '@/assets/imgs/avatar-fallback.png';
import router from '@/router';
import { CHAT_TYPE, useChatStore } from '@/store/useChatStore';
import { ArrowLeftBold, More, Phone, VideoCamera } from '@element-plus/icons-vue';
import { ElButton } from 'element-plus';
import { computed } from 'vue';
import CAvatar from '../Avatar.vue';

defineOptions({
  name: 'ChatHeader',
});

const chatStore = useChatStore();
const chatType = computed(() => chatStore.chatType);
const targetUser = computed(() => chatStore.targetUser);
const targetGroup = computed(() => chatStore.targetGroup);
</script>

<script setup lang="ts">
import fallbackAavatar from '@/assets/imgs/avatar-fallback.png';
import logoUrl from '@/assets/imgs/ss.png';
import { useAuth } from '@/composables/useAuth';
import { auth } from '@/firebase/config';
import { clearDataUser } from '@/helper/storage';
import router from '@/router';
import { useAppStore } from '@/store/appStore';
import { MESSAGES } from '@/utils/message';
import { Bell, Edit } from '@element-plus/icons-vue';
import { onClickOutside } from '@vueuse/core';
import { onAuthStateChanged, User } from 'firebase/auth';
import { onMounted, ref, useTemplateRef } from 'vue';

defineOptions({
  name: 'AppHeader',
});

const { logout } = useAuth();
const isShowDropdown = ref(false);
const dataUser = ref<User | null>(null);
const dropdownRef = useTemplateRef<HTMLElement>('dropdownRef');
const appStore = useAppStore();

onClickOutside(dropdownRef, () => {
  isShowDropdown.value = false;
});

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    dataUser.value = user;
  });
});

const handleLogout = async () => {
  try {
    await logout().then(() => {
      router.authUser = null;
      clearDataUser();
      isShowDropdown.value = false;
      router.push({ name: 'Login' });
    });
  } catch (error) {
    const msg = (error as { message?: string })?.message ?? 'Failed to logout';
    MESSAGES.error(msg, 3);
  }
};

const OPTIONS = [
  {
    label: 'Profile',
    handler: () => {
      router.push({ name: 'Profile' });
      isShowDropdown.value = false;
    },
  },
<<<<<<< HEAD
=======
  {
    label: 'Settings',
    handler: () => {
      router.push({ name: 'Settings' });
      isShowDropdown.value = false;
    },
  },
>>>>>>> feature/noti
  { label: 'Logout', handler: handleLogout },
];
</script>
<template>
  <header class="header">
    <h1 class="header__logo" @click="router.push({ name: 'Dashboard' })">
      <img :src="logoUrl" alt="Logo" width="35" height="35" fit="contain" />
    </h1>
    <div class="header__right" ref="dropdownRef">
      <button class="header__edit" @click="appStore.setOpenNotificationPopover(true)">
        <el-icon><Bell /></el-icon>
      </button>
      <button class="header__edit" @click="appStore.setOpenCreateGroupPopover(true)">
        <el-icon><Edit /></el-icon>
      </button>
      <el-avatar
        :size="30"
        :src="dataUser?.photoURL ?? fallbackAavatar"
        @click="isShowDropdown = !isShowDropdown"
        :key="dataUser?.uid"
      />
      <ul v-if="isShowDropdown">
        <li
          v-for="option in OPTIONS"
          :key="option.label"
          class="header__dropdown-item"
          @click="option.handler"
        >
          {{ option.label }}
        </li>
      </ul>
    </div>
  </header>
</template>

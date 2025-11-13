<script setup lang="ts">
import fallbackAavatar from '@/assets/imgs/avatar-fallback.png';
import { auth } from '@/firebase/config';
import { clearDataUser } from '@/helper/storage';
import { useAuth } from '@/hooks/useAuth';
import router from '@/router';
import { useAppStore } from '@/store/appStore';
import { Edit } from '@element-plus/icons-vue';
import { onClickOutside } from '@vueuse/core';
import { ElMessage } from 'element-plus';
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
    const msg = (error as { message?: string })?.message ?? 'An error occurred';
    ElMessage({ message: msg, type: 'error', plain: true });
  }
};
</script>
<template>
  <header class="header">
    <h1 class="header__logo" @click="router.push({ name: 'Dashboard' })">HH</h1>
    <div class="header__right" ref="dropdownRef">
      <button class="header__edit">
        <el-icon @click="appStore.setOpenCreateGroupPopover(true)"><Edit /></el-icon>
      </button>
      <el-avatar
        :size="30"
        :src="dataUser?.photoURL ?? fallbackAavatar"
        @click="isShowDropdown = !isShowDropdown"
        :key="dataUser?.uid"
      />
      <ul v-if="isShowDropdown">
        <li>Profile</li>
        <li @click="handleLogout">Logout</li>
      </ul>
    </div>
  </header>
</template>

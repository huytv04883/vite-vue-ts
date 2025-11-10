<script setup lang="ts">
import { clearDataUser, getDataUser } from '@/helper/storage';
import { useAuth } from '@/hooks/useAuth';
import router from '@/router';
import { onClickOutside } from '@vueuse/core';
import { ElMessage } from 'element-plus';
import { ref, useTemplateRef } from 'vue';

defineOptions({
  name: 'AppHeader',
});
const user = getDataUser();
const { logout } = useAuth();
const isShowDropdown = ref(false);
const dropdownRef = useTemplateRef<HTMLElement>('dropdownRef');

onClickOutside(dropdownRef, () => {
  isShowDropdown.value = false;
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
      <el-avatar :size="30" :src="user?.user?.photoURL" @click="isShowDropdown = !isShowDropdown" />
      <ul v-if="isShowDropdown">
        <li>Profile</li>
        <li @click="handleLogout">Logout</li>
      </ul>
    </div>
  </header>
</template>

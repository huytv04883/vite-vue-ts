<script setup lang="ts">
import { clearDataUser, getDataUser } from '@/helper/storage';
import { useAuth } from '@/hooks/useAuth';
import router from '@/router';
import { ElMessage } from 'element-plus';
import CAvatar from '@/components/Avatar.vue';

defineOptions({
  name: 'PrivateLayout',
});
const user = getDataUser();
const { logout } = useAuth();

const handleLogout = async () => {
  try {
    await logout().then(() => {
      router.authUser = null;
      clearDataUser();
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
    <h1 class="header__logo">LuLu Chat</h1>
    <el-dropdown placement="bottom-end">
      <CAvatar :size="30" :src="user?.user?.photoURL" />
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>Profile</el-dropdown-item>
          <el-dropdown-item @click="handleLogout">Logout</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </header>
  <main>
    <slot />
  </main>
</template>

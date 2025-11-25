<script setup lang="ts">
import { useAppStore } from '@/store/appStore';
import { ref, watch } from 'vue';

const drawer = ref(false);
const appStore = useAppStore();
defineOptions({
  name: 'NotificationPopover',
});

watch(
  () => appStore.isOpenNotificationPopover,
  (newVal) => {
    drawer.value = newVal;
  },
  { immediate: true },
);

watch(drawer, (newVal) => {
  if (!newVal && appStore.isOpenNotificationPopover) {
    appStore.setOpenNotificationPopover(false);
  }
});
</script>

<template>
  <el-drawer
    class="notification-drawer"
    v-model="drawer"
    title="Notifications"
    :with-header="true"
    direction="ltr"
    size="80%"
  >
    <span>Noti</span>
  </el-drawer>
</template>

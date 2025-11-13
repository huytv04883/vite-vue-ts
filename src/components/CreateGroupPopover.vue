<script setup lang="ts">
import { useAppStore } from '@/store/appStore';
import { ref, watch } from 'vue';
const drawer = ref(false);

defineOptions({
  name: 'CreateGroupPopover',
});
const appStore = useAppStore();

watch(
  () => appStore.isOpenCreateGroupPopover,
  (newVal) => {
    drawer.value = newVal;
  },
  { immediate: true, deep: true },
);

watch(drawer, (newVal) => {
  if (!newVal && appStore.isOpenCreateGroupPopover) {
    appStore.setOpenCreateGroupPopover(false);
  }
});
</script>

<template>
  <el-drawer v-model="drawer" title="I am the title" :with-header="false" :direction="'btt'">
    <span>Hi there!</span>
  </el-drawer>
</template>

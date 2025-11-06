<template>
  <el-avatar :size="size" :src="src" :icon="icon">
    <slot></slot>
  </el-avatar>
</template>

<script setup lang="ts">
type TAvatarProps = {
  size?: number | string;
  src?: string | null;
  icon?: string;
};
defineOptions({
  name: 'CAvatar',
});
withDefaults(defineProps<TAvatarProps>(), {
  size: 'default',
  src: '/assets/imgs/avatar-fallback.png',
});
</script>

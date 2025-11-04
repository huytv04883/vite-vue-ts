<script setup lang="ts">
import { PATH } from '@/constants/common';
import { auth } from '@/firebase/config';
import GuestLayout from '@/layouts/GuestLayout.vue';
import PrivateLayout from '@/layouts/PrivateLayout.vue';
import { computed } from 'vue';

const currentUser = computed(() => !!auth?.currentUser?.email);

const currentPage = computed(() => currentUser.value ? PATH.PRIVATE : PATH.PUBLIC);

const layout = computed(() => {
  return currentPage.value === PATH.PUBLIC ? GuestLayout : PrivateLayout;
});
</script>

<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

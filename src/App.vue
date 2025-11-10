<script setup lang="ts">
import { PATH } from '@/constants/common';
import { auth } from '@/firebase/config';
import GuestLayout from '@/layouts/GuestLayout.vue';
import PrivateLayout from '@/layouts/PrivateLayout.vue';
import { onAuthStateChanged } from 'firebase/auth';
import { computed, onMounted, ref } from 'vue';

const currentUser = ref<boolean>(false);

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    currentUser.value = !!user?.email;
  });
});

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

<template>
  <div class="home-page">
    <section class="hero">
      <h1 class="hero__title">Welcome to back</h1>
      <p class="hero__subtitle">Simple, fast, and secure messaging</p>
      <router-link to="/login" class="hero__btn-start"> Start Chat </router-link>
    </section>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'HomePage' });
</script>

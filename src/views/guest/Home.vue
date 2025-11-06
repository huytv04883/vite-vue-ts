<template>
  <div class="home-page">
    <nav class="navbar">
      <div class="navbar__container">
        <div class="navbar__logo">LuLu Chat</div>
        <router-link to="/login" class="navbar__btn navbar__btn--outline"> Log in </router-link>
      </div>
    </nav>

    <section class="hero">
      <h1 class="hero__title">Welcome to LuLu Chat</h1>
      <p class="hero__subtitle">Simple, fast, and secure messaging</p>
      <router-link to="/login" class="btn-start"> Start Chat </router-link>
    </section>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'HomePage' });
</script>

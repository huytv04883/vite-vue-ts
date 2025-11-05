<script setup lang="ts">
import { useAuth } from '@/hooks/useAuth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const { register } = useAuth();
const router = useRouter();

defineOptions({
  name: 'Register-page',
});

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const handleRegister = async () => {
  try {
    loading.value = true;
    error.value = '';
    await register(email.value, password.value);
    router.push('/Login');
  } catch (err: unknown) {
    error.value = (err as { message?: string })?.message ?? 'An error occurred';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="register">
    <h2 class="register__title">Create Account</h2>
    <form class="register__form" @submit.prevent="handleRegister">
      <div class="register__form-group">
        <input v-model="email" class="register__input" type="email" placeholder="Email" required />
        <input
          v-model="password"
          class="register__input"
          type="password"
          placeholder="Password"
          required
        />
      </div>
      <button
        type="submit"
        class="register__button"
        :class="{ 'register__button--loading': loading }"
        :disabled="loading"
      >
        {{ loading ? 'Registering...' : 'Register' }}
      </button>
    </form>
    <p v-if="error" class="register__error">{{ error }}</p>
    <div class="register__link">
      Already have an account?
      <router-link to="/login">Login</router-link>
    </div>
  </div>
</template>

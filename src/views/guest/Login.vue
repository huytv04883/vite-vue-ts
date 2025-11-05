<script setup lang="ts">
import { ref } from 'vue';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { auth } from '@/firebase/config';

defineOptions({
  name: 'Login-page',
});

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const router = useRouter();

const handleLogin = async () => {
  loading.value = true;
  error.value = '';

  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push('/chat'); // redirect to private page
  } catch (err: unknown) {
    error.value = (err as { message?: string })?.message ?? 'An error occurred';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="login">
    <h2 class="login__title">Login</h2>
    <form class="login__form" @submit.prevent="handleLogin">
      <div class="login__form-group">
        <input 
          v-model="email" 
          class="login__input"
          type="email" 
          placeholder="Email" 
          required 
        />
        <input 
          v-model="password" 
          class="login__input"
          type="password" 
          placeholder="Password" 
          required 
        />
      </div>
      <button 
        type="submit" 
        class="login__button"
        :class="{ 'login__button--loading': loading }"
        :disabled="loading"
      >
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
      <p v-if="error" class="login__error">{{ error }}</p>
    </form>

    <div class="login__footer">
      Don't have an account?
      <router-link to="/register">Register</router-link>
    </div>
  </div>
</template>

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
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
      <p class="error" v-if="error">{{ error }}</p>
    </form>

    <p>
      Don't have an account?
      <router-link to="/register">Register</router-link>
    </p>
  </div>
</template>

<style scoped lang="scss">
.login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  h2 {
    text-align: center;
    margin-bottom: 24px;
  }

  .form-group {
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    input {
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
  }

  button {
    width: 100%;
    padding: 10px;
    border: none;
    background: #4f46e5;
    color: white;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  .error {
    color: red;
    margin-top: 10px;
    text-align: center;
  }
}
</style>

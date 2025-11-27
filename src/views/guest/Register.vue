<script setup lang="ts">
import { auth } from '@/firebase/config';
import router from '@/router';
import { saveUserIfNotExists } from '@/services/userService';
import type { LoginForm } from '@/types/login.type';
import { MESSAGES } from '@/utils/message';
import type { FormInstance, FormRules } from 'element-plus';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { reactive, ref } from 'vue';

defineOptions({
  name: 'Register-page',
});

const loading = ref(false);
const error = ref('');

const registerFormRef = ref<FormInstance>();
const registerForm = reactive<LoginForm>({
  email: '',
  password: '',
});

const rules = reactive<FormRules<LoginForm>>({
  email: [
    { required: true, message: 'Please input your email', trigger: 'change' },
    { type: 'email', message: 'Please input a valid email', trigger: 'change' },
  ],
  password: [
    { required: true, message: 'Please input your password', trigger: 'change' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'change' },
  ],
});

const handleRegister = async () => {
  const formEl = registerFormRef.value;
  if (!formEl) return;
  const valid = await formEl.validate();
  if (valid) {
    loading.value = true;
    try {
      await createUserWithEmailAndPassword(auth, registerForm.email, registerForm.password)
        .then(async (res) => {
          if (!res) return;
          MESSAGES.success('Registration successful!', 3);
          router.authUser = res.user;
          await saveUserIfNotExists().then(() => {
            router.push({ name: 'Login' });
          });
        })
        .finally(() => {
          loading.value = false;
        });
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? 'An error occurred';
      MESSAGES.error(msg, 3);
    } finally {
      loading.value = false;
    }
  }
};
</script>

<template>
  <div class="register-page">
    <div class="register-form">
      <h2 class="register__title">Register</h2>
      <el-form
        ref="registerFormRef"
        :rules="rules"
        :model="registerForm"
        class="register__form"
        label-width="100px"
        label-position="left"
        @submit.prevent="handleRegister"
      >
        <div class="register__form-group">
          <el-form-item label="Email" prop="email">
            <input v-model="registerForm.email" class="register__input" placeholder="Email" />
          </el-form-item>
          <el-form-item label="Password" prop="password">
            <input
              type="password"
              v-model="registerForm.password"
              class="register__input"
              placeholder="Password"
            />
          </el-form-item>
        </div>
        <el-button
          type="primary"
          :class="{ 'register__button--loading': loading }"
          :loading="loading"
          native-type="submit"
        >
          {{ loading ? 'Registering...' : 'Register' }}
        </el-button>
      </el-form>
      <p v-if="error" class="register__error">{{ error }}</p>
      <div class="register__link">
        Already have an account?
        <router-link to="/login">Login</router-link>
      </div>
    </div>
  </div>
</template>

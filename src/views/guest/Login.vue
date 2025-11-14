<script setup lang="ts">
import { auth } from '@/firebase/config';
import { setDataUser } from '@/helper/storage';
import { useAuth } from '@/hooks/useAuth';
import router from '@/router';
import { saveUserIfNotExists } from '@/services/userService';
import { LoginForm } from '@/types/login.type';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { reactive, ref } from 'vue';

const { signInWithGoogle } = useAuth();

defineOptions({
  name: 'Login-page',
});

const loading = ref(false);

const loginFormRef = ref<FormInstance>();
const loginForm = reactive<LoginForm>({
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

const handleLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  const valid = await formEl.validate();
  if (valid) {
    loading.value = true;
    try {
      await signInWithEmailAndPassword(auth, loginForm.email, loginForm.password)
        .then(async (res) => {
          if (!res) return;
          ElMessage({
            message: 'Login successful!',
            type: 'success',
            plain: true,
          });
          router.authUser = res.user;
          setDataUser(res);
          await saveUserIfNotExists();
          router.push({ name: 'Dashboard' });
        })
        .finally(() => {
          loading.value = false;
        });
    } catch (error) {
      const msg = (error as { message?: string })?.message ?? 'An error occurred';
      ElMessage({ message: msg, type: 'error', plain: true });
      loading.value = false;
    }
  }
};

const handleGoogleLogin = async () => {
  try {
    loading.value = false;
    await signInWithGoogle().then(async (res) => {
      if (!res) return;
      await saveUserIfNotExists();
      ElMessage({
        message: 'Login with Google successful!',
        type: 'success',
        plain: true,
      });
      router.authUser = res.user;
      setDataUser(res);
      router.push({ name: 'Dashboard' });
    });
  } catch (error) {
    const msg = (error as { message?: string })?.message ?? 'An error occurred';
    ElMessage({ message: msg, type: 'error', plain: true });
    loading.value = false;
  }
};
</script>

<template>
  <div class="login-page">
    <div class="login-form">
      <h2 class="login__title">Login</h2>
      <el-form
        ref="loginFormRef"
        :rules="rules"
        :model="loginForm"
        class="login__form"
        label-width="100px"
        label-position="left"
        @submit.prevent="handleLogin"
      >
        <div class="login__form-group">
          <el-form-item label="Email" prop="email">
            <input v-model="loginForm.email" class="login__input" placeholder="Email" />
          </el-form-item>
          <el-form-item label="Password" prop="password">
            <input type="password" v-model="loginForm.password" class="login__input" placeholder="Password" />
          </el-form-item>
        </div>
        <el-button
          type="primary"
          :class="{ 'login__button--loading': loading }"
          :disabled="loading"
          @click="handleLogin(loginFormRef)"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </el-button>
      </el-form>
      <el-divider content-position="center">Or</el-divider>
      <el-button class="login__google-btn" @click="handleGoogleLogin">
        <img
          src="@/assets/imgs/gg.png"
          width="20px"
          height="20px"
          alt="Google Logo"
          class="google-logo"
        />
        Sign in with Google
      </el-button>
      <div class="login__footer">
        Don't have an account?
        <router-link to="/register">Register</router-link>
      </div>
    </div>
  </div>
</template>

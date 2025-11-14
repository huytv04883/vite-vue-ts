<script setup lang="ts">
import fallbackAavatar from '@/assets/imgs/avatar-fallback.png';
import { updateUserProfile } from '@/services/userService';
import {
  Camera,
  Edit,
  Lock,
  Message as MessageIcon
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { User } from 'firebase/auth';
import { getAuth, updatePassword, updateProfile } from 'firebase/auth';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'ProfilePage',
});

const auth = getAuth();
const router = useRouter();

const user = ref<User | null>(null);
const isEditing = ref(false);
const isChangingPassword = ref(false);
const loading = ref(false);
const uploadingAvatar = ref(false);

// Profile form
const profileForm = ref({
  displayName: '',
  email: '',
});

// Password form
const passwordForm = ref({
  newPassword: '',
  confirmPassword: '',
});

const loadUserData = () => {
  user.value = auth.currentUser;
  if (user.value) {
    profileForm.value = {
      displayName: user.value.displayName || '',
      email: user.value.email || '',
    };
  }
};

const handleEditProfile = () => {
  isEditing.value = true;
};

const handleCancelEdit = () => {
  isEditing.value = false;
  loadUserData();
};

const handleSaveProfile = async () => {
  if (!user.value) return;

  try {
    loading.value = true;
    await updateProfile(user.value, {
      displayName: profileForm.value.displayName,
    });

    // Update Firestore user document
    await updateUserProfile(user.value.uid, profileForm.value.displayName);

    ElMessage({ message: 'Profile updated successfully!', type: 'success', plain: true });
    isEditing.value = false;
    loadUserData();
  } catch (error) {
    const msg = (error as { message?: string })?.message ?? 'Failed to update profile';
    ElMessage({ message: msg, type: 'error', plain: true });
  } finally {
    loading.value = false;
  }
};

const handleChangePassword = async () => {
  if (!user.value) return;

  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    ElMessage({ message: 'Passwords do not match', type: 'warning', plain: true });
    return;
  }

  if (passwordForm.value.newPassword.length < 6) {
    ElMessage({ message: 'Password must be at least 6 characters', type: 'warning', plain: true });
    return;
  }

  try {
    loading.value = true;
    await updatePassword(user.value, passwordForm.value.newPassword);

    ElMessage({ message: 'Password changed successfully!', type: 'success', plain: true });
    isChangingPassword.value = false;
    passwordForm.value = {
      newPassword: '',
      confirmPassword: '',
    };
  } catch (error) {
    const msg = (error as { message?: string })?.message ?? 'Failed to change password';
    ElMessage({ message: msg, type: 'error', plain: true });
  } finally {
    loading.value = false;
  }
};

const handleGoBack = () => {
  router.push({ name: 'Dashboard' });
};

onMounted(() => {
  loadUserData();
});
</script>

<template>
  <div class="profile">
    <div class="profile__header">
      <el-button :icon="MessageIcon" circle @click="handleGoBack" />
      <h2 class="profile__title">Profile</h2>
      <div class="profile__spacer"></div>
    </div>

    <div class="profile__content">
      <!-- Avatar Section -->
      <div class="profile__avatar-section">
        <div class="profile__avatar-wrapper">
          <el-avatar :src="user?.photoURL || fallbackAavatar" :size="100" class="profile__avatar" />
          <el-upload
            :show-file-list="false"
            :auto-upload="false"
            accept="image/*"
            class="profile__avatar-upload"
          >
            <el-button
              :icon="Camera"
              circle
              class="profile__avatar-upload-btn"
              :loading="uploadingAvatar"
              size="small"
            />
          </el-upload>
        </div>
        <h3 class="profile__name">{{ user?.displayName || 'User' }}</h3>
        <p class="profile__email">{{ user?.email }}</p>
      </div>
      <div class="profile__card">
        <div class="profile__card-header">
          <h4 class="profile__card-title">Profile Information</h4>
          <el-button
            v-if="!isEditing"
            :icon="Edit"
            circle
            @click="handleEditProfile"
            size="small"
          />
        </div>

        <el-form
          :model="profileForm"
          label-position="top"
          class="profile__form"
          v-loading="loading"
        >
          <el-form-item label="Display Name">
            <el-input
              v-model="profileForm.displayName"
              :disabled="!isEditing"
              placeholder="Enter your name"
              size="large"
            />
          </el-form-item>

          <el-form-item label="Email">
            <el-input
              v-model="profileForm.email"
              :disabled="true"
              type="email"
              placeholder="Enter your email"
              size="large"
            />
          </el-form-item>
          <div v-if="isEditing" class="profile__actions">
            <el-button @click="handleCancelEdit" size="large">Cancel</el-button>
            <el-button type="primary" @click="handleSaveProfile" :loading="loading" size="large">
              Save Changes
            </el-button>
          </div>
        </el-form>
      </div>
      <div class="profile__card">
        <div class="profile__card-header">
          <h4 class="profile__card-title">Change Password</h4>
          <el-button
            v-if="!isChangingPassword"
            :icon="Lock"
            circle
            @click="isChangingPassword = true"
            size="small"
          />
        </div>

        <div v-if="isChangingPassword">
          <el-form
            :model="passwordForm"
            label-position="top"
            class="profile__form"
            v-loading="loading"
          >
            <el-form-item label="New Password">
              <el-input
                v-model="passwordForm.newPassword"
                type="password"
                placeholder="Enter new password"
                show-password
                size="large"
              />
            </el-form-item>

            <el-form-item label="Confirm Password">
              <el-input
                v-model="passwordForm.confirmPassword"
                type="password"
                placeholder="Confirm new password"
                show-password
                size="large"
              />
            </el-form-item>

            <div class="profile__actions">
              <el-button @click="isChangingPassword = false" size="large">Cancel</el-button>
              <el-button
                type="primary"
                @click="handleChangePassword"
                :loading="loading"
                size="large"
              >
                Change Password
              </el-button>
            </div>
          </el-form>
        </div>
        <div v-else class="profile__password-placeholder">
          <p>Click the lock icon to change your password</p>
        </div>
      </div>
    </div>
  </div>
</template>

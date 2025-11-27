<script setup lang="ts">
import ProfileAvatar from '@/components/modules/profile/ProfileAvatar.vue';
import { getDataUserById, updateUserProfile } from '@/services/userService';
import { User } from '@/types/user.type';
import { MESSAGES } from '@/utils/message';
import { Edit, Message as MessageIcon } from '@element-plus/icons-vue';
import { getAuth } from 'firebase/auth';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'ProfilePage',
});

const auth = getAuth();
const router = useRouter();

const user = ref<User | null>(null);
const isEditing = ref(false);
const loading = ref(false);
const isPreparing = ref(false);

// Profile form
const profileForm = ref({
  displayName: '',
  email: '',
});

const loadUserData = async () => {
  isPreparing.value = true;
  try {
    const result = await getDataUserById(auth.currentUser!.uid);
    if (result) {
      user.value = result;
      profileForm.value = {
        displayName: user.value.displayName || '',
        email: user.value.email || '',
      };
    }
  } catch (error) {
    const msg = (error as { message?: string })?.message ?? 'Failed to fetch user data';
    MESSAGES.error(msg, 3);
  } finally {
    isPreparing.value = false;
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

    // Update Firestore user document
    await updateUserProfile(user.value.uid, profileForm.value.displayName);
    MESSAGES.success('Profile updated successfully!', 3);
    isEditing.value = false;
    loadUserData();
  } catch (error) {
    const msg = (error as { message?: string })?.message ?? 'Failed to update profile';
    MESSAGES.error(msg, 3);
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
  <div class="profile" v-loading="isPreparing">
    <div class="profile__header">
      <el-button :icon="MessageIcon" circle @click="handleGoBack" />
      <h2 class="profile__title">Profile</h2>
      <div class="profile__spacer"></div>
    </div>

    <div class="profile__content" v-if="!isPreparing && !!user">
      <ProfileAvatar :user="user" />
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
    </div>
  </div>
</template>

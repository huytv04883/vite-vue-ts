<template>
  <div class="profile__avatar-section">
    <div class="profile__avatar-wrapper">
      <el-avatar
        :src="previewUrl || props.user?.photoURL || fallbackAavatar"
        :size="100"
        class="profile__avatar"
      />
      <CloudinaryUpload
        @on-upload-image="(selectedFile) => handleUploadImage(selectedFile)"
        @on-select-avatar="(file) => handleSelectAvatar(file)"
        @on-cancel="handleCancelSelectAvatar"
        :is-uploading="isUploading"
      />
    </div>
    <h3 class="profile__name">{{ props.user?.displayName || 'User' }}</h3>
    <p class="profile__email">{{ props.user?.email || 'No email provided' }}</p>
  </div>
</template>

<script setup lang="ts">
import fallbackAavatar from '@/assets/imgs/avatar-fallback.png';
import CloudinaryUpload from '@/components/ui/CloudinaryUpload.vue';
import { handleUploadImageToCloudinary } from '@/services/cloudinary/uploadService';
import { updateUserProfile } from '@/services/firebase/userService';
import { User } from '@/types/user.type';
import { MESSAGES } from '@/utils/message';
import { ref } from 'vue';

defineOptions({
  name: 'ProfileAvatar',
});
const props = defineProps<{
  user: User | null;
}>();

const isUploading = ref(false);
const previewUrl = ref<string | null>(null);

const handleSelectAvatar = (file: File) => {
  if (!file) return;
  previewUrl.value = URL.createObjectURL(file);
};

const handleCancelSelectAvatar = () => {
  previewUrl.value = null;
};

const handleUploadImage = async (selectedFile: File) => {
  if (!selectedFile) return;
  isUploading.value = true;
  previewUrl.value = URL.createObjectURL(selectedFile);
  try {
    await handleUploadImageToCloudinary(selectedFile).then(async (url) => {
      if (!url) return;
      await updateUserProfile(props.user!.uid, props.user?.displayName ?? '', url).then(() => {
        MESSAGES.success('Avatar updated successfully', 3);
      });
    });
  } catch (error) {
    const msg = (error as { message?: string })?.message ?? 'Failed to upload image';
    MESSAGES.error(msg, 3);
  } finally {
    isUploading.value = false;
  }
};
</script>

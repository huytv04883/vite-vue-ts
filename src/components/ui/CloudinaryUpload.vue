<template>
  <div class="cloudinary-upload">
    <div class="cloudinary-upload__input-wrapper">
      <Camera class="cloudinary-upload__icon" />
      <input
        class="cloudinary-upload__input"
        type="file"
        accept="image/*"
        @change="handleFileChange"
        ref="fileInput"
      />
    </div>
    <el-button
      class="cloudinary-upload__button cancel"
      :class="{ 'is-uploading': isUploading }"
      @click="handleCancel"
      :disabled="!selectedFile || isUploading"
      type="default"
      >Cancel</el-button
    >
    <el-button
      class="cloudinary-upload__button submit"
      :class="{ 'is-uploading': isUploading }"
      @click="uploadImage"
      :disabled="!selectedFile || isUploading"
      type="primary"
    >
      {{ isUploading ? 'Uploading...' : 'Upload' }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { Camera } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';

defineOptions({
  name: 'CloudinaryUpload',
});

const emit = defineEmits(['onUploadImage']);

const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const isUploading = ref(false);

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    selectedFile.value = file;
  }
};

const handleCancel = () => {
  selectedFile.value = null;
};

const uploadImage = async () => {
  if (!selectedFile.value) return;
  isUploading.value = true;

  try {
    emit('onUploadImage');
  } catch (error) {
    const msg = (error as { message?: string })?.message ?? 'An error occurred';
    ElMessage({ message: msg, type: 'error', plain: true });
  } finally {
    isUploading.value = false;
  }
};
</script>

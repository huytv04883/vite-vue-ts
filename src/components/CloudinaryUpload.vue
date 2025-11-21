<template>
  <div class="upload-container">
    <input type="file" accept="image/*" @change="handleFileChange" ref="fileInput" />
    <button @click="uploadImage" :disabled="!selectedFile || isUploading">
      {{ isUploading ? 'Uploading...' : 'Upload' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { handleUploadImageToCloudinary } from '@/services/uploadService';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';

defineOptions({
  name: 'CloudinaryUpload',
});
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

const uploadImage = async () => {
  if (!selectedFile.value) return;
  isUploading.value = true;

  try {
    await handleUploadImageToCloudinary(selectedFile.value).then((url) => {
      console.log("url", url);      
    });
  } catch (error) {
    const msg = (error as { message?: string })?.message ?? 'An error occurred';
    ElMessage({ message: msg, type: 'error', plain: true });
  } finally {
    isUploading.value = false;
  }
};
</script>

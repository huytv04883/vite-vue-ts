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
      :class="{ 'is-uploading': props.isUploading }"
      @click="handleCancel"
      :disabled="!selectedFile || props.isUploading"
      type="default"
      >Cancel</el-button
    >
    <el-button
      class="cloudinary-upload__button submit"
      :class="{ 'is-uploading': props.isUploading }"
      @click="uploadImage"
      :disabled="!selectedFile || props.isUploading"
      type="primary"
    >
      {{ props.isUploading ? 'Uploading...' : 'Upload' }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { Camera } from '@element-plus/icons-vue';
import { ref, watch } from 'vue';

defineOptions({
  name: 'CloudinaryUpload',
});
const props = defineProps<{
  isUploading: boolean;
}>();

const emit = defineEmits(['onUploadImage', 'onSelectAvatar', 'onCancel']);

const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    selectedFile.value = file;
    emit('onSelectAvatar', file);
  }
};

const handleCancel = () => {
  emit('onCancel');
  selectedFile.value = null;
};

const uploadImage = async () => {
  if (!selectedFile.value) return;
  emit('onUploadImage', selectedFile.value);
  selectedFile.value = null;
};

watch(
  () => selectedFile.value,
  (newFile) => {
    if (!newFile && fileInput.value) {
      fileInput.value.value = '';
    }
  },
);
</script>

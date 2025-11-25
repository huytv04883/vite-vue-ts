<template>
  <div class="image-sending">
    <div class="image-sending__wrapper">
      <img
        v-if="!isSending && imageUrl.length > 0"
        :src="imageUrl"
        :width="width"
        :height="height"
        alt="Sending image"
        class="image-sending__image"
      />
      <div v-if="isSending" class="image-sending__overlay">
        <div class="image-sending__progress">
          <img
            :src="imageUrl"
            :width="width"
            :height="height"
            alt="Sending image"
            class="image-sending__image"
          />
          <span>Sending...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'ImageSending',
});

withDefaults(
  defineProps<{
    imageUrl: string;
    isSending?: boolean;
    width?: number;
    height?: number;
  }>(),
  {
    isSending: false,
    width: 120,
    height: 120,
  },
);
</script>

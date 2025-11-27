<template>
  <div class="notification-info">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>Notification Info</span>
        </div>
      </template>

      <!-- Device Info -->
      <div class="info-section">
        <el-alert :type="deviceInfo.canUseWebPush ? 'success' : 'warning'" :closable="false">
          <template #title>
            <strong>Device:</strong> {{ deviceInfo.browserName }} on
            {{ deviceInfo.isIOS ? 'iOS' : deviceInfo.isAndroid ? 'Android' : 'Desktop' }}
          </template>
          <div v-if="deviceInfo.isPWA">Running as PWA</div>
          <div v-else-if="deviceInfo.isIOS">Please add to Home Screen for notifications</div>
        </el-alert>
      </div>

      <!-- Notification Status -->
      <div class="status-section">
        <el-divider>Status</el-divider>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="Permission">
            <el-tag :type="permissionTagType">
              {{ notificationStatus.permission }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="Subscribed">
            <el-tag :type="isSubscribed ? 'success' : 'info'">
              {{ isSubscribed ? 'Yes' : 'No' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="Message">
            {{ notificationStatus.message }}
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- Actions -->
      <div class="actions-section">
        <el-divider>Actions</el-divider>

        <!-- Request Permission -->
        <el-button
          v-if="notificationStatus.canRequest"
          type="primary"
          :loading="loading"
          @click="handleRequestPermission"
        >
          Enable Notifications
        </el-button>

        <!-- Install PWA (iOS only) -->
        <el-alert
          v-if="notificationStatus.needsPWAInstall"
          type="info"
          :closable="false"
          class="install-alert"
        >
          <strong>iOS Users:</strong> Tap Share
          <el-icon><Share /></el-icon>
          → Add to Home Screen to enable notifications
        </el-alert>

        <!-- Subscribe/Unsubscribe -->
        <el-button
          v-if="notificationStatus.permission === 'granted'"
          :type="isSubscribed ? 'danger' : 'success'"
          :loading="loading"
          @click="handleToggleSubscription"
        >
          {{ isSubscribed ? 'Unsubscribe' : 'Subscribe to Push' }}
        </el-button>

        <!-- Test Notification -->
        <el-button
          v-if="notificationStatus.permission === 'granted'"
          type="warning"
          :loading="loading"
          @click="handleTestNotification"
        >
          Test Notification
        </el-button>

        <!-- Blocked -->
        <el-alert
          v-if="notificationStatus.permission === 'denied'"
          type="error"
          :closable="false"
          class="blocked-alert"
        >
          Notifications are blocked. Please enable them in your browser settings.
        </el-alert>
      </div>

      <!-- Debug Info -->
      <div v-if="currentUser" class="debug-section">
        <el-divider>Debug Info</el-divider>
        <el-text size="small" type="info">User ID: {{ currentUser.uid }}</el-text>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { auth } from '@/firebase/config';
import {
  checkNotificationStatus,
  requestNotificationPermission,
  showTestNotification,
} from '@/services/notificationService';
import {
  getCurrentSubscription,
  subscribeToPush,
  unsubscribeFromPush,
} from '@/services/pushService';
import { detectDevice } from '@/utils/device';
import { MESSAGES } from '@/utils/message';
import { Share } from '@element-plus/icons-vue';
import { computed, onMounted, ref } from 'vue';

const loading = ref(false);
const deviceInfo = ref(detectDevice());
const notificationStatus = ref(checkNotificationStatus());
const isSubscribed = ref(false);
const currentUser = computed(() => auth.currentUser);

const permissionTagType = computed(() => {
  switch (notificationStatus.value.permission) {
    case 'granted':
      return 'success';
    case 'denied':
      return 'danger';
    default:
      return 'info';
  }
});

const checkSubscription = async () => {
  const subscription = await getCurrentSubscription();
  isSubscribed.value = !!subscription;
};

const handleRequestPermission = async () => {
  loading.value = true;
  try {
    notificationStatus.value = await requestNotificationPermission();
    if (notificationStatus.value.permission === 'granted') {
      MESSAGES.success('Notification permission granted!', 1);
    } else {
      MESSAGES.warning('Notification permission denied', 1);
    }
  } catch {
    MESSAGES.error('Failed to request permission', 1);
  } finally {
    loading.value = false;
  }
};

const handleToggleSubscription = async () => {
  if (!currentUser.value) {
    MESSAGES.error('Please login first', 1);
    return;
  }

  loading.value = true;
  try {
    if (isSubscribed.value) {
      // Unsubscribe
      const success = await unsubscribeFromPush(currentUser.value.uid);
      if (success) {
        isSubscribed.value = false;
        MESSAGES.success('Unsubscribed from notifications', 1);
      }
    } else {
      // Subscribe
      const subscription = await subscribeToPush(currentUser.value.uid);
      if (subscription) {
        isSubscribed.value = true;
        MESSAGES.success('Subscribed to notifications!', 1);
      } else {
        MESSAGES.error('Failed to subscribe', 1);
      }
    }
<<<<<<< HEAD
  } catch {
    MESSAGES.error('Subscription error', 1);
=======
  } catch (error) {
    MESSAGES.error('Subscription error', 1);
    console.error(error);
>>>>>>> ab702f6082acd85d96f26821f0c4b20b3f5d2d9c
  } finally {
    loading.value = false;
  }
};

const handleTestNotification = async () => {
  loading.value = true;
  try {
    const success = await showTestNotification();
    if (success) {
      MESSAGES.success('Test notification sent!', 1);
    } else {
      MESSAGES.error('Failed to send test notification', 1);
    }
  } catch {
    MESSAGES.error('Error sending notification', 1);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  checkSubscription();
});
defineOptions({
  name: 'NotificationSettings',
});
</script>


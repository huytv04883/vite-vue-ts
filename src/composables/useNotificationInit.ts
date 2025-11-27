import { auth } from '@/firebase/config';
import {
  checkNotificationStatus,
  NotificationStatus,
  requestNotificationPermission,
} from '@/services/notificationService';
import { subscribeToPush } from '@/services/pushService';
import { LOGs } from '@/utils/common';
import { ref } from 'vue';

export const useNotificationInit = () => {
  const notificationStatus = ref<NotificationStatus>(checkNotificationStatus());

  const requestPermissionNotify = async () => {
    try {
      const status = await requestNotificationPermission();

      notificationStatus.value = status;
      if (status.permission === 'granted') {
        const currentUserId = auth.currentUser?.uid;
        if (!currentUserId) {
          LOGs.warn('No user logged in, cannot subscribe to push notifications');
          return;
        }

        /**Always try to subscribe and save to Firestore
        This ensures subscription is fresh and stored */
        await subscribeToPush(currentUserId);
        return;
      }
    } catch (error) {
      throw new Error('Failed to request notification permission: ' + (error as Error).message);
    }
  };

  return {
    notificationStatus,
    requestPermissionNotify,
  };
};

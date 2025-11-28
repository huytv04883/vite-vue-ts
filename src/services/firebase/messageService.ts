import { messaging } from '@/firebase/config';
import { LOGs } from '@/utils/common';
import { getToken } from 'firebase/messaging';

export async function requestFcmToken() {
  try {
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    LOGs.success(token);
    return token;
  } catch (err) {
    LOGs.error(err);
  }
}

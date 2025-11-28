import { getAuth } from 'firebase/auth';
import { subscribeToPush } from './pushService';
import { LOGs } from '@/utils/common';

const auth = getAuth();

export const initNoti = async () => {
  const registration = await registerServiceWorker();
  if (!registration || !auth.currentUser) return;

  const permission = await Notification.requestPermission();

  if (permission !== 'granted') {
    console.warn('Notification permission not granted.');
  }

  await subscribeToPush(auth.currentUser?.uid as string);
};

export const registerServiceWorker = async () => {
  /** Register Service Worker */
  if ('serviceWorker' in navigator) {
    // const registration = await navigator.serviceWorker.register('/sw.js');
    const firebaseMsg = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    LOGs.success(firebaseMsg);
    return firebaseMsg;
  }
};

export const pushMessageToCloudflareWorker = async (token: string, message: string) => {
  try {
    const auth = getAuth();
    await fetch(import.meta.env.VITE_PUSH_WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        title: `New message from ${auth.currentUser?.displayName || 'Someone'}`,
        body: message,
      }),
    });
  } catch (error) {
    throw new Error('Error push message to cloudflare worker: ' + (error as Error).message);
  }
};

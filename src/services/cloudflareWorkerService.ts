import { LOGs, urlBase64ToUint8Array } from '@/utils/common';
import { getAuth } from 'firebase/auth';

export const initNoti = async () => {
  const registration = await registerServiceWorker();
  if (!registration) return;

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    console.warn('Notification permission not granted.');
  }

  await subscribePush();
};

export const registerServiceWorker = async () => {
  /** Register Service Worker */
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.register('/sw.js');
    return registration;
  }
};

export const subscribeUser = async (subscription: PushSubscription) => {
  try {
    const auth = getAuth();
    await fetch(import.meta.env.VITE_PUSH_WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: auth.currentUser?.uid,
        subscription,
      }),
    });
  } catch (error) {
    throw new Error('Error subscribing to push in Cloudflare Worker: ' + (error as Error).message);
  }
};

export const subscribePush = async () => {
  const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
  const registration = await navigator.serviceWorker.ready;

  // Subscribe to push notifications
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true, // Must be true for web push
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource,
  });

  const existingSubscription = await registration.pushManager.getSubscription();
  LOGs.info(existingSubscription);

  if (existingSubscription) return;
  await subscribeUser(subscription);
};

export const unsubscribeFromPush = async () => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
    }
    LOGs.success('Unsubscribed from push notifications.');
    return true;
  } catch {
    return false;
  }
};

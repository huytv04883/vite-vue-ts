import { db } from '@/firebase/config';
import { PushSubscription } from '@/types/subcription.type';
import { urlBase64ToUint8Array } from '@/utils/common';
import { collection, deleteDoc, doc, setDoc } from 'firebase/firestore';

/**
 * Save push subscription to Firestore
 */
const saveSubscriptionToFirestore = async (userId: string, subscription: PushSubscription) => {
  const subscriptionRef = doc(collection(db, 'pushSubscriptions'), userId);
  await setDoc(subscriptionRef, {
    userId,
    subscription,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
};

/**
 * Delete push subscription from Firestore
 */
const deleteSubscriptionFromFirestore = async (userId: string) => {
  const subscriptionRef = doc(collection(db, 'pushSubscriptions'), userId);
  await deleteDoc(subscriptionRef);
};

/**
 * Subscribe to push notifications
 */
export const subscribeToPush = async (userId: string): Promise<PushSubscription | null> => {
  try {
    // Check if Service Worker is ready
    const registration = await navigator.serviceWorker.ready;

    // Get VAPID public key from env
    const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
    if (!vapidPublicKey) {
      throw new Error('VAPID public key not found in environment variables');
    }

    // Subscribe to push notifications
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true, // Must be true for web push
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource,
    });

    // Convert subscription to plain object
    const subscriptionObject = subscription.toJSON();
    const pushSubscription: PushSubscription = {
      endpoint: subscriptionObject.endpoint!,
      keys: {
        p256dh: subscriptionObject.keys!.p256dh!,
        auth: subscriptionObject.keys!.auth!,
      },
    };

    // Save subscription to Firestore
    await saveSubscriptionToFirestore(userId, pushSubscription);
    return pushSubscription;
  } catch (error) {
    throw new Error('Error subscribing to push: ' + (error as Error).message);
  }
};

/**
 * Unsubscribe from push notifications
 */
export const unsubscribeFromPush = async (userId: string): Promise<boolean> => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
    }
    await deleteSubscriptionFromFirestore(userId);

    return true;
  } catch (error) {
    console.error('Error unsubscribing from push:', error);
    return false;
  }
};

/**
 * Get current push subscription
 */
export const getCurrentSubscription = async (): Promise<PushSubscription | null> => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      return null;
    }

    const subscriptionObject = subscription.toJSON();
    return {
      endpoint: subscriptionObject.endpoint!,
      keys: {
        p256dh: subscriptionObject.keys!.p256dh!,
        auth: subscriptionObject.keys!.auth!,
      },
    };
  } catch (error) {
    console.error('Error getting subscription:', error);
    return null;
  }
};

import { db } from '@/firebase/config';
import { PushSubscription } from '@/types/subcription.type';
import { urlBase64ToUint8Array } from '@/utils/common';
import { collection, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';

/**
 * Save user subscription to Firestore
 */
export const saveSubscriptionToFirestore = async (
  userId: string,
  subscription: PushSubscription,
) => {
  const subscriptionRef = doc(collection(db, 'users_subscriptions'), userId);
  await setDoc(subscriptionRef, {
    userId,
    subscription,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
};

/**
 * Delete user subscription from Firestore
 */
export const deleteSubscriptionFromFirestore = async (userId: string) => {
  const subscriptionRef = doc(collection(db, 'users_subscriptions'), userId);
  await deleteDoc(subscriptionRef);
};

export const isUserSubscriptionExists = async (userId: string) => {
  const subscriptionRef = doc(collection(db, 'users_subscriptions'), userId);
  const docSnap = await getDoc(subscriptionRef);
  return docSnap.exists();
};

/**
 * Subscribe to push notifications
 */
export const subscribeToPush = async (userId: string) => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true, // Must be true for web push
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource,
    });

    const subscriptionObject = subscription.toJSON();
    const pushSubscription: PushSubscription = {
      endpoint: subscriptionObject.endpoint!,
      keys: {
        p256dh: subscriptionObject.keys!.p256dh!,
        auth: subscriptionObject.keys!.auth!,
      },
    };

    if (userId || subscription) {
      const isExistUserSub = await isUserSubscriptionExists(userId);
      if (!isExistUserSub) {
        await saveSubscriptionToFirestore(userId, pushSubscription);
      }
    }
  } catch (error) {
    throw new Error('Error subscribing to push: ' + (error as Error).message);
  }
};

/**
 * Unsubscribe from push notifications
 */
export const unsubscribeFromPush = async () => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
    }
    return true;
  } catch {
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
  } catch {
    return null;
  }
};

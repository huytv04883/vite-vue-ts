import { db } from '@/firebase/config';
import { PushSubscription } from '@/types/subcription.type';
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

import { db } from '@/firebase/config';
import { PushSubscription, UserSubscription } from '@/types/subcription.type';
import { doc, getDoc } from 'firebase/firestore';

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: {
    chatId: string;
    senderId: string;
    senderName: string;
    messageId?: string;
    url: string;
  };
}

/**
 * Get user's push subscription from Firestore
 */
export const getUserSubcription = async (userId: string) => {
  const userRef = doc(db, 'pushSubscriptions', userId);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return null;
  return snap.data() as UserSubscription;
};

/**
 * Get user's push subscription from Firestore (returns subscription object only)
 */
export const getUserSubscription = async (userId: string): Promise<PushSubscription | null> => {
  try {
    const userSubscription = await getUserSubcription(userId);
    if (!userSubscription) {
      console.log(`No subscription found for user ${userId}`);
      return null;
    }
    return userSubscription.subscription;
  } catch (error) {
    console.error('Error getting user subscription:', error);
    return null;
  }
};

/**
 * Send push notification via Cloudflare Worker
 */
export const sendPushNotification = async (
  subscription: PushSubscription,
  payload: NotificationPayload,
): Promise<boolean> => {
  try {
    const workerUrl = import.meta.env.VITE_PUSH_WORKER_URL;
    
    if (!workerUrl || workerUrl.includes('YOUR_SUBDOMAIN')) {
      console.warn('⚠️ Cloudflare Worker URL not configured. Please update VITE_PUSH_WORKER_URL in .env');
      return false;
    }

    console.log('📨 [SENDING PUSH] via Cloudflare Worker', {
      endpoint: subscription.endpoint.substring(0, 50) + '...',
      payload,
    });

    const response = await fetch(`${workerUrl}/send-push`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        subscription, 
        payload 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Push notification failed:', errorData);
      return false;
    }

    const result = await response.json();
    console.log('Push notification sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Error sending push notification:', error);
    return false;
  }
};

/**
 * Trigger notification when a new message is sent
 */
export const notifyNewMessage = async (
  recipientId: string,
  senderId: string,
  senderName: string,
  messageText: string,
  chatId: string,
  messageId?: string,
): Promise<boolean> => {
  try {
    // Don't send notification to yourself
    if (recipientId === senderId) {
      console.log('Skipping notification: sender and recipient are the same');
      return false;
    }

    // Get recipient's subscription
    const subscription = await getUserSubscription(recipientId);

    if (!subscription) {
      console.log(`Recipient ${recipientId} is not subscribed to push notifications`);
      return false;
    }

    // Truncate message if too long
    const displayText =
      messageText.length > 100 ? `${messageText.substring(0, 100)}...` : messageText;

    // Create notification payload
    const payload: NotificationPayload = {
      title: senderName,
      body: displayText,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-72.png',
      data: {
        chatId,
        senderId,
        senderName,
        messageId,
        url: `/chat/${chatId}`,
      },
    };

    // Send push notification
    const success = await sendPushNotification(subscription, payload);

    if (success) {
      console.log('Notification triggered for user:', recipientId);
    }

    return success;
  } catch (error) {
    console.error('Error notifying new message:', error);
    return false;
  }
};

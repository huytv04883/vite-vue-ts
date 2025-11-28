import { db } from '@/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { pushMessageToCloudflareWorker } from '../cloudflareWorkerService';

export const pushNotifyUser = async (userId: string, message: string) => {
  const docRef = doc(db, 'users_subscriptions', userId);
  const snap = await getDoc(docRef);
  const subcription = snap.data();
  if (!subcription) return;

  await pushMessageToCloudflareWorker(subcription.subscription, message);
};

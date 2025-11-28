import { pushMessageToCloudflareWorker } from '../cloudflareWorkerService';
import { requestFcmToken } from './messageService';

export const pushNotifyUser = async (message: string) => {
  const token = await requestFcmToken();
  if (!token) return;

  await pushMessageToCloudflareWorker(token, message);
};

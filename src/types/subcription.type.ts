export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface UserSubscription {
  createdAt: string;
  subscription: PushSubscription;
  updateAt: string;
  userId: string;
}

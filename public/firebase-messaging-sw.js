self.importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
self.importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: '%%VITE_FIREBASE_API_KEY%%',
  authDomain: '%%VITE_FIREBASE_AUTH_DOMAIN%%',
  projectId: '%%VITE_FIREBASE_PROJECT_ID%%',
  storageBucket: '%%VITE_FIREBASE_STORAGE_BUCKET%%',
  messagingSenderId: '%%VITE_FIREBASE_MESSAGING_SENDER_ID%%',
  appId: '%%VITE_FIREBASE_APP_ID%%',
  measurementId: '%%VITE_FIREBASE_MEASUREMENT_ID%%',
};

self.firebase.initializeApp(firebaseConfig);

const messaging = self.firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Background message:', payload);

  const title = payload.notification?.title;
  const body = payload.notification?.body;

  self.registration.showNotification(title, {
    body,
    icon: '/icons/icons/ss.png',
  });
});

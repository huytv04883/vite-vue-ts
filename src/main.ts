import { Cloudinary } from '@cloudinary/url-gen';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createApp } from 'vue';
import App from './App.vue';
import './assets/styles/main.scss';
import router from './router';
import { waitForAuthReady } from './utils/firebaseAuthReady';
import { LOGs } from './utils/common';

const cloudinary = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  },
});

/** Register Service Worker */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(async (registration) => {
      const subscription = await registration.pushManager.getSubscription();
      LOGs.success(subscription);
    })
    .catch((error) => {
      LOGs.error((error as Error).message);
    });
}

waitForAuthReady().then((res) => {
  router.authUser = res;
  const pinia = createPinia();
  pinia.use(piniaPluginPersistedstate);
  const app = createApp(App);
  app.use(ElementPlus);
  app.use(router);
  app.use(pinia);

  app.provide('cloudinary', cloudinary);
  app.mount('#app');
});

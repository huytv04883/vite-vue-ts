import { createApp } from 'vue';
import './assets/styles/main.scss';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { waitForAuthReady } from './utils/firebaseAuthReady';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { Cloudinary } from '@cloudinary/url-gen';

const cloudinary = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  },
});

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

import { createApp } from 'vue';
import './style.css';
import './assets/styles/main.scss';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { waitForAuthReady } from './utils/firebaseAuthReady';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

waitForAuthReady().then((res) => {
  router.authUser = res;
  const pinia = createPinia();
  pinia.use(piniaPluginPersistedstate);
  const app = createApp(App);
  app.use(ElementPlus);
  app.use(router);
  app.use(pinia);
  app.mount('#app');
});

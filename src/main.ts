import { createApp } from 'vue';
import './style.css';
import './assets/styles/main.scss';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus'
import { waitForAuthReady } from './utils/firebaseAuthReady';

waitForAuthReady().then(() => {
  const app = createApp(App);
  app.use(ElementPlus);
  app.use(router);
  app.mount('#app');
});

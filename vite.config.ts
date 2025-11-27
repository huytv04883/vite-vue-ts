import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

<<<<<<< HEAD
// https://vite.dev/config/
=======
/** https://vite.dev/config */
>>>>>>> feature/noti
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/assets/styles/_variables.scss" as *;
          @use "@/assets/styles/_mixins.scss" as *;
        `,
      },
    },
  },
  server: {
<<<<<<< HEAD
    allowedHosts: ['fd80822cbfab.ngrok-free.app', 'shasimi.vercel.app/'],
=======
    allowedHosts: ['shasimi.vercel.app/'],
>>>>>>> feature/noti
  },
});

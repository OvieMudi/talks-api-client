import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dotenv from 'dotenv';

dotenv.config();

const serverUrl = process.env.SERVER_BASE_URL;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: `http://${serverUrl}`,
        changeOrigin: true,
      },
      '/socket.io': {
        target: `ws://${serverUrl}`,
        ws: true,
      },
    },
  },
});

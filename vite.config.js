import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// When you open the raw Vite port (5173), it serves the app but NOT the
// serverless functions — only `netlify dev` (8899) runs those. This proxy
// forwards any /.netlify/functions/* call from 5173 over to the netlify dev
// server so checkout works no matter which port you have open.
// Requires `netlify dev` to be running (npm run dev:netlify). Override the
// target with NETLIFY_DEV_URL if netlify dev picks a different port.
const NETLIFY_DEV_URL = process.env.NETLIFY_DEV_URL || 'http://localhost:8899';

export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true,
    proxy: {
      '/.netlify/functions': {
        target: NETLIFY_DEV_URL,
        changeOrigin: true,
      },
    },
  },
});
